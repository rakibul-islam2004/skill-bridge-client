export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground">
          System-wide overview and administrative controls for SkillBridge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Users", value: "0" },
          { title: "Active Tutors", value: "0" },
          { title: "Pending Reviews", value: "0" },
          { title: "System Revenue", value: "৳0.00" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[400px] flex items-center justify-center text-muted-foreground">
        Admin management features coming soon...
      </div>
    </div>
  );
}
