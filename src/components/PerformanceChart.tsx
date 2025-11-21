"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ChartData {
  date: string;
  symbol: string;
  pnl: number;
  cumulativePnl: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (data.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center text-slate-400">
        No data available for chart
      </Card>
    );
  }

  const lastValue = data[data.length - 1].cumulativePnl;
  const isPositive = lastValue >= 0;

  // Calculate gradient offset
  const dataMax = Math.max(...data.map((i) => i.cumulativePnl));
  const dataMin = Math.min(...data.map((i) => i.cumulativePnl));

  let offset = 0;
  if (dataMax <= 0) {
    offset = 0;
  } else if (dataMin >= 0) {
    offset = 1;
  } else {
    offset = dataMax / (dataMax - dataMin);
  }

  // Calculate interval to show max ~20 ticks
  const interval = Math.ceil(data.length / 20);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Performance</CardTitle>
        <div className="text-sm text-slate-500">
          Cumulative PnL:{" "}
          <span
            className={`font-bold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatCurrency(lastValue)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={offset} stopColor="#10b981" stopOpacity={1} />
                  <stop offset={offset} stopColor="#f43f5e" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                interval={interval - 1}
                tickFormatter={(value) => formatDate(value, "dd/MM")}
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                height={50}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div>{formatDate(label as string, "dd/MM/yyyy")}</div>
                        <div>{formatDate(label as string, "HH:mm")}</div>
                      </div>
                        <p className="mb-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                          {payload[0].payload.symbol}
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativePnl"
                stroke="url(#splitColor)"
                strokeWidth={2}
                fillOpacity={0.1}
                fill="url(#splitColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
