import { Position } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getDiffTone,
  getSideTone,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { PositionDetailsModal } from "./PositionDetailsModal";
import { Card } from "./ui/Card";

interface HistoryTableProps {
  positions: Position[];
}

export function HistoryTable({ positions }: HistoryTableProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Calculate totals
  const totalPnl = positions.reduce((acc, pos) => acc + (parseFloat(pos.pnl || "0") || 0), 0);

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Side</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Saída</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Par</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Entry</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Exit</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Slippage</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    Nenhum registro encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPosition(pos);
                      }
                    }}
                  >
                    <td className="px-6 py-4">
                      <Badge tone={getSideTone(pos.side)}>{pos.side.toUpperCase()}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {pos.exitTime ? (
                        <div className="flex flex-col">
                          <span>{formatDate(pos.exitTime, "dd/MM/yyyy")}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(pos.exitTime, "HH:mm")}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {pos.symbol}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatCurrency(pos.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatCurrency(pos.exitPrice)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      ${formatNumber(pos.slippage, 2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge tone={getDiffTone(parseFloat(pos.pnl || "0"))} className="text-md">
                        {formatCurrency(pos.pnl)}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {positions.length > 0 && (
              <tfoot className="border-t border-slate-200 bg-slate-50 font-medium dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-right text-slate-900 dark:text-slate-100">
                    Totais
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge tone={getDiffTone(totalPnl)} className="text-lg px-3 py-1">{formatCurrency(totalPnl)}</Badge>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {selectedPosition && (
        <PositionDetailsModal
          position={selectedPosition}
          isOpen={!!selectedPosition}
          onClose={() => setSelectedPosition(null)}
        />
      )}
    </>
  );
}
