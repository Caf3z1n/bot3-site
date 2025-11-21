"use client";

import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-screen transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isMobile 
            ? "ml-24" // On mobile, fixed margin for collapsed sidebar (w-20 + gap)
            : isCollapsed ? "ml-28" : "ml-72" // Desktop behavior
        )}
      >
        {children}
      </main>
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
