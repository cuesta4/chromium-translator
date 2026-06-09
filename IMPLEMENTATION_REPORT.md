# Chromium Translator v1.1.1 — melhorias implementadas

## Pipeline orientado à viewport

- A tradução em ordem fixa de DOM foi substituída por uma fila dinâmica orientada à região visível.
- Conteúdo na viewport recebe prioridade máxima; conteúdo próximo é pré-traduzido; conteúdo distante utiliza apenas capacidade ociosa.
- A fila é repriorizada durante scroll, resize e mutações do DOM.
- Cada lote mantém referências explícitas aos seus próprios nós, evitando aplicar uma resposta lenta ao lote errado.
- Páginas extensas não ficam reféns do primeiro trecho do DOM: conteúdo visível ultrapassa o backlog mesmo quando aparece após dezenas de milhares de text nodes.

## Sessão persistente e páginas dinâmicas

- A sessão permanece ativa após a primeira passagem.
- `MutationObserver` acompanha conteúdo inserido ou alterado em SPAs.
- Nós ignorados ou com falha são reavaliados quando o respectivo texto muda.
- Respostas atrasadas são invalidadas após restauração ou troca de sessão.
- A troca de idioma restaura os originais aplicáveis antes de iniciar a nova tradução.

## Integridade do DOM

- Espaços periféricos de text nodes são preservados.
- A restauração não sobrescreve alterações legítimas posteriores feitas pela página.
- Exclusões percorrem toda a cadeia ancestral, cobrindo `code`, `pre`, `kbd`, `samp`, `var`, controles de formulário, conteúdo editável e `translate="no"`.
- Ancestrais invisíveis, colapsados ou marcados com `aria-hidden="true"` impedem traduções desperdiçadas.

## Overhead de carregamento

- A injeção permanente via `content_scripts` foi removida.
- O content script é injetado sob demanda com `chrome.scripting.executeScript`.
- O detector `franc` é injetado apenas quando o filtro de idioma dominante estiver habilitado.
- O popup consulta modelos DeepSeek somente quando DeepSeek é selecionado e usa timeout explícito.

## Rede e limites

- Google e DeepSeek utilizam brokers globais no service worker.
- O broker serializa a reserva do instante de partida de cada requisição, evitando rajadas concorrentes que compartilham acidentalmente o mesmo intervalo.
- Há espaçamento mínimo, concorrência limitada, backoff exponencial com jitter, cooldown compartilhado para throttling e timeouts com `AbortController`.
- Respostas HTTP DeepSeek com throttling também participam do cooldown compartilhado.

## Cache

- O cache atual usa prefixo `ct:v3` e inclui serviço, modelo, idioma e impressão digital do texto.
- Entradas legadas `ct:v2` são removidas automaticamente.
- O cache possui metadados LRU, poda automática e proteção contra crescimento indefinido em `chrome.storage.local`.
- Duplicatas dentro do mesmo lote recebem o resultado correspondente sem chamadas redundantes.

## Fragmentação e Unicode

- O splitter passou a ser lossless: concatenar os chunks reproduz integralmente o texto original.
- Fragmentos Google respeitam limite conservador de tamanho codificado em URL.
- Pares surrogate válidos não são cortados entre chunks.
- Texto DOM com surrogate isolado é normalizado antes de `encodeURIComponent`, evitando exceções.

## DeepSeek

- O parser aceita respostas numeradas multilinha.
- Traduções ausentes acionam fallback Google apenas para os itens faltantes.
- O popup preserva o modelo escolhido mesmo enquanto o serviço Google estiver ativo.

## Hotfix v1.1.1 — menu de contexto idempotente

- Todas as mutações de `chrome.contextMenus` passaram por uma fila serializada.
- A inicialização tenta atualizar `translate-page` antes de criá-lo.
- A criação ocorre somente quando o item está ausente.
- Se outra ativação do service worker criar o item entre a tentativa de atualização e a criação, a extensão reconcilia por atualização, sem propagar o erro de ID duplicado.
- A reconciliação também ocorre na ativação normal do service worker, não apenas em `onInstalled` e `onStartup`.
