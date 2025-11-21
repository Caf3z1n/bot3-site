import { RefreshCw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({ onRefresh, isRefreshing }: DashboardHeaderProps) {
  const date = new Date();
  const hour = date.getHours();
  
  let greeting = "Bom dia";
  if (hour >= 12 && hour < 18) greeting = "Boa tarde";
  if (hour >= 18) greeting = "Boa noite";

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {greeting}, Trader
        </h1>
        <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="capitalize">
            {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={cn(
          "group flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-750",
          isRefreshing && "cursor-not-allowed"
        )}
      >
        <RefreshCw
          className={cn(
            "mr-2 h-4 w-4 transition-all",
            isRefreshing ? "animate-spin" : "group-hover:rotate-180"
          )}
        />
        {isRefreshing ? "Atualizando..." : "Atualizar Dados"}
      </button>
    </div>
  );
}
