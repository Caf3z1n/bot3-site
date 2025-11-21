# Documentacao das rotas publicas

Este arquivo resume o comportamento atual das rotas `GET /assets` e `GET /positions` definidas em `src/routes.js`. Os exemplos assumem que a API esta respondendo em JSON.

## GET /assets

- **Controlador**: `AssetController.index`.
- **Objetivo**: retornar todos os ativos cadastrados enriquecidos com preco de marcacao (Mark Price) da Binance e, quando houver posicao aberta, informacoes financeiras derivadas dessa posicao.
- **Entrada**: nao aceita corpo nem parametros de query.
- **Filtragem/ordenacao**: a lista segue a ordenacao padrao do repositorio (`id` ascendente).

### Corpo da resposta

```json
{
  "assets": [
    {
      "id": 1,
      "symbol": "BTCUSDT",
      "status": "in_position",
      "side": "long",
      "emaFastPeriod": 21,
      "emaSlowPeriod": 55,
      "pullbackPenetrationPct": "0.00400000",
      "takeProfitPct": "0.01500000",
      "stopLossPct": "0.00500000",
      "triggerPrice": "41250.00000000",
      "currentPrice": 41510.45,
      "triggerDiffPercent": 0.63,
      "positionNotional": 125.5,
      "unrealizedPnl": -2.35,
      "tpPrice": 41800,
      "slPrice": 40800,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:10:00.000Z"
    }
  ]
}
```

- **Campos originais do ativo**: todos os atributos persistidos em `assets` (como `symbol`, `status`, `side`, `emaFast1/2`, `emaSlow1/2`, `pullbackPenetrationPct`, `takeProfitPct`, `stopLossPct`, `stepSize`, `tickSize`, etc.) sao devolvidos exatamente como armazenados.
- **Campos derivados adicionados pelo controlador**:
  - `currentPrice`: ultimo Mark Price retornado por `fetchMarkPrice`.
  - `triggerDiffPercent`: diferenca absoluta entre `currentPrice` e `triggerPrice`, em porcentagem.
  - `positionNotional`: valor nocional (`notional`) da posicao aberta ligada ao ativo, se existir.
  - `unrealizedPnl`: lucro/prejuizo nao realizado calculado com base em `currentPrice`, `price` e `qty` da posicao correspondente.
  - `tpPrice` e `slPrice`: replicados da posicao aberta para facilitar monitoramento.
- **Codigos de status possiveis**: `awaiting_cross`, `awaiting_pullback`, `in_position`, `cooldown`. Apenas ativos `in_position` podem ter `positionNotional`, `unrealizedPnl`, `tpPrice` e `slPrice` preenchidos.
- **Erros esperados**: somente excecoes internas (5xx) caso a leitura do banco ou da Binance falhe; o controlador silencia erros de preco retornando `currentPrice: null`.

## GET /positions

- **Controlador**: `PositionController.index`.
- **Objetivo**: listar todas as posicoes cadastradas (abertas e fechadas). Utiliza o escopo padrao do modelo, retornando primeiro as posicoes abertas e, em seguida, as fechadas ordenadas por `exit_time` decrescente.
- **Entrada**: nao aceita corpo nem parametros de query.

### Corpo da resposta

```json
{
  "positions": [
    {
      "id": 42,
      "symbol": "BTCUSDT",
      "side": "long",
      "status": "open",
      "orderId": "123456789",
      "tpPrice": "41800.00000000",
      "slPrice": "40800.00000000",
      "price": "41250.00000000",
      "qty": "0.00300000",
      "notional": "123.75000000",
      "fees": "0.01000000",
      "candleCrossTime": "2023-01-01T12:00:00.000Z",
      "exitPrice": null,
      "exitTime": null,
      "pnl": null,
      "riskReward": null,
      "slippage": null,
      "result": null,
      "createdAt": "2023-01-01T12:00:05.000Z",
      "updatedAt": "2023-01-01T12:05:00.000Z"
    }
  ]
}
```

- **Campos originais**: incluem simbolos, IDs de ordens (`orderId`, `tpOrderId`, `slOrderId`), valores numericos (`price`, `qty`, `notional`, `fees`, `pnl`), timestamps (`candleCrossTime`, `exitTime`, `createdAt`, `updatedAt`) e status do lado (`side`) e da posicao (`status`).
- **Campos virtuais expostos**: `candleCrossTimeBr`, `exitTimeBr`, `result` (indica `profit` ou `loss` quando `pnl` e numerico), `slippage` (diferenca entre preco de saida e preco esperado para o tipo de resultado) e `riskReward` (relacao recompensa/risco). Esses campos podem ser `null` caso nao seja possivel calcular o valor.
- **Comportamento adicional**:
  - Posicoes em aberto retornam campos relacionados ao fechamento (`exitPrice`, `exitTime`, `pnl`, `result`) como `null`.
  - Quando `pnl` esta preenchido, `result` e automaticamente derivado (`profit` para valores positivos, `loss` para negativos).
- **Erros esperados**: apenas falhas internas durante a leitura do repositorio (5xx).

> **Observacao**: nenhum dos endpoints exige autenticacao neste servico, mas recomenda-se proteger o servidor em producao (ex.: API key ou camada externa).
