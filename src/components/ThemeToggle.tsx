"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ isCollapsed }: { isCollapsed?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("rounded-full bg-slate-200 dark:bg-slate-800", isCollapsed ? "h-10 w-10" : "h-10 w-20")} />;
  }

  const isDark = theme === "dark";

  if (isCollapsed) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
        aria-label="Toggle Theme"
      >
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-10 w-20 items-center rounded-full bg-slate-200 p-1 transition-all active:scale-95 dark:bg-slate-950"
      aria-label="Toggle Theme"
    >
      {/* Icons Background Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5">
        <Sun className={`h-5 w-5 ${isDark ? "text-slate-500" : "text-white"} z-10 transition-colors duration-300`} />
        <Moon className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-400"} z-10 transition-colors duration-300`} />
      </div>

      {/* Sliding Knob */}
      <div
        className={`absolute h-8 w-8 rounded-full bg-blue-600 shadow-md transition-transform duration-500 ${
          isDark ? "translate-x-10" : "translate-x-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
      />
    </button>
  );
}
