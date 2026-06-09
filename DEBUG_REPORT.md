# Chromium Translator v1.1.1 — relatório de debugging aprofundado

## Escopo

A revisão cobriu Manifest V3, carregamento sob demanda, service worker, content script, priorização por viewport, cache, fragmentação Unicode, brokers de rede, fallback DeepSeek, popup e comportamento em DOM real executado por Chromium headless.

## Falhas encontradas e corrigidas

### Críticas

1. **Fragmentação destrutiva de texto longo**  
   Os chunks eram recortados com `trim()` e unidos sem preservar separadores, podendo colar palavras e deslocar pontuação. O splitter foi substituído por uma versão lossless.

2. **Sessão encerrada cedo demais**  
   O observador era removido ao concluir a fila inicial. Conteúdo dinâmico posterior não seria traduzido. A sessão agora permanece ativa durante a navegação na página.

3. **Corrida entre coleta e resposta de lote**  
   O estado dependia implicitamente do lote mais recente. Scroll ou mutação durante uma resposta lenta poderia aplicar resultados aos nós errados. Cada lote passou a ser autocontido.

4. **Resposta atrasada após restauração**  
   Uma chamada pendente podia reaplicar tradução depois de o usuário restaurar a página ou iniciar outra sessão. Toda aplicação no DOM agora valida a sessão ativa.

5. **Limitador global com reserva concorrente incorreta**  
   Requisições paralelas podiam escolher o mesmo instante de partida. A reserva do gap passou a ser serializada.

### Relevantes

6. **Marcadores permanentes em SPAs**  
   Um text node ignorado ou marcado como falho continuava bloqueado se a aplicação reutilizasse o mesmo nó com outro conteúdo. Marcadores agora são vinculados ao texto atual.

7. **Conteúdo invisível sob ancestrais ocultos**  
   A visibilidade era inferida de forma insuficiente. A cadeia ancestral agora é verificada para reduzir chamadas desperdiçadas.

8. **Viewport escondida por DOM muito extenso**  
   O limite de varredura podia impedir que um nó visível aparecendo muito tarde no DOM ultrapassasse o backlog. Nós próximos à viewport continuam elegíveis após o orçamento principal.

9. **Cooldown DeepSeek incompleto**  
   Throttling HTTP DeepSeek era avaliado fora do broker. O status agora alimenta o cooldown compartilhado.

10. **Overhead do popup em modo Google**  
    A abertura do popup podia consultar a lista de modelos DeepSeek sem necessidade. O carregamento passou a ser lazy e limitado por timeout.

11. **Cache antigo e Unicode malformado**  
    O cache passou para `ct:v3`, remove entradas `ct:v2`, evita crescimento indefinido e tolera surrogates isolados em texto DOM.

## Validações executadas

### Estáticas

- `node --check` em `background/service-worker.js`.
- `node --check` em `content/content.js`.
- `node --check` em `lib/translator.js`.
- `node --check` em `popup/popup.js`.
- Parse JSON do `manifest.json`.

### Tradutor isolado

- Split lossless.
- Limite codificado de chunks Google.
- Preservação de pares surrogate e tolerância a surrogate isolado.
- União de chunks sem colar palavras.
- Remoção de cache legado.
- Cache de duplicatas.
- Parser DeepSeek multilinha.
- Espaçamento real entre partidas concorrentes.
- Cooldown compartilhado após `429`.
- Fallback Google somente para resultados DeepSeek ausentes.

### Service worker isolado

- Inicialização e limpeza de cache legado.
- Injeção sob demanda.
- Carregamento lazy de `franc`.
- Não reinjeção quando o content script permanece ativo.
- Validação de mensagens recebidas.
- Resposta assíncrona da tradução.
- Restauração enviada a todas as abas acessíveis.

### Chromium headless — DOM real

- Tradução inicial.
- Conteúdo inserido dinamicamente.
- Mutação legítima de text node.
- Restauração durante resposta atrasada.
- Prevenção de retradução inútil.
- Reutilização de nó anteriormente ignorado.
- Troca de idioma.
- Restauração de originais.
- Ancestral oculto ignorado e reconsiderado quando visível.
- Priorização de viewport após mais de 30 mil text nodes distantes.

### Popup em Chromium headless

- Ausência de consulta DeepSeek ao abrir em modo Google.
- Preservação do modelo persistido.
- Consulta única ao alternar para DeepSeek.
- Habilitação correta da seleção de modelo.

## Limitações da validação

Os testes de rede utilizaram endpoints simulados para tornar concorrência, cooldown e respostas parciais determinísticos. Não foram realizadas chamadas reais ao endpoint Google nem à conta DeepSeek do usuário. Também não foi executado teste manual interativo no perfil local do navegador do usuário.

## Hotfix v1.1.1 — corrida no menu de contexto

### Sintoma observado

```text
Unchecked runtime.lastError: Cannot create item with duplicate id translate-page
```

### Causa

A rotina anterior removia e recriava o menu. Duas inicializações sobrepostas podiam concluir a remoção antes de qualquer criação e, em seguida, tentar registrar o mesmo ID em paralelo.

### Correção

- As mutações do menu passaram a ser serializadas.
- A estratégia deixou de ser “remover e recriar” e passou a ser “atualizar se existir; criar somente se ausente”.
- Uma criação concorrente residual é absorvida por uma segunda reconciliação via `update()`.

### Validação específica

- Inicialização normal com menu ausente.
- Quatro reconciliações simultâneas com menu já existente: nenhuma recriação.
- Três reconciliações simultâneas com menu removido artificialmente: exatamente uma criação.
- Reexecução da suíte do tradutor, integração DOM real e popup.
