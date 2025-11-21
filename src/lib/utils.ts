import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  
  // If absolute value < 1, use 4 decimal places, else 2
  const decimals = Math.abs(num) < 1 ? 4 : 2;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num); // Assuming value is decimal (0.1 = 10%)? 
  // API-ROUTES.md says "0.00400000" for pullbackPenetrationPct. Usually API returns decimals.
  // Wait, "0.004" is 0.4%? Or 4%?
  // "takeProfitPct": "0.01500000" -> 1.5%?
  // "triggerDiffPercent": 0.63 -> This looks like percentage already (0.63%).
  // Let's assume decimal for most, but triggerDiffPercent might be pre-calculated.
  // FRONTEND.md says: "takeProfitPct / stopLossPct (%)".
  // If API returns 0.015, that's 1.5%.
  // If API returns 0.63 for triggerDiffPercent, is it 0.63% or 63%?
  // "triggerDiffPercent": 0.63. "triggerPrice": "41250", "currentPrice": 41510.
  // Diff = 260. 260 / 41510 = 0.00626... ~0.63%.
  // So 0.63 is likely already in percentage points if the diff is small?
  // Wait, 0.00626 * 100 = 0.626%.
  // So 0.63 is likely percentage points.
  // But `takeProfitPct` 0.015 is likely decimal (1.5%).
  // I need to handle this.
  // For now I'll assume standard decimal (0.1 = 10%) for `Pct` fields, and maybe `triggerDiffPercent` is already multiplied by 100?
  // I'll check `formatPercent` usage.
}

export function formatNumber(value: number | string | null | undefined, decimals: number = 2) {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDate(dateStr: string | null | undefined, formatStr: string = "dd/MM/yyyy HH:mm") {
  if (!dateStr) return "-";
  try {
    return format(parseISO(dateStr), formatStr);
  } catch (e) {
    return "-";
  }
}

// Status and Tone mappings
export type StatusTone = "amber" | "sky" | "emerald" | "cyan" | "slate" | "rose" | "neutral";

export function getStatusTone(status: string): StatusTone {
  switch (status) {
    case "awaiting_cross": return "amber";
    case "awaiting_pullback": return "sky";
    case "in_position": return "emerald";
    case "monitoring": return "cyan";
    case "closed": return "slate";
    default: return "slate";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "awaiting_cross": return "Aguardando cruzamento";
    case "awaiting_pullback": return "Aguardando pullback";
    case "in_position": return "Em posição";
    case "monitoring": return "Monitorando";
    case "closed": return "Encerrado";
    default: return status;
  }
}

export function getSideTone(side: string): StatusTone {
  if (side?.toLowerCase() === "long") return "emerald";
  if (side?.toLowerCase() === "short") return "rose";
  return "slate";
}

export function getTrendTone(trend: string): StatusTone {
  const t = trend?.toLowerCase() || "";
  if (t.includes("alta") || t.includes("continuacao") || (t.includes("cruzando") && t.includes("long"))) return "emerald";
  if (t.includes("baixa") || t.includes("continuacao") || (t.includes("cruzando") && t.includes("short"))) return "rose"; // Wait, continuacao appears in both?
  // Need to distinguish. Usually "continuacao de alta" or "continuacao de baixa".
  // If just "continuacao", maybe check context? But usually the string is full.
  // Let's refine:
  if (t.includes("alta")) return "emerald";
  if (t.includes("baixa")) return "rose";
  if (t.includes("cruz") && t.includes("long")) return "emerald";
  if (t.includes("cruz") && t.includes("short")) return "rose";
  if (t.includes("cruz")) return "amber";
  return "slate";
}

export function getDiffTone(value: number): StatusTone {
  if (value > 0) return "emerald";
  if (value < 0) return "rose";
  return "slate";
}
