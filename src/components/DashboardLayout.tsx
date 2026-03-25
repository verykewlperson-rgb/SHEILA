import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search, ChevronDown, Globe } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center border border-border bg-secondary px-3 py-1.5 w-72">
                <Search className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search or ask anything…"
                  className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors">
                <Globe className="h-3.5 w-3.5" />
                <span>Hindi</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="h-7 w-7 border border-border bg-accent flex items-center justify-center text-xs font-medium text-foreground">
                U
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
