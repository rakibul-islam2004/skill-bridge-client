"use client";

import AdminSidebar from "@/components/admin/admin-sidebar";
import { RoleGuard } from "@/components/providers/role-guard";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, PanelRight } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen bg-muted/30">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar trigger */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
            <h1 className="text-lg font-semibold">Admin Console</h1>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <PanelRight className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Content */}
          <main className="flex-1 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block w-80">
          <AdminSidebar className="fixed right-0 top-16 h-[calc(100vh-4rem)]" />
        </aside>
      </div>
    </RoleGuard>
  );
}
