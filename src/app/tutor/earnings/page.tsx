"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Wallet,
  Calendar,
  Clock,
  Loader2,
  TrendingUp,
  Banknote,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TutorEarningsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["tutor-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/booking/my-bookings");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Loading earnings...</span>
      </div>
    );
  }

  const allBookings = Array.isArray(bookings) ? bookings : [];
  const completedBookings = allBookings.filter(
    (b: { status: string }) => b.status === "COMPLETED"
  );
  const totalEarnings = completedBookings.reduce(
    (sum: number, b: { pricing?: { price?: string | number } }) =>
      sum + Number(b.pricing?.price ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
        <p className="text-muted-foreground mt-1">
          Total revenue from completed sessions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/10 shadow-lg overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-primary">
              ৳{totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              From {completedBookings.length} completed session{completedBookings.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Sessions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedBookings.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-amber-500" />
              Average per Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ৳{completedBookings.length > 0 ? Math.round(totalEarnings / completedBookings.length).toLocaleString() : "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings history */}
      <Card className="border-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Earnings History
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Completed sessions and amounts earned.
          </p>
        </CardHeader>
        <CardContent>
          {completedBookings.length > 0 ? (
            <div className="space-y-4">
              {completedBookings.map((booking: {
                id: string;
                startTime: string;
                student?: { user?: { name?: string } };
                pricing?: { price?: string | number; durationMinutes?: number };
              }) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {booking.student?.user?.name ?? "Student"}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(booking.startTime), "PPP")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.pricing?.durationMinutes ?? "—"} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-primary">
                      ৳{Number(booking.pricing?.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border-2 border-dashed border-primary/20 bg-muted/20">
              <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No earnings yet</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                When you complete sessions with students, the earnings will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
