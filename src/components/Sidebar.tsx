"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { href: "/dashboard-mock", label: "Mock Dashboard", icon: FileText },
    { href: "/history/mock", label: "Mock History", icon: FileText },
  ];

  return (
    <aside
      className={cn(
        "fixed left-4 top-4 z-50 h-[calc(100vh-2rem)] rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-slate-900/90 dark:border-slate-800",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white mr-3 dark:bg-slate-50 dark:text-slate-900">
              <span className="font-bold">B3</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              BOT-3
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">
              <span className="font-bold text-sm">B3</span>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </button>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-300 ease-in-out",
                isCollapsed ? "justify-center px-2" : "space-x-3 px-4",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              )}
              title={isCollapsed ? link.label : undefined}
            >
              {isActive && (
                <div
                  className={cn(
                    "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 transition-all duration-300 dark:bg-blue-400",
                    isCollapsed ? "left-0" : "left-0"
                  )}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}
              />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 w-full flex justify-center p-6">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
