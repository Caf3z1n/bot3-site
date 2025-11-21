# Instrucoes das paginas Dashboard e History

## Rotas de dados
- Dashboard (`/`): faz `GET https://api.bot3.eticasistemas.com.br/assets` uma vez no carregamento. Usa `AbortController` e trata estados de loading, erro e vazio.
- History (`/history`): faz `GET https://api.bot3.eticasistemas.com.br/positions` esperando `data.positions` como lista. Dados normalizados para lidar com `null`, strings ou numeros.

## Dashboard
- Estrutura geral: cards por asset exibidos em grid. Em erro mostra alerta, em vazio mostra estado sem dados, em loading renderiza skeletons.
- Badges de status (`statusTone`/`statusMap`):
  - `awaiting_cross`: label "Aguardando cruzamento", badge amber.
  - `awaiting_pullback`: label "Aguardando pullback", badge sky.
  - `in_position`: label "Em posicao", badge emerald.
  - `monitoring`: label "Monitorando", badge cyan.
  - `closed`: label "Encerrado", badge neutro slate.
- Badge de side (`sideTone`): `LONG` verde, `SHORT` vermelho, sem side neutro.
- Tone de tendencia EMA (`trendTone`): termos de alta/continuacao/cruzando long = verde; termos de baixa/continuacao/cruzando short = vermelho; termos com "cruz" = amber; padrao neutro.
- Tone de diferencas numericas (`diffTone`): valor > 0 verde, < 0 vermelho, 0 ou invalido neutro.
- Card por asset (com link para Binance na sigla):
  - Cabecalho: horario de cruzamento (`candleCrossTimeBr` ou "Sem agendamento"), simbolo com link externo, preco atual formatado (2 casas; se <1 usa 4 casas).
  - Bloco 1 (condicional):
    - `awaiting_pullback`: mostra Trigger Price em badge com o mesmo tom do status.
    - `in_position`: mostra badges de TP (verde) e SL (vermelho).
    - Outro status: mostra badge de status usando tabela acima.
  - Bloco 2:
    - Se aguardando pullback ou em posicao: badge de side (cores via `sideTone`).
    - Senao: badge com texto de tendencia EMA (`emaTrendStatus`) e tom vindo de `trendTone`.
  - Bloco 3:
    - `awaiting_pullback`: Trigger Diff (%) = (trigger - preco atual) / preco atual; badge com tom de awaiting_pullback.
    - `in_position`: Unrealized PnL em USD; badge verde se >=0, vermelho se <0.
    - Outro status: Diferenca EMA %; badge verde se >0, vermelho se <0, neutro se 0/indefinido.
  - Rodape: mostra `takeProfitPct / stopLossPct` (%), `emaFastPeriod/emaSlowPeriod`, e `pullbackPenetrationPct` (%). Valores ausentes viram "-".
- Formatos: moeda em USD com simbolo `$`, percentuais com 2 casas, preco com 2 casas (ou 4 casas para valor absoluto <1), valores faltantes exibem "-".

## History
- Normalizacao de trades: `side` vira `LONG`/`SHORT`/`-`; `result` vira `PROFIT`/`LOSS`/`MANUAL`/`-`; `closed` deriva de `status === "closed"`; campos de preco/percentual/notional aceitam numero ou string, caem para "-" quando vazios. Datas usam campos `candleCrossTimeBr`, `createdAtBr`, `exitTimeBr`.
- Filtros ativos:
  - Status: Todos | Profit | Loss (age sobre `result`).
  - Estado: Todos | Abertos (`!closed`) | Fechados (`closed`).
  - Busca livre (case-insensitive) sobre side, horarios, symbol, valores numéricos/percentuais, TP/SL, fees, notional, riskReward, resultado e status aberto/fechado.
- Cards de overview: contadores para trades filtrados, abertos, ganhos e perdas. Tons: emerald para numeros positivos, cyan para abertos, rose para perdas, slate neutro.
- Metric cards (baseados apenas nos trades filtrados):
  - PnL filtrado (moeda, verde se >0, vermelho se <0, neutro se 0).
  - Taxa de acerto (win rate = ganhos/total).
  - Trades abertos (neutro).
  - PnL medio por trade (verde/vermelho conforme sinal).
  - Maior ganho e Maior perda (cinza se ausente; verde/vermelho conforme sinal).
- Tabela:
  - Colunas: Side, Saida (data+hora), Par (symbol), Entry, Exit, Slippage, PnL.
  - Badges: side (LONG verde, SHORT vermelho, vazio neutro); PnL badge verde se valor >=0, vermelha se <0. Slippage e precos formatados (<=10 usa 4 casas decimais, senao 2).
  - Linhas zebradas; linha "Totais" soma PnL dos registros filtrados com a mesma regra de cor.
  - Estado vazio mostra call-to-action para ajustar filtros/busca.
  - Interacao: clique ou Enter/Espaco em uma linha abre modal de detalhes.
- Modal de detalhes:
  - Abertura: clicar em linha ou teclar Enter/Espaco; fechamento por overlay, botao "Fechar" ou tecla Esc (tambem bloqueia scroll do body enquanto aberto).
  - Header: simbolo, badge de side, badge de resultado (`PROFIT` verde, `LOSS` vermelha, `MANUAL` amber, neutro caso "-").
  - Blocos de tempo: cross time, entrada, saida (data+hora separadas por `formatExitParts`).
  - Precos: card de Entry; card de Exit com cor pelo resultado e linha auxiliar mostrando `tpPrice / slPrice`.
  - Cards adicionais: Notional (USD), Fees (USD), Risk/Reward (numero puro).
  - Rodape: PnL total da posicao com badge verde/vermelha conforme sinal; badge de Slippage (>=0 verde, <0 vermelha, ausente neutro cinza).
