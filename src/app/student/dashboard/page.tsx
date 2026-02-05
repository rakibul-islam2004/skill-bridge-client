"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["student-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/booking/my-bookings");
      return data;
    },
  });

  // Calculate stats
const activeBookings = bookings?.filter((b: any) =>
new Date(b.startTime) > new Date() && b.status === "CONFIRMED"
).length || 0;

  const totalHours = bookings?.reduce((acc: number, b: any) => {
    const duration = b.pricing?.durationMinutes || 0;
    return acc + (duration / 60);
  }, 0).toFixed(1) || "0";

  const uniqueTutors = new Set(bookings?.map((b: any) => b.tutorId)).size || 0;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Manage your learning journey and upcoming sessions here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Active Bookings
              </div>
              <div className="text-2xl font-bold">{activeBookings}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Total Hours
              </div>
              <div className="text-2xl font-bold">{totalHours}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                My Tutors
              </div>
              <div className="text-2xl font-bold">{uniqueTutors}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/5">
          <BookOpen className="h-12 w-12 text-primary/40" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-semibold">Ready to learn?</h3>
          <p className="text-muted-foreground">
            Find expert tutors and book your next session to continue your progress.
          </p>
        </div>
        <Button asChild>
          <Link href="/tutors">Find a Tutor</Link>
        </Button>
      </div>
    </div>
  );
}
