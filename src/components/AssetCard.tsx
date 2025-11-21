import { Asset } from "@/lib/api";
import {
  formatCurrency,
  formatPercent,
  getDiffTone,
  getSideTone,
  getStatusLabel,
  getStatusTone,
  getTrendTone,
  formatDate,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { ExternalLink, TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const {
    symbol,
    status,
    side,
    currentPrice,
    triggerPrice,
    triggerDiffPercent,
    tpPrice,
    slPrice,
    unrealizedPnl,
    emaTrendStatus,
    takeProfitPct,
    stopLossPct,
    emaFastPeriod,
    emaSlowPeriod,
    pullbackPenetrationPct,
    emaDiffPercent,
    createdAt,
    updatedAt,
  } = asset;

  const renderBlock1 = () => {
    // awaiting_pullback removed to fall through to default status display
    if (status === "in_position") {
      return (
        <div className="flex space-x-3">
          <div className="flex flex-col items-center">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">TP</span>
            <Badge tone="emerald">
              {formatCurrency(tpPrice)}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">SL</span>
            <Badge tone="rose">
              {formatCurrency(slPrice)}
            </Badge>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
        <Badge tone={getStatusTone(status)} className={status === "in_position" || status === "monitoring" ? "animate-pulse" : ""}>
          {getStatusLabel(status)}
        </Badge>
      </div>
    );
  };

  const renderBlock2 = () => {
    if (status === "awaiting_pullback" || status === "in_position") {
      return (
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Side</span>
          <Badge tone={getSideTone(side)}>
            {side?.toUpperCase()}
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tendência</span>
        <Badge tone={getTrendTone(emaTrendStatus || "")}>
          {emaTrendStatus || "Neutro"}
        </Badge>
      </div>
    );
  };

  const renderBlock3 = () => {
    if (status === "awaiting_pullback") {
      return (
        <div className="flex flex-col items-center">
          <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Trigger / Diferença do preço atual</span>
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1.5 dark:bg-slate-800/50">
            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {formatCurrency(triggerPrice)}
            </span>
            <Badge tone="sky" className="h-6 px-2 text-md">
              {formatPercent(triggerDiffPercent / 100)}
            </Badge>
          </div>
        </div>
      );
    }
    if (status === "in_position") {
      return (
        <div className="flex flex-col items-center">
          <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">PnL</span>
          <div className="flex items-center gap-2 rounded-md px-3 py-1.5">
            <span className={`text-lg font-bold ${unrealizedPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {formatCurrency(unrealizedPnl)}
            </span>
          </div>
        </div>
      );
    }
    if (status === "awaiting_cross") {
      return (
        <div className="flex flex-col items-center">
          <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Diferença das emas</span>
          <div className="flex items-center gap-2 rounded-md px-3 py-1.5">
            <Badge tone={getDiffTone(emaDiffPercent)} className="h-6 px-2 text-md">
              {formatPercent(emaDiffPercent / 100)}
            </Badge>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Diff %</span>
        <div className="flex items-center gap-2 rounded-md px-3 py-1.5">
          <Badge tone={getDiffTone(triggerDiffPercent)} className="h-6 px-2 text-md">
            {formatPercent(triggerDiffPercent / 100)}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="group relative overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900/50">
      <div className="absolute top-0 h-1 w-full bg-linear-to-r from-slate-200 to-slate-300 transition-all duration-300 group-hover:from-blue-400 group-hover:to-blue-600 dark:from-slate-800 dark:to-slate-700 dark:group-hover:from-blue-600 dark:group-hover:to-blue-400" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{formatDate(updatedAt, "dd/MM HH:mm")}</span>
          </div>
          <a
            href={`https://www.binance.com/en/trade/${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
          >
            <span>{symbol}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="mt-4 text-center">
          <span className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-200">
            {formatCurrency(currentPrice)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col divide-y divide-slate-100 p-0 dark:divide-slate-800">
        <div className="flex justify-center py-4">{renderBlock1()}</div>
        <div className="flex justify-center py-4">
          {renderBlock2()}
        </div>
        <div className="flex justify-center py-4">{renderBlock3()}</div>
      </CardContent>
      
      <CardFooter className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/50 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        <div className="flex flex-col items-center">
          <span className="mb-0.5 font-semibold text-slate-400 dark:text-slate-500">TP/SL</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {formatPercent(parseFloat(takeProfitPct) / 100)} / {formatPercent(parseFloat(stopLossPct) / 100)}
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-200 px-2 dark:border-slate-800">
          <span className="mb-0.5 font-semibold text-slate-400 dark:text-slate-500">EMA</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {emaFastPeriod}/{emaSlowPeriod}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-0.5 font-semibold text-slate-400 dark:text-slate-500">Pullback</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{formatPercent(parseFloat(pullbackPenetrationPct) / 100)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
