# Variáveis (`--typ-*`)

As variáveis vão no `"tokens"` do `skin.json`. O app as aplica por cima do tema da pessoa, então
só declare o que quiser mudar — o resto continua como estava.

Valores aceitos: qualquer valor de CSS **sem** `url(...)`, `;`, `{`, `}`, `<`, `>` ou código.
`var(--outra-variavel)`, `rgba(...)`, `linear-gradient(...)` e afins funcionam.

> Lista tirada do código do app (versão de outubro de 2026). Se uma variável não tiver efeito,
> confira em `typus-frontend` — o app pode ter mudado.

## Cores

Toda cor existe em **dois formatos**, e a skin deve declarar os dois:

| Formato | Exemplo | Quem usa |
|---|---|---|
| `--typ-color-<papel>` | `#ff7a59` | a maior parte dos componentes |
| `--typ-rgb-<papel>` | `255, 122, 89` (sem `rgb()`) | transparências (`rgba(var(--typ-rgb-primary), 0.2)`) e componentes MDUI |

Se você declarar só o `color`, algumas partes (botões, seleções, fundos translúcidos) continuam
com a cor antiga. Declare **todos os papéis**: um papel que faltar aparece com a cor do tema da
pessoa (por exemplo, o roxo do TYPUS no meio de uma skin cinza).

| Papel | O que pinta |
|---|---|
| `primary` / `on-primary` | destaque principal (canal selecionado, botões cheios) e o texto sobre ele |
| `primary-container` / `on-primary-container` | destaques suaves e o texto sobre eles |
| `secondary`, `secondary-container`, `on-secondary-container` | botões tonais, chips |
| `tertiary`, `tertiary-container`, `on-tertiary-container` | detalhes de apoio |
| `error`, `on-error`, `error-container`, `on-error-container` | ações destrutivas e erros |
| `surface`, `surface-dim`, `surface-bright` | superfícies gerais |
| `surface-container-lowest` … `surface-container-highest` | cinco níveis de painel, do mais fundo ao mais elevado |
| `on-surface` | texto principal |
| `on-surface-variant` | texto secundário (horários, legendas) |
| `outline` / `outline-variant` | bordas e divisórias |
| `inverse-surface`, `inverse-on-surface`, `inverse-primary` | elementos invertidos (avisos, tooltips) |
| `scrim`, `shadow` | véu atrás de janelas e cor das sombras |

Presença (bolinha de status): `--typ-color-presence-online`, `-idle`, `-busy`, `-focus`, `-invisible`.

## Fundo e painéis

| Variável | O que faz |
|---|---|
| `--typ-c-shell-app` | o fundo atrás de tudo (a "área de trabalho") |
| `--typ-c-shell-sidebar` | painel da barra lateral |
| `--typ-c-shell-content` | painel atrás do chat |
| `--typ-c-shell-main` | painel do chat |
| `--typ-c-shell-section` | seções dentro da barra lateral |
| `--typ-c-shell-backdrop` | filtro atrás dos painéis (ex.: `blur(20px)`) |
| `--typ-c-edge-strip` | sombra das faixas das setas de recolher |

**Papel de parede:** quando a pessoa usa um papel de parede, ele fica em `--typ-background-app`.
Para respeitar o papel de parede dela e só usar o seu fundo quando não houver, escreva:

```json
"--typ-c-shell-app": "var(--typ-background-app, #1a1412)"
```

## Formas

| Variável | O que faz |
|---|---|
| `--typ-radius-none`, `-xs`, `-sm`, `-md`, `-lg`, `-li`, `-xl`, `-xli`, `-xxl`, `-full`, `-circle` | escala de cantos arredondados (use `0` em todas para cantos retos). Vale também para os botões redondos e para os controles MDUI (checkbox, slider, campo de texto) |
| `--typ-shadow-0` … `--typ-shadow-4` | sombras do nível mais baixo ao mais alto (aceitam `inset`, várias sombras separadas por vírgula) |
| `--typ-border-width` | espessura padrão das bordas |

## Texto

| Variável | O que faz |
|---|---|
| `--typ-font-ui` | fonte da interface (lista de fontes, como no CSS) |
| `--typ-font-mono` | fonte de código |
| `--typ-message-size` | tamanho do texto das mensagens (ex.: `14px`) |
| `--typ-tracking` | espaçamento entre letras |
| `--typ-emoji-size`, `--typ-emoji-size-medium`, `--typ-emoji-size-large` | tamanhos de emoji |

Fontes de fora não carregam. Use fontes que já existem no computador da pessoa ou embuta a fonte
no `skin.css` (veja "Imagens e fontes" no README).

## Movimento e efeitos

| Variável | O que faz |
|---|---|
| `--typ-motion-fast`, `--typ-motion-medium` | duração + curva das animações (ex.: `0.2s ease`, `0.12s steps(4)`) |
| `--typ-motion-scale` | multiplicador das animações |
| `--typ-effect-blur` | desfoque de elementos flutuantes (ex.: `blur(20px)`, ou `none`) |

## Espaçamento

`--typ-space-none`, `-xxs`, `-xs`, `-s`, `-sm`, `-md`, `-l`, `-lg`, `-x`, `-xl`, `-xxl` e
`--typ-message-group-spacing`. Mexa com cuidado: espaços muito diferentes desalinham a interface.

## Componentes (`--typ-c-*`)

Ajustes finos por parte do app. Todos são opcionais.

### Botões e avatares
| Variável | O que faz |
|---|---|
| `--typ-c-button-disabled-fg`, `--typ-c-button-disabled-bg` | texto e fundo dos botões desativados |
| `--typ-c-avatar-radius` | formato dos avatares redondos e do quadro de escolher imagem (`0` = quadrado) |

### Navegação
| Variável | O que faz |
|---|---|
| `--typ-c-nav-indicator` | marca do servidor/canal ativo |
| `--typ-c-nav-item-hover` | fundo do item com o mouse em cima |
| `--typ-c-nav-category-color` | cor dos títulos de categoria |
| `--typ-c-nav-muted-color`, `--typ-c-nav-muted-opacity` | canais silenciados |
| `--typ-c-nav-unread`, `--typ-c-nav-unread-weight` | canais com mensagens novas |
| `--typ-c-nav-badge-bg`, `--typ-c-nav-badge-fg` | bolinha de contagem |
| `--typ-c-nav-server-radius`, `--typ-c-nav-server-radius-hover` | cantos dos ícones de servidor |
| `--typ-c-nav-header-bg`, `--typ-c-nav-header-fg` | cabeçalho do servidor (celular) |

### Mensagens
| Variável | O que faz |
|---|---|
| `--typ-c-message-hover-bg` | fundo da mensagem com o mouse em cima |
| `--typ-c-message-radius` | cantos da mensagem |
| `--typ-c-message-mention-bg`, `--typ-c-message-mention-bar` | mensagem que menciona você |
| `--typ-c-message-new-bg`, `--typ-c-message-new-fg`, `--typ-c-message-new-line` | marcador de "novas mensagens" |
| `--typ-c-message-reply-line` | linha que liga a resposta à mensagem original |
| `--typ-c-message-reaction-bg`, `-border`, `-radius`, `-active-bg`, `-active-fg`, `-active-border` | reações |
| `--typ-c-message-toolbar-bg`, `-fg`, `-radius`, `-shadow`, `-padding` | barra de ações ao passar o mouse |

### Campo de digitar
| Variável | O que faz |
|---|---|
| `--typ-c-composer-bg`, `--typ-c-composer-border`, `--typ-c-composer-focus` | caixa de texto |
| `--typ-c-composer-actions-radius`, `--typ-c-composer-actions-shadow` | botões ao lado |
| `--typ-c-composer-tray-bg`, `--typ-c-composer-tray-fg` | bandeja de anexos |
| `--typ-c-composer-reply-bg`, `-fg`, `-bar` | "respondendo a…" |
| `--typ-c-composer-info-bg`, `--typ-c-composer-drop-bg` | avisos e área de soltar arquivos |

### Menus, janelas e dicas
| Variável | O que faz |
|---|---|
| `--typ-c-menu-bg`, `-radius`, `-shadow`, `-item-radius`, `-item-hover`, `-item-inset` | menus de contexto |
| `--typ-c-dialog-radius`, `-shadow`, `-scrim`, `-scrim-blur` | janelas e o véu atrás delas |
| `--typ-c-tooltip-bg`, `-fg`, `-radius`, `-shadow` | dicas ao passar o mouse |
| `--typ-c-picker-bg`, `-radius`, `-shadow`, `-search-radius` | seletor de emojis |

### Cartões, código e citações
| Variável | O que faz |
|---|---|
| `--typ-c-card-radius`, `--typ-c-card-border` | cartões em geral |
| `--typ-c-card-embed-bg`, `-fg`, `-bar` | prévias de links |
| `--typ-c-card-attachment-bg`, `-fg` | anexos |
| `--typ-c-card-invite-bg`, `-fg` | convites |
| `--typ-c-code-bg`, `-fg`, `-border`, `--typ-c-code-inline-bg`, `-inline-fg` | blocos e trechos de código |
| `--typ-c-quote-bg`, `-fg`, `-bar`, `--typ-c-quote-nested-bg`, `-fg`, `-bar` | citações |

### Configurações
| Variável | O que faz |
|---|---|
| `--typ-c-settings-content-bg`, `--typ-c-settings-content-radius` | área de conteúdo |
| `--typ-c-settings-selected-bg`, `--typ-c-settings-selected-fg`, `--typ-c-settings-item-radius` | item selecionado no menu |

### Chamadas
| Variável | O que faz |
|---|---|
| `--typ-c-call-bg`, `-radius`, `-shadow` | card da chamada |
| `--typ-c-call-tile-bg`, `-tile-radius` | quadro de cada pessoa |
| `--typ-c-call-speaking` | contorno de quem está falando |
| `--typ-c-call-actions-bg`, `-actions-shadow` | barra de controles |

### Outros
| Variável | O que faz |
|---|---|
| `--typ-c-mobile-nav-bg`, `-border`, `-active` | barra de navegação do celular |
| `--typ-c-state-skeleton` | blocos de carregamento |
| `--typ-c-state-loading-mascot`, `--typ-c-state-mascot-size`, `--typ-c-state-mascot-opacity` | mascote das telas vazias e de carregamento |
