import { Position } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getDiffTone,
  getSideTone,
  getStatusTone,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { X } from "lucide-react";
import { useEffect } from "react";

interface PositionDetailsModalProps {
  position: Position;
  isOpen: boolean;
  onClose: () => void;
}

export function PositionDetailsModal({
  position,
  isOpen,
  onClose,
}: PositionDetailsModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    symbol,
    side,
    result,
    candleCrossTime,
    createdAt,
    exitTime,
    price: entryPrice,
    exitPrice,
    tpPrice,
    slPrice,
    notional,
    fees,
    riskReward,
    pnl,
    slippage,
  } = position;

  const pnlValue = parseFloat(pnl || "0");
  const derivedResult = pnlValue > 0 ? "PROFIT" : pnlValue < 0 ? "LOSS" : "BREAKEVEN";

  const getResultTone = (res: string) => {
    if (res === "PROFIT") return "emerald";
    if (res === "LOSS") return "rose";
    return "slate";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-sm dark:bg-slate-950/50">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{symbol}</h2>
            <Badge tone={getSideTone(side)}>{side.toUpperCase()}</Badge>
            <Badge tone={getResultTone(derivedResult)}>{derivedResult}</Badge>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-8">
          {/* Time Blocks */}
          <div className="mb-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cross Time</span>
              <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                {candleCrossTime ? (
                  <div className="flex flex-col">
                    <span>{formatDate(candleCrossTime, "dd/MM/yyyy")}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(candleCrossTime, "HH:mm")}</span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Entry Time</span>
              <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                <div className="flex flex-col">
                  <span>{formatDate(createdAt, "dd/MM/yyyy")}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(createdAt, "HH:mm")}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Exit Time</span>
              <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                {exitTime ? (
                  <div className="flex flex-col">
                    <span>{formatDate(exitTime, "dd/MM/yyyy")}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(exitTime, "HH:mm")}</span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="mb-8 grid grid-cols-2 gap-6">
            <Card className="bg-slate-50 border-slate-100 shadow-none dark:bg-slate-800/50 dark:border-slate-700">
              <CardContent className="p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Entry Price</span>
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{formatCurrency(entryPrice)}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border-slate-100 shadow-none dark:bg-slate-800/50 dark:border-slate-700">
              <CardContent className="p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Exit Price</span>
                <div
                  className={`mt-2 text-2xl font-bold ${
                    derivedResult === "PROFIT"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : derivedResult === "LOSS"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-900 dark:text-slate-50"
                  }`}
                >
                  {formatCurrency(exitPrice)}
                </div>
                <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  TP: {formatCurrency(tpPrice)} / SL: {formatCurrency(slPrice)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Extra Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Notional</span>
                <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(notional)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Fees</span>
                <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(fees)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Risk/Reward</span>
                <div className="mt-1 font-semibold text-slate-700 dark:text-slate-300">{formatNumber(riskReward)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Slippage:</span>
            <Badge tone={getDiffTone(parseFloat(slippage || "0"))}>
              ${formatNumber(slippage, 2)}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total PnL:</span>
            <Badge tone={getDiffTone(parseFloat(pnl || "0"))} className="text-lg px-4 py-1.5">
              {formatCurrency(pnl)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
