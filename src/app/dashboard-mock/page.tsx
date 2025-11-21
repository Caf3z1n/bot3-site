"use client";

import { useState } from "react";
import { Asset } from "@/lib/api";
import { AssetCard } from "@/components/AssetCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";

export default function DashboardMock() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const mockAssets: Asset[] = [
    {
      id: 1,
      symbol: "BTCUSDT",
      status: "awaiting_cross",
      side: "LONG",
      currentPrice: 98500.0,
      triggerPrice: "0",
      triggerDiffPercent: 0,
      emaDiffPercent: 0.15,
      tpPrice: 0,
      slPrice: 0,
      unrealizedPnl: 0,
      emaTrendStatus: "Tendência de Alta",
      takeProfitPct: "1.5",
      stopLossPct: "1.0",
      emaFastPeriod: 9,
      emaSlowPeriod: 21,
      pullbackPenetrationPct: "0.5",
      positionNotional: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      symbol: "ETHUSDT",
      status: "awaiting_pullback",
      side: "SHORT",
      currentPrice: 3200.0,
      triggerPrice: "3250.0",
      triggerDiffPercent: 1.56,
      emaDiffPercent: -0.5,
      tpPrice: 0,
      slPrice: 0,
      unrealizedPnl: 0,
      emaTrendStatus: "Tendência de Baixa",
      takeProfitPct: "2.0",
      stopLossPct: "1.0",
      emaFastPeriod: 9,
      emaSlowPeriod: 21,
      pullbackPenetrationPct: "0.5",
      positionNotional: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      symbol: "SOLUSDT",
      status: "in_position",
      side: "LONG",
      currentPrice: 145.0,
      triggerPrice: "140.0",
      triggerDiffPercent: 0,
      emaDiffPercent: 0.8,
      tpPrice: 150.0,
      slPrice: 138.0,
      unrealizedPnl: 125.50,
      emaTrendStatus: "Tendência de Alta",
      takeProfitPct: "3.0",
      stopLossPct: "1.5",
      emaFastPeriod: 9,
      emaSlowPeriod: 21,
      pullbackPenetrationPct: "0.5",
      positionNotional: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      symbol: "XRPUSDT",
      status: "awaiting_cross",
      side: "LONG",
      currentPrice: 0.62,
      triggerPrice: "0",
      triggerDiffPercent: 0,
      emaDiffPercent: 0.05,
      tpPrice: 0,
      slPrice: 0,
      unrealizedPnl: 0,
      emaTrendStatus: "Cruzando long",
      takeProfitPct: "1.5",
      stopLossPct: "1.0",
      emaFastPeriod: 9,
      emaSlowPeriod: 21,
      pullbackPenetrationPct: "0.5",
      positionNotional: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      symbol: "DOGEUSDT",
      status: "awaiting_cross",
      side: "SHORT",
      currentPrice: 0.16,
      triggerPrice: "0",
      triggerDiffPercent: 0,
      emaDiffPercent: -0.08,
      tpPrice: 0,
      slPrice: 0,
      unrealizedPnl: 0,
      emaTrendStatus: "Cruzando short",
      takeProfitPct: "1.5",
      stopLossPct: "1.0",
      emaFastPeriod: 9,
      emaSlowPeriod: 21,
      pullbackPenetrationPct: "0.5",
      positionNotional: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 transition-colors dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        <DashboardHeader onRefresh={handleRefresh} isRefreshing={refreshing} />
        <DashboardStats assets={mockAssets} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockAssets.map((asset, index) => (
            <div
              key={asset.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
