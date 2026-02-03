"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  CalendarDays,
  Star,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TutorBookingsPage() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["tutor-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/booking/my-bookings");
      return data;
    },
  });

  const markCompletedMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await api.patch(`/booking/${bookingId}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["tutor-dashboard"] });
      toast.success("Session marked as completed! Balance updated.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to mark session as completed");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Loading teaching sessions...</span>
      </div>
    );
  }

  const tutorBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teaching Sessions</h1>
        <p className="text-muted-foreground mt-1">
          View your upcoming and past sessions with students.
        </p>
      </div>

      <div className="space-y-6">
        {tutorBookings.length > 0 ? (
          tutorBookings.map((booking: any) => {
            const isPast = new Date(booking.startTime) < new Date();
            const canJoin =
              booking.meetingLink &&
              (booking.status === "CONFIRMED" || booking.status === "PENDING") &&
              !isPast;
            const canMarkCompleted =
              booking.status === "CONFIRMED" &&
              isPast &&
              !booking.review; // Can mark completed if past and not already reviewed

            return (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all gap-6"
              >
                <div className="flex items-center gap-5">
                  <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={booking.student?.user?.image || ""} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {booking.student?.user?.name?.charAt(0) ?? "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">{booking.student?.user?.name ?? "Student"}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider h-5 ${
                          booking.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : ""
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5 font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(booking.startTime), "PPP")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5 font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        {format(new Date(booking.startTime), "p")} (
                        {booking.pricing?.durationMinutes ?? "—"}m)
                      </div>
                    </div>
                    {booking.review && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                        <span className="font-medium">{booking.review.rating}/5</span>
                        {booking.review.comment && (
                          <span className="text-muted-foreground truncate max-w-[200px]">
                            — {booking.review.comment}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {canJoin && (
                    <Button className="flex-1 md:flex-none gap-2 rounded-xl shadow-lg" asChild>
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Join meeting with student (opens in new tab)"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  {canMarkCompleted && (
                    <Button
                      variant="outline"
                      className="flex-1 md:flex-none gap-2 rounded-xl border-green-500/20 hover:bg-green-500/5 text-green-600 font-bold"
                      onClick={() => markCompletedMutation.mutate(booking.id)}
                      disabled={markCompletedMutation.isPending}
                    >
                      {markCompletedMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Completed
                        </>
                      )}
                    </Button>
                  )}
                  {booking.status === "COMPLETED" && !booking.review && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 font-bold"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  {booking.review && !canJoin && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-400/10 text-yellow-600 border-none gap-1 font-bold"
                    >
                      <Star className="h-3 w-3 fill-yellow-400" />
                      Rated {booking.review.rating}/5
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border-2 border-dashed border-primary/20 bg-muted/30">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <CalendarDays className="h-10 w-10 text-primary opacity-30" />
            </div>
            <h3 className="text-2xl font-bold">No sessions yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              When students book you, your teaching sessions will appear here. Share your profile to get started.
            </p>
            <Button className="mt-8 rounded-2xl px-10 h-14 font-bold" asChild>
              <a href="/tutor/profile">Complete your profile</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
