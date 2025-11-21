
"use client";

import { useEffect, useState } from "react";
import { HistoryFilters } from "@/components/HistoryFilters";
import { HistoryTable } from "@/components/HistoryTable";
import { PerformanceChart } from "@/components/PerformanceChart";
import { HistoryStats } from "@/components/HistoryStats";
import { Badge } from "@/components/ui/Badge";
import { generateMockPositions } from "@/lib/mock-data";
import { BarChart3, LayoutDashboard } from "lucide-react";

export default function MockHistoryPage() {
  // Generate random number of mock positions between 10 and 50
  const [positions, setPositions] = useState<import("@/lib/api").Position[]>([]);

  useEffect(() => {
    // Generate random number of mock positions between 10 and 50
    const count = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    const newPositions = generateMockPositions(count).sort((a, b) => {
      // 1. Sort by Status (Open first)
      if (a.status === "open" && b.status !== "open") return -1;
      if (a.status !== "open" && b.status === "open") return 1;

      // 2. If both are closed, sort by ExitTime descending
      if (a.status === "closed" && b.status === "closed") {
        const dateA = a.exitTime ? new Date(a.exitTime).getTime() : 0;
        const dateB = b.exitTime ? new Date(b.exitTime).getTime() : 0;
        return dateB - dateA;
      }

      // 3. If both are open (or fallback), sort by CandleCrossTime descending
      const dateA = new Date(a.candleCrossTime).getTime();
      const dateB = new Date(b.candleCrossTime).getTime();
      return dateB - dateA;
    });
    setPositions(newPositions);
  }, []);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // View Mode
  const [viewMode, setViewMode] = useState<"chart" | "stats">("chart");

  // Filter Logic
  const filteredPositions = positions.filter((pos) => {
    // Status Filter (Profit/Loss)
    if (statusFilter !== "all") {
      const pnl = parseFloat(pos.pnl || "0");
      if (statusFilter === "profit" && pnl <= 0) return false;
      if (statusFilter === "loss" && pnl >= 0) return false;
    }

    // Search Filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        pos.symbol.toLowerCase().includes(searchLower) ||
        pos.side.toLowerCase().includes(searchLower) ||
        pos.status.toLowerCase().includes(searchLower) ||
        (pos.orderId && pos.orderId.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Chart Data Preparation
  const chartData = filteredPositions
    .filter((p) => p.status === "closed" && p.exitTime)
    .sort((a, b) => new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime())
    .reduce((acc, pos) => {
      const pnl = parseFloat(pos.pnl || "0");
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].cumulativePnl : 0;
      
      acc.push({
        date: pos.exitTime!,
        symbol: pos.symbol,
        pnl: pnl,
        cumulativePnl: lastBalance + pnl,
      });
      
      return acc;
    }, [] as { date: string; symbol: string; pnl: number; cumulativePnl: number }[]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Histórico de Trades</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Visualize e analise o desempenho passado do bot.
          </p>
        </div>
        <Badge tone="sky">Test Data</Badge>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 rounded-lg bg-slate-100 p-1 w-fit dark:bg-slate-800">
        <button
          onClick={() => setViewMode("chart")}
          className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            viewMode === "chart"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Performance</span>
        </button>
        <button
          onClick={() => setViewMode("stats")}
          className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            viewMode === "stats"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Detalhes</span>
        </button>
      </div>

      {/* Dynamic View Content */}
      {viewMode === "chart" ? (
        <PerformanceChart data={chartData} />
      ) : (
        <HistoryStats positions={filteredPositions} />
      )}

      <div className="mt-8">
        <HistoryFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <HistoryTable positions={filteredPositions} />
      </div>
    </div>
  );
}
