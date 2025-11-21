"use client";

import { useEffect, useState, useCallback } from "react";
import { Asset, getAssets } from "@/lib/api";
import { AssetCard } from "@/components/AssetCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { AlertCircle, SearchX } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    const controller = new AbortController();
    try {
      const data = await getAssets(controller.signal);
      setAssets(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to load assets. Please try again later.");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <Skeleton className="mb-4 h-6 w-1/3" />
                <Skeleton className="mb-8 h-10 w-2/3" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950">
        <div className="mb-6 rounded-full bg-rose-50 p-6 dark:bg-rose-900/20">
          <AlertCircle className="h-12 w-12 text-rose-500 dark:text-rose-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">Erro ao Carregar Dados</h2>
        <p className="mb-8 text-slate-500 dark:text-slate-400">{error}</p>
        <button
          onClick={() => fetchData(true)}
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 transition-colors dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        <DashboardHeader onRefresh={handleRefresh} isRefreshing={refreshing} />
        
        {assets.length > 0 ? (
          <>
            <DashboardStats assets={assets} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {assets.map((asset, index) => (
                <div
                  key={asset.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AssetCard asset={asset} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 text-center dark:border-slate-800 dark:bg-slate-900/20">
            <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
              <SearchX className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-50">Nenhum Ativo Encontrado</h2>
            <p className="text-slate-500 dark:text-slate-400">Não há ativos sendo monitorados no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
