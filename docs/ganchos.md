# Ganchos (`[data-typus="..."]`)

São marcadores fixos nas partes do TYPUS. Use-os como seletores no `skin.css`:

```css
[data-typus="chat"] {
  border-radius: 18px;
}
```

**Por que não usar classes?** As classes do app (`.dnRKLX`, `.hYZFjI`…) são geradas
automaticamente e mudam a cada versão. Uma skin presa a elas quebra na próxima atualização. Os
ganchos abaixo são mantidos de propósito para as skins.

> Lista tirada do código do app (versão de outubro de 2026).

## Telas e painéis

| Gancho | Onde fica |
|---|---|
| `app` | a interface inteira, depois de entrar (bom para regras gerais: `[data-typus="app"] *`) |
| `content` | tudo à direita da barra lateral |
| `login` | a tela de entrar / criar conta (o fundo inteiro) |
| `login-card` | o cartão do meio da tela de entrar |
| `home` | a tela Início (painel com os widgets) |
| `rail` | coluna dos ícones de servidor, na extrema esquerda |
| `sidebar` | barra lateral (fixados, pastas e a lista do servidor) |
| `server-card` | cartão do servidor (banner, nome, membros) no topo da lista |
| `channels` | lista de canais do servidor |
| `user-footer` | barra do usuário, no canto inferior esquerdo |
| `edge-flag` | faixas das setas de recolher (atributo extra: `data-side="left"` ou `"right"`) |
| `header` | cabeçalho do canal (nome, descrição, botões) |
| `chat` | área do chat (mensagens + campo de digitar) |
| `message` | cada mensagem (use `:hover` para a mensagem com o mouse em cima) |
| `composer` | caixa do campo de digitar |
| `members` | painel da direita (membros, busca, fixados, Rádio) |
| `call` | card da chamada de voz |
| `call-controls` | barra de controles da chamada (microfone, câmera, encerrar…) |
| `settings` | janela de configurações (o fundo inteiro) |
| `settings-nav` | menu da esquerda das configurações |
| `settings-page` | conteúdo da página aberta nas configurações |
| `dialog` | janelas (confirmações, convites, criar canal…). A caixa visível é o filho direto: `[data-typus="dialog"] > div` |

## Controles

Estes ganchos ficam no próprio controle, em todo lugar onde ele aparece.

| Gancho | O que é |
|---|---|
| `button` | botão com texto. Atributo extra `data-variant`: `filled` (principal), `tonal`, `elevated`, `outlined`, `text`, `_error` (destrutivo), `success`, `warning`, `error`, `primary`, `secondary`, `plain` |
| `icon-button` | botão só com ícone. `data-variant`: `standard` (liso), `filled`, `tonal`, `outlined` |
| `nav-item` | item das listas da barra lateral (canais, conversas, Início, Amigos…). Atributo extra `data-attention`: `normal`, `muted` (silenciado), `active` (com novidades), `selected` (aberto) |
| `input` | campo de texto: o `mdui-text-field` e os campos e áreas de texto comuns |
| `select` | botão de escolher uma opção (abre uma lista) |
| `checkbox` | caixa de marcar (`mdui-checkbox` ou `input[type=checkbox]`) |
| `radio` | opção de escolha única (`mdui-radio`) |
| `switch` | seletor permitir / neutro / negar das permissões |
| `slider` | controle deslizante (`mdui-slider`) |
| `tab` | grupo de botões segmentados (`mdui-segmented-button-group`) |
| `fab` | botão flutuante (`mdui-fab`) |
| `card` | linha de opção clicável das configurações e cartões de tema |
| `avatar` | foto de perfil / ícone de servidor (o formato também muda com `--typ-c-avatar-radius`) |
| `image-input` | quadro de escolher imagem (ícone do servidor, avatar, banner) |
| `media` | miniaturas de imagens na galeria (normalmente não precisa estilizar) |

## Coisas que flutuam

| Gancho | O que é |
|---|---|
| `popover` | camada flutuante: cartão de perfil, menus, seletor de emoji, autocompletar. A caixa visível é o filho direto: `[data-typus="popover"] > *` |
| `menu` | menus de contexto (botão direito) |
| `tooltip` | dicas ao passar o mouse |
| `quick-switcher` | a busca rápida (Ctrl+K) |
| `skin-list` | a lista de skins nas configurações |
| `skin-trial` | a caixa "Manter esta skin?" — **não estilize**: ela é protegida de propósito |

## Componentes MDUI (`::part`)

Alguns controles (`mdui-text-field`, `mdui-checkbox`, `mdui-slider`, `mdui-fab`) desenham o
interior num "shadow DOM", que o CSS comum não alcança. Para mexer dentro deles, use `::part()`:

| Controle | Partes |
|---|---|
| `mdui-text-field` | `container` (a caixa), `label`, `input`, `helper`, `counter`, `icon`, `end-icon` |
| `mdui-checkbox` | `control`, `unchecked-icon`, `checked-icon`, `indeterminate-icon`, `label` |
| `mdui-slider` | `track-inactive`, `track-active`, `handle`, `tickmark` |
| `mdui-fab` | `button`, `icon`, `label` |

```css
mdui-text-field[data-typus="input"]::part(container) {
  background: #ffffff;
}
```

As cores internas deles vêm das variáveis `--mdui-color-<papel>` (formato `R, G, B`). Dá para
trocar só num controle: `mdui-slider[data-typus="slider"] { --mdui-color-primary: 0, 122, 255; }`.

## Dicas

- Combine ganchos com atributos e estados: `[data-typus="button"][data-variant="filled"]`,
  `[data-typus="nav-item"][data-attention="selected"]`, `[data-typus="message"]:hover *`.
  Quanto mais curto o seletor, menor a chance de quebrar numa atualização.
- Seletores genéricos que também são estáveis: `[role="dialog"]`, `[role="menuitem"]`, `button`,
  `::selection`, `::-webkit-scrollbar`.
- O CSS da skin vence o do app mesmo com seletores simples. Use `!important` quando a parte tem
  estilo escrito direto no elemento (ex.: o banner do servidor, o fundo dos painéis no modo Glass).
  As skins prontas usam `!important` nas caixas e botões por isso.
- Variáveis (`--typ-*`) vão no `skin.json`, não no `skin.css`: é no `skin.json` que elas vencem o
  tema da pessoa.
- Precisa de um gancho que não existe? Peça no repositório do app (`typus-frontend`) em vez de
  usar uma classe.
