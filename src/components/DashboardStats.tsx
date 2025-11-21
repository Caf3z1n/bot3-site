import { Asset } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Activity, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStatsProps {
  assets: Asset[];
}

function CountUp({ value, isCurrency = false }: { value: number; isCurrency?: boolean }) {
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

  return (
    <span>
      {isCurrency 
        ? formatCurrency(count) 
        : Math.floor(count)}
    </span>
  );
}



export function DashboardStats({ assets }: DashboardStatsProps) {
  // Card 1: Monitoramento
  const totalAssets = assets.length;
  const activePositions = assets.filter((a) => a.status === "in_position").length;
  const waiting = assets.filter((a) => a.status.startsWith("awaiting")).length;

  // Card 2: Sentimento
  const bullishAssets = assets.filter((a) => a.emaDiffPercent > 0).length;
  const bearishAssets = assets.filter((a) => a.emaDiffPercent < 0).length;
  
  let sentiment = "Neutro";
  let sentimentTone = "slate";
  let SentimentIcon = BarChart3;
  let cardBg = "bg-white dark:bg-slate-900";
  let cardBorder = "border-slate-200 dark:border-slate-800";
  
  if (bullishAssets > bearishAssets) {
    sentiment = "Bullish";
    sentimentTone = "emerald";
    SentimentIcon = TrendingUp; // Using standard icon for the small circle
    cardBg = "bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-900/20";
    cardBorder = "border-emerald-200 dark:border-emerald-900/50";
  } else if (bearishAssets > bullishAssets) {
    sentiment = "Bearish";
    sentimentTone = "rose";
    SentimentIcon = TrendingUp; // Using standard icon for the small circle
    cardBg = "bg-gradient-to-br from-white to-rose-50 dark:from-slate-900 dark:to-rose-900/20";
    cardBorder = "border-rose-200 dark:border-rose-900/50";
  }

  // Card 3: Exposição
  const totalExposure = assets
    .filter((a) => a.status === "in_position")
    .reduce((acc, curr) => acc + (curr.positionNotional || 0), 0);

  // Card 4: PnL
  const activeAssets = assets.filter((a) => a.status === "in_position");
  const totalUnrealizedPnl = activeAssets.reduce((acc, curr) => acc + (curr.unrealizedPnl || 0), 0);
  
  const bestAsset = activeAssets.reduce((prev, current) => 
    (prev.unrealizedPnl || 0) > (current.unrealizedPnl || 0) ? prev : current
  , {} as Asset);
  
  const worstAsset = activeAssets.reduce((prev, current) => 
    (prev.unrealizedPnl || 0) < (current.unrealizedPnl || 0) ? prev : current
  , {} as Asset);

  const bestPnl = bestAsset.unrealizedPnl || 0;
  const worstPnl = worstAsset.unrealizedPnl || 0;

  const stats = [
    {
      label: "Monitoramento",
      value: totalAssets,
      subInfo: `${activePositions} Em Posição • ${waiting} Aguardando`,
      icon: Activity,
      tone: "blue",
    },
    {
      label: "Sentimento",
      value: sentiment,
      subInfo: `${bullishAssets} Bullish • ${bearishAssets} Bearish`,
      icon: SentimentIcon,
      tone: sentimentTone,
      isValueText: true,
      isSentiment: true,
      customBg: cardBg,
      customBorder: cardBorder,
    },
    {
      label: "Exposição Total",
      value: totalExposure,
      subInfo: "Capital em Risco",
      icon: TrendingUp,
      tone: "amber",
      isCurrency: true,
    },
    {
      label: "PnL Não Realizado",
      value: totalUnrealizedPnl,
      subInfo: activePositions > 0 ? `Melhor: ${formatCurrency(bestPnl)} • Pior: ${formatCurrency(worstPnl)}` : "Sem posições ativas",
      icon: Wallet,
      tone: totalUnrealizedPnl >= 0 ? "emerald" : "rose",
      isCurrency: true,
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const isSentiment = stat.isSentiment;
        const bgClass = stat.customBg || "bg-white dark:bg-slate-900";
        const borderClass = stat.customBorder || "border-slate-200 dark:border-slate-800";

        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards ${bgClass} ${borderClass}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Background Silhouette for Sentiment */}
            {isSentiment && sentiment === "Bullish" && (
               <TrendingUp className="absolute bottom-2 right-2 h-24 w-24 text-emerald-500/10 dark:text-emerald-400/10" />
            )}
            {isSentiment && sentiment === "Bearish" && (
               <TrendingUp className="absolute bottom-2 right-2 h-24 w-24 text-rose-500/10 dark:text-rose-400/10 rotate-180" />
            )}

            <div className={`absolute right-4 top-4 rounded-full p-2.5 opacity-10 transition-transform duration-300 group-hover:scale-110 bg-${stat.tone}-500`}>
              <Icon className={`h-5 w-5 text-${stat.tone}-500`} />
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className={`mt-2 text-2xl font-bold tracking-tight ${stat.isValueText ? `text-${stat.tone}-600 dark:text-${stat.tone}-400` : (stat.isCurrency ? (stat.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400") : "text-slate-900 dark:text-slate-50")}`}>
                  {stat.isValueText ? (
                    stat.value
                  ) : (
                    <>
                      <CountUp value={Math.abs(Number(stat.value))} isCurrency={stat.isCurrency} />
                      {stat.isCurrency && Number(stat.value) < 0 && <span className="absolute ml-1 text-sm text-rose-600 dark:text-rose-400"></span>}
                    </>
                  )}
                </p>
              </div>
              <div className={`mt-4 pt-4 ${isSentiment ? "" : "border-t border-slate-100 dark:border-slate-800"}`}>
                <p className={`text-xs font-medium ${isSentiment ? (sentiment === "Bullish" ? "text-emerald-600/80 dark:text-emerald-400/80" : (sentiment === "Bearish" ? "text-rose-600/80 dark:text-rose-400/80" : "text-slate-400 dark:text-slate-500")) : "text-slate-400 dark:text-slate-500"}`}>
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
