import { cn, StatusTone } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  const toneStyles = {
    amber: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    sky: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
    slate: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    rose: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    neutral: "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
