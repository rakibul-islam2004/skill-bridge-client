import AdminSidebar from "@/components/admin/admin-sidebar";
import { RoleGuard } from "@/components/providers/role-guard";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-20 left-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <AdminSidebar className="fixed left-0 top-16 z-30" />
        </aside>
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>
    </RoleGuard>
  );
}
