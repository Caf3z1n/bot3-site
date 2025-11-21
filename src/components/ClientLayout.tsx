"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <main
        className={cn(
          "min-h-screen transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isCollapsed ? "ml-28" : "ml-72"
        )}
      >
        {children}
      </main>
    </>
  );
}
