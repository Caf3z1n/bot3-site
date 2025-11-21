"use client";

import { getPositions } from "@/lib/api";
import { HistoryFilters } from "@/components/HistoryFilters";
import { HistoryTable } from "@/components/HistoryTable";
import { PerformanceChart } from "@/components/PerformanceChart";
import { HistoryStats } from "@/components/HistoryStats";
import { useEffect, useState } from "react";
import { Position } from "@/lib/api";
import { AlertCircle, Loader2, BarChart3, LayoutDashboard } from "lucide-react";

export default function HistoryPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // View Mode
  const [viewMode, setViewMode] = useState<"chart" | "stats">("chart");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const data = await getPositions(controller.signal);
        // Sort by exit time descending (most recent first)
        const sortedData = data.sort((a, b) => {
          const dateA = a.exitTime ? new Date(a.exitTime).getTime() : 0;
          const dateB = b.exitTime ? new Date(b.exitTime).getTime() : 0;
          return dateB - dateA;
        });
        setPositions(sortedData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Falha ao carregar histórico de posições");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-rose-500">
        <AlertCircle className="mb-2 h-8 w-8" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Histórico de Trades</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Visualize e analise o desempenho passado do bot.
        </p>
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
