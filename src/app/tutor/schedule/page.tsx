import { AvailabilityManager } from "@/components/tutor/availability-manager";

export default function TutorSchedulePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability & Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Manage your teaching hours and open slots for bookings.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-2 sm:p-6 shadow-sm">
        <AvailabilityManager />
      </div>
    </div>
  );
}
