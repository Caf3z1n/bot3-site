import { Search } from "lucide-react";

interface HistoryFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function HistoryFilters({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}: HistoryFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter (Profit/Loss) */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Resultado:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("profit")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                statusFilter === "profit"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              }`}
            >
              Profit
            </button>
            <button
              onClick={() => setStatusFilter("loss")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                statusFilter === "loss"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              }`}
            >
              Loss
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-slate-700"
        />
      </div>
    </div>
  );
}
