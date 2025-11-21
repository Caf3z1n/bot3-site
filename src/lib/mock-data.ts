import { Position } from "@/lib/api";

export function generateMockPositions(count: number): Position[] {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "DOGEUSDT", "XRPUSDT"];
  const sides = ["long", "short"];

  return Array.from({ length: count }).map((_, i) => {
    // First 2 are open, rest are closed
    const isClosed = i >= 2;
    const status = isClosed ? "closed" : "open";
    const result = isClosed ? (Math.random() > 0.4 ? "PROFIT" : "LOSS") : null;
    const pnl = isClosed ? (Math.random() * 200 - 80).toFixed(2) : null; // Random PnL between -80 and 120
    
    const date = new Date();
    // Spread dates out more for closed trades
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    // Randomize time
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60)); 
    
    // For open trades, make them recent
    if (!isClosed) {
        date.setTime(new Date().getTime() - Math.floor(Math.random() * 86400000)); // Last 24h
    }

    return {
      id: i + 1,
      orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      status,
      price: (Math.random() * 50000 + 1000).toFixed(2),
      qty: (Math.random() * 2).toFixed(3),
      notional: (Math.random() * 1000).toFixed(2),
      fees: (Math.random() * 5).toFixed(2),
      candleCrossTime: date.toISOString(),
      candleCrossTimeBr: date.toLocaleString("pt-BR"),
      createdAt: date.toISOString(),
      updatedAt: new Date().toISOString(),
      exitTime: isClosed ? new Date(date.getTime() + 3600000).toISOString() : null,
      exitTimeBr: isClosed ? new Date(date.getTime() + 3600000).toLocaleString("pt-BR") : undefined,
      pnl,
      riskReward: (Math.random() * 3).toFixed(2),
      slippage: (Math.random() * 4 - 2).toFixed(2),
      result,
      exitPrice: isClosed ? (Math.random() * 50000 + 1000).toFixed(2) : null,
      tpPrice: (Math.random() * 50000 + 1000).toFixed(2),
      slPrice: (Math.random() * 50000 + 1000).toFixed(2),
    };
  });
}
