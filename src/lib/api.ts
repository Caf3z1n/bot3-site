export interface Asset {
  id: number;
  symbol: string;
  status: string;
  side: string;
  emaFastPeriod: number;
  emaSlowPeriod: number;
  pullbackPenetrationPct: string;
  takeProfitPct: string;
  stopLossPct: string;
  triggerPrice: string;
  currentPrice: number;
  triggerDiffPercent: number;
  emaDiffPercent: number;
  positionNotional: number;
  unrealizedPnl: number;
  tpPrice: number;
  slPrice: number;
  createdAt: string;
  updatedAt: string;
  // Derived/Optional fields
  emaTrendStatus?: string; // Not explicitly in JSON example but mentioned in FRONTEND.md logic ("badge com texto de tendencia EMA")
}

export interface Position {
  id: number;
  symbol: string;
  side: string;
  status: string;
  orderId: string;
  tpPrice: string;
  slPrice: string;
  price: string;
  qty: string;
  notional: string;
  fees: string;
  candleCrossTime: string;
  exitPrice: string | null;
  exitTime: string | null;
  pnl: string | null;
  riskReward: string | null;
  slippage: string | null;
  result: string | null;
  createdAt: string;
  updatedAt: string;
  // Virtual fields mentioned in API-ROUTES.md
  candleCrossTimeBr?: string;
  exitTimeBr?: string;
}

export interface AssetsResponse {
  assets: Asset[];
}

export interface PositionsResponse {
  positions: Position[];
}

const API_BASE_URL = "https://api.bot3.eticasistemas.com.br";

export async function getAssets(signal?: AbortSignal): Promise<Asset[]> {
  const res = await fetch(`${API_BASE_URL}/assets`, { signal });
  if (!res.ok) {
    throw new Error("Failed to fetch assets");
  }
  const data: AssetsResponse = await res.json();
  return data.assets;
}

export async function getPositions(signal?: AbortSignal): Promise<Position[]> {
  const res = await fetch(`${API_BASE_URL}/positions`, { signal });
  if (!res.ok) {
    throw new Error("Failed to fetch positions");
  }
  const data: PositionsResponse = await res.json();
  return data.positions;
}
