#!/usr/bin/env node
/**
 * Empacota uma skin em .typus-skin (um zip com skin.json + skin.css), pronta
 * para subir no TYPUS em Configurações → Personalização → Carregar skin.
 *
 * Uso:
 *   node scripts/empacotar.mjs skins/minha-skin     # uma skin
 *   node scripts/empacotar.mjs --todas              # todas as pastas de skins/
 *
 * O arquivo sai em dist/<pasta>.typus-skin. Antes de empacotar, o script
 * confere a skin com as mesmas regras que o app usa — o que o app removeria
 * vira erro aqui, para você ver antes de subir.
 *
 * Sem dependências: só Node.js 18 ou mais novo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

/** Limites do app (typus-frontend: components/state/skins.ts) */
const MAX_SKIN_SIZE = 150_000;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`\x1b[31mERRO:\x1b[0m ${message}`);
  process.exitCode = 1;
}

// ------------------------------------------------------------ validação ---

/**
 * Confere uma skin e devolve os problemas encontrados
 * @param dir Pasta da skin
 * @returns { errors, warnings, json, css }
 */
function validate(dir) {
  const errors = [];
  const warnings = [];
  const jsonPath = path.join(dir, "skin.json");
  const cssPath = path.join(dir, "skin.css");

  if (!fs.existsSync(jsonPath) && !fs.existsSync(cssPath)) {
    errors.push("a pasta precisa ter skin.json e/ou skin.css");
    return { errors, warnings };
  }

  let json = {};
  if (fs.existsSync(jsonPath)) {
    try {
      json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (error) {
      errors.push(`skin.json não é um JSON válido: ${error.message}`);
      return { errors, warnings };
    }
  }
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

  // detalhes
  if (typeof json.name !== "string" || !json.name.trim()) {
    warnings.push("skin.json sem \"name\": o app vai usar o nome do arquivo");
  } else if (json.name.length > 60) {
    warnings.push("\"name\" passa de 60 caracteres e será cortado");
  }
  if (json.author !== undefined && typeof json.author !== "string") errors.push("\"author\" precisa ser texto");
  if (json.version !== undefined && typeof json.version !== "string") errors.push("\"version\" precisa ser texto, ex.: \"1.0.0\"");
  if (json.description && json.description.length > 200) warnings.push("\"description\" passa de 200 caracteres e será cortada");

  // variáveis
  const tokens = json.tokens ?? {};
  if (typeof tokens !== "object" || Array.isArray(tokens)) {
    errors.push("\"tokens\" precisa ser um objeto { \"--typ-...\": \"valor\" }");
  } else {
    for (const [key, value] of Object.entries(tokens)) {
      if (!/^--typ-[\w-]+$/.test(key)) {
        errors.push(`variável "${key}": só variáveis --typ-* são aceitas`);
      } else if (typeof value !== "string") {
        errors.push(`variável "${key}": o valor precisa ser texto`);
      } else if (/url\(|expression|javascript:|[;{}<>]/i.test(value)) {
        errors.push(`variável "${key}": o valor não pode ter url(), ; { } < > ou código`);
      }
    }
  }

  // CSS
  if (/@import/i.test(css)) errors.push("skin.css: @import não é permitido (o app remove)");
  for (const match of css.matchAll(/url\(\s*(['"]?)([^)'"]*)\1\s*\)/gi)) {
    if (!/^data:(image\/|font\/|application\/(x-)?font-)/i.test(match[2].trim())) {
      errors.push(`skin.css: url(${match[2].slice(0, 40)}…) não é permitido — só imagens e fontes embutidas (data:image/… ou data:font/…)`);
    }
  }
  if (/expression\s*\(|javascript:|-moz-binding|<\/?style/i.test(css)) {
    errors.push("skin.css: tem código (expression, javascript:, <style>) — o app remove");
  }
  // seletores com classes (.algo): as classes do app mudam a cada versão
  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g)]
    .map((m) => m[1].split(";").pop().trim())
    .filter((sel) => !sel.startsWith("@") && !/^(from|to|\d+%)/.test(sel));
  if (selectors.some((sel) => /(^|[\s,>+~(])\.[a-zA-Z_-]/.test(sel))) {
    warnings.push("skin.css usa classes (.algo): elas mudam a cada versão do app — prefira [data-typus=\"...\"]");
  }

  const size = css.length + JSON.stringify(tokens).length;
  if (size > MAX_SKIN_SIZE) {
    errors.push(`skin grande demais: ${(size / 1000).toFixed(0)} KB (o limite é ${MAX_SKIN_SIZE / 1000} KB)`);
  }

  if (!css.trim() && !Object.keys(tokens).length) {
    errors.push("a skin está vazia (sem variáveis e sem CSS)");
  }

  return { errors, warnings, json, css, size };
}

// ----------------------------------------------------------------- zip ---

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Zip mínimo (deflate), no formato que o app lê
 * @param files { nome: Buffer }
 */
function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const [name, data] of Object.entries(files)) {
    const nameBuf = Buffer.from(name);
    const packed = deflateRawSync(data);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // nomes em UTF-8
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    locals.push(local, nameBuf, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);

    offset += 30 + nameBuf.length + packed.length;
  }

  const centralSize = centrals.reduce((sum, b) => sum + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

// -------------------------------------------------------------- empacotar ---

function pack(dir) {
  const name = path.basename(path.resolve(dir));
  const { errors, warnings, size } = validate(dir);
  for (const warning of warnings) console.warn(`\x1b[33maviso\x1b[0m (${name}): ${warning}`);
  if (errors.length) {
    for (const error of errors) fail(`${name}: ${error}`);
    return;
  }

  const files = {};
  for (const file of ["skin.json", "skin.css"]) {
    const full = path.join(dir, file);
    if (fs.existsSync(full)) files[file] = fs.readFileSync(full);
  }

  const outDir = path.join(root, "dist");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${name}.typus-skin`);
  fs.writeFileSync(out, zip(files));
  console.log(`\x1b[32mok\x1b[0m ${name} → ${path.relative(root, out)} (${(size / 1000).toFixed(1)} KB)`);
}

const args = process.argv.slice(2);
if (!args.length || args.includes("-h") || args.includes("--help")) {
  console.log("Uso: node scripts/empacotar.mjs <pasta-da-skin> | --todas");
  process.exit(args.length ? 0 : 1);
}

if (args.includes("--todas")) {
  const skinsDir = path.join(root, "skins");
  for (const entry of fs.readdirSync(skinsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) pack(path.join(skinsDir, entry.name));
  }
} else {
  for (const dir of args) pack(dir);
}
