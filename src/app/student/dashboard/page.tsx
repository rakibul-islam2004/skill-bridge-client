export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Manage your learning journey and upcoming sessions here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Active Bookings", value: "0" },
          { title: "Total Hours", value: "0" },
          { title: "My Tutors", value: "0" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[300px] flex items-center justify-center text-muted-foreground">
        Find a tutor to get started!
      </div>
    </div>
  );
}
