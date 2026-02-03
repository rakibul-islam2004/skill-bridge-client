import AdminSidebar from "@/components/admin/admin-sidebar";
import { RoleGuard } from "@/components/providers/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen">
        <aside className="hidden md:block">
          <AdminSidebar />
        </aside>
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
