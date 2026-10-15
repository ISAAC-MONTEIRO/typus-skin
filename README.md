# TYPUS — skins

Skins mudam a aparência do TYPUS: cores, cantos, sombras, fontes, fundo e detalhes de cada parte da
tela. Elas são só **CSS + variáveis** — não mudam o funcionamento do app nem rodam código.

Uma skin carregada fica **salva na sua conta** e aparece em todos os seus dispositivos.

```
typus-skin/
├── modelo/              ← copie esta pasta para começar
│   ├── skin.json        nome, autor, versão e as variáveis (cores, cantos…)
│   └── skin.css         CSS extra, preso aos ganchos [data-typus]
├── skins/               skins prontas (exemplos para se inspirar)
│   ├── typus-98/        visual Windows 98
│   └── liquid-glass/    vidro claro, inspirado no Liquid Glass do iOS
├── docs/
│   ├── variaveis.md     todas as variáveis --typ-* e o que cada uma pinta
│   └── ganchos.md       todos os ganchos [data-typus="..."]
├── scripts/
│   └── empacotar.mjs    confere a skin e gera o .typus-skin
└── dist/                os .typus-skin gerados (não vão para o git)
```

## Criar uma skin em 5 passos

Você precisa de [Node.js](https://nodejs.org/) 18 ou mais novo (só para empacotar).

1. **Copie o modelo** para uma pasta com o nome da sua skin (sem espaços):

   ```bash
   cp -r modelo skins/minha-skin
   ```

   No Windows (PowerShell): `Copy-Item -Recurse modelo skins\minha-skin`

2. **Edite o `skin.json`**: troque `name`, `author`, `version` e `description`, e ajuste as
   variáveis em `tokens`. Comece pelas cores e pelo fundo — elas sozinhas já mudam muito.
   A lista completa está em [docs/variaveis.md](docs/variaveis.md).

3. **(Opcional) Edite o `skin.css`** para o que as variáveis não alcançam: bordas especiais,
   texturas, animações. Use sempre os ganchos de [docs/ganchos.md](docs/ganchos.md).

4. **Empacote:**

   ```bash
   node scripts/empacotar.mjs skins/minha-skin
   ```

   O script confere a skin com as mesmas regras do app e gera `dist/minha-skin.typus-skin`. Se
   algo for proibido, ele mostra o erro e não gera o arquivo.

5. **Suba no app:** **Configurações → Personalização → Skins → Carregar skin** e escolha o
   `.typus-skin`.

## Testando

Ao carregar (ou escolher) uma skin, ela é aplicada na hora e aparece:

> **Manter esta skin? Voltando em 15 s** — `Voltar` · `Manter`

Se você não clicar em **Manter**, a skin anterior volta sozinha em 15 segundos (ou na hora, com
`Esc`). Assim uma skin com problema nunca deixa ninguém preso.

Para ajustar: edite, empacote de novo e carregue de novo. Uma skin com o **mesmo `name` e
`author`** substitui a versão anterior na sua conta, em vez de duplicar — vale subir a `version`
a cada mudança.

**Saída de emergência:** se uma skin deixar a tela ilegível e você já tiver clicado em Manter,
abra o endereço do TYPUS com `?sem-skin` no final (ex.: `https://typus.exemplo/?sem-skin`) ou
aperte **Ctrl + Alt + Shift + S**. A skin é desligada na hora.

## O `skin.json`

```json
{
  "name": "Minha skin",
  "author": "Seu nome",
  "version": "1.0.0",
  "description": "Uma frase sobre a skin.",
  "tokens": {
    "--typ-color-primary": "#ff7a59",
    "--typ-rgb-primary": "255, 122, 89"
  }
}
```

| Campo | Obrigatório | Observação |
|---|---|---|
| `name` | recomendado | até 60 caracteres; sem ele, o app usa o nome do arquivo |
| `author` | não | até 60 caracteres; aparece como "por Fulano" |
| `version` | não | aparece como "v1.0.0" |
| `description` | não | até 200 caracteres; aparece ao passar o mouse na skin |
| `tokens` | não | variáveis `--typ-*` (veja [docs/variaveis.md](docs/variaveis.md)) |

Toda cor tem **dois formatos** — declare os dois: `--typ-color-primary: "#ff7a59"` e
`--typ-rgb-primary: "255, 122, 89"`. Sem o `rgb`, partes translúcidas ficam com a cor antiga.

As variáveis também funcionam no `skin.css` (`body { --typ-color-primary: #ff7a59 !important; }`),
mas no `skin.json` elas são aplicadas direto, sem `!important`, e o empacotador confere os valores.

## Regras

O app aplica estas regras ao carregar a skin e **remove** o que estiver fora delas:

- **Só CSS.** Nada de JavaScript, `expression()`, `javascript:`, `-moz-binding` ou `<style>`.
- **Nada de fora.** Nada de importar outros arquivos CSS nem de carregar imagens ou fontes da
  internet. Imagens e fontes só embutidas (veja abaixo).
- **Variáveis só `--typ-*`**, com valores sem `url(...)`, `;`, `{`, `}`, `<` ou `>`.
- **Ganchos, não classes.** As classes do app mudam a cada versão; use `[data-typus="..."]`.
- **Tamanho:** até **150 KB** por skin (CSS + variáveis); um arquivo com mais de 600 KB é recusado
  antes mesmo de ser lido. Cada conta guarda até **10 skins** (cerca de 600 KB no total).
- **Textos:** `version` com até 20 caracteres.
- **Cuidado com comentários:** a limpeza do app não pula comentários. Não escreva o nome das
  regras proibidas (a de importar arquivos, os endereços de internet) nem dentro de um comentário.

## Imagens e fontes

Imagens e fontes entram **dentro** do `skin.css`, convertidas em base64 (endereços
`data:image/…`, `data:font/…` ou `data:application/font-…`). Gere o texto base64:

```powershell
# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("fonte.woff2")) | Set-Clipboard
```

```bash
# Linux / macOS
base64 -w0 fonte.woff2
```

E use no CSS:

```css
@font-face {
  font-family: "Minha Fonte";
  src: url(data:font/woff2;base64,COLE_AQUI) format("woff2");
}
```

Depois aponte `--typ-font-ui` no `skin.json` para `"\"Minha Fonte\", sans-serif"`.

- Base64 aumenta o arquivo em cerca de um terço: uma fonte `.woff2` de 60 KB vira 80 KB. Prefira
  `.woff2` e fontes pequenas, por causa do limite de 150 KB.
- **Licença:** só embuta imagens e fontes que você pode distribuir (fontes com licença livre,
  como a SIL Open Font License, ou feitas por você).

## Boas práticas

- **Contraste:** confira se o texto continua legível. Teste com e sem papel de parede, e com um
  papel de parede claro.
- **Papel de parede:** para respeitar o da pessoa, use
  `"--typ-c-shell-app": "var(--typ-background-app, <seu fundo>)"`.
- **Movimento:** envolva animações em `@media (prefers-reduced-motion: reduce) { … animation: none }`.
- **Não estilize** a caixa "Manter esta skin?" (`[data-typus="skin-trial"]`): ela é protegida
  para funcionar com qualquer skin.

## Compartilhar uma skin

Mande o `.typus-skin` para quem quiser usar, ou contribua com este repositório: crie sua pasta em
`skins/`, confira com `node scripts/empacotar.mjs skins/sua-skin` e abra um pull request. Para
gerar todas as skins do repositório de uma vez: `node scripts/empacotar.mjs --todas`.

## Licença

MIT (veja `LICENSE`): pode copiar, modificar e redistribuir as skins e o modelo à vontade, desde
que mantenha o aviso de licença. O app TYPUS em si é licenciado à parte, sob a AGPL-3.0.
