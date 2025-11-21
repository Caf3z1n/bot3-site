import { Position } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Activity, Wallet, BarChart3, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface HistoryStatsProps {
  positions: Position[];
}

function CountUp({ value, isCurrency = false, isPercent = false }: { value: number; isCurrency?: boolean; isPercent?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  if (isPercent) {
    return <span>{formatPercent(count)}</span>;
  }

  return (
    <span>
      {isCurrency 
        ? formatCurrency(count) 
        : Math.floor(count)}
    </span>
  );
}

export function HistoryStats({ positions }: HistoryStatsProps) {
  const closedPositions = positions.filter((p) => p.status === "closed");
  const totalTrades = closedPositions.length;

  const profitTrades = closedPositions.filter((p) => parseFloat(p.pnl || "0") > 0);
  const lossTrades = closedPositions.filter((p) => parseFloat(p.pnl || "0") < 0);
  
  const winCount = profitTrades.length;
  const lossCount = lossTrades.length;
  const winRate = totalTrades > 0 ? winCount / totalTrades : 0;

  const totalPnl = closedPositions.reduce((acc, p) => acc + (parseFloat(p.pnl || "0") || 0), 0);
  
  const totalWinPnl = profitTrades.reduce((acc, p) => acc + (parseFloat(p.pnl || "0") || 0), 0);
  const totalLossPnl = lossTrades.reduce((acc, p) => acc + (parseFloat(p.pnl || "0") || 0), 0);
  
  const avgWin = winCount > 0 ? totalWinPnl / winCount : 0;
  const avgLoss = lossCount > 0 ? totalLossPnl / lossCount : 0;
  
  const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;
  const payoffRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  const bestTrade = closedPositions.reduce((max, p) => {
    const pnl = parseFloat(p.pnl || "0");
    return pnl > max ? pnl : max;
  }, -Infinity);

  const worstTrade = closedPositions.reduce((min, p) => {
    const pnl = parseFloat(p.pnl || "0");
    return pnl < min ? pnl : min;
  }, Infinity);

  const bestTradeVal = bestTrade === -Infinity ? 0 : bestTrade;
  const worstTradeVal = worstTrade === Infinity ? 0 : worstTrade;

  const stats = [
    {
      label: "Total Trades",
      value: totalTrades,
      subInfo: `${winCount} Wins • ${lossCount} Losses`,
      icon: Activity,
      tone: "blue",
    },
    {
      label: "Taxa de Acerto",
      value: winRate,
      subInfo: `Avg Win: ${formatCurrency(avgWin)} • Avg Loss: ${formatCurrency(avgLoss)}`,
      icon: Target,
      tone: winRate >= 0.5 ? "emerald" : "rose",
      isPercent: true,
    },
    {
      label: "PnL Acumulado",
      value: totalPnl,
      subInfo: `Melhor: ${formatCurrency(bestTradeVal)} • Pior: ${formatCurrency(worstTradeVal)}`,
      icon: Wallet,
      tone: totalPnl >= 0 ? "emerald" : "rose",
      isCurrency: true,
    },
    {
      label: "Média por Trade",
      value: avgPnl,
      subInfo: `Payoff: ${payoffRatio.toFixed(2)}`,
      icon: BarChart3,
      tone: avgPnl >= 0 ? "emerald" : "rose",
      isCurrency: true,
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`absolute right-4 top-4 rounded-full p-2.5 opacity-10 transition-transform duration-300 group-hover:scale-110 bg-${stat.tone}-500`}>
              <Icon className={`h-5 w-5 text-${stat.tone}-500`} />
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className={`mt-2 text-2xl font-bold tracking-tight ${stat.isPercent ? (stat.value >= 0.5 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400") : (stat.isCurrency ? (stat.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400") : "text-slate-900 dark:text-slate-50")}`}>
                  <CountUp value={Math.abs(stat.value)} isCurrency={stat.isCurrency} isPercent={stat.isPercent} />
                  {stat.isCurrency && stat.value < 0 && <span className="absolute ml-1 text-sm text-rose-600 dark:text-rose-400"></span>} 
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {stat.subInfo}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
