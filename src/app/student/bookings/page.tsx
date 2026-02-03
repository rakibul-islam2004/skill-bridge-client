"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  ExternalLink,
  Loader2,
  CalendarDays,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReviewModal } from "@/components/shared/review-modal";
import { useState } from "react";

export default function StudentBookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["student-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/booking/my-bookings");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Loading your bookings...</span>
      </div>
    );
  }

  const handleReviewClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black">My <span className="text-primary italic">Learning</span> Journey</h1>
          <p className="text-muted-foreground mt-1">Manage your booked sessions and join live meetings.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <a href="/tutors">Book Another Session</a>
        </Button>
      </div>

      <div className="space-y-6">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking: any) => {
            const isPast = new Date(booking.startTime) < new Date();
            const canReview = (isPast || booking.status === "COMPLETED") && !booking.review;

            return (
              <div 
                key={booking.id} 
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[2rem] border bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all gap-6"
              >
                <div className="flex items-center gap-5">
                  <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={booking.tutor?.user?.image || ""} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {booking.tutor?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-lg">{booking.tutor?.user?.name}</p>
                      <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider h-5 ${
                        booking.status === "COMPLETED" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                      }`}>
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
                        {format(new Date(booking.startTime), "p")} ({booking.pricing?.durationMinutes}m)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {canReview && (
                    <Button 
                      variant="outline" 
                      className="flex-1 md:flex-none gap-2 rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold"
                      onClick={() => handleReviewClick(booking)}
                    >
                      <Star className="h-4 w-4 fill-primary" />
                      Leave Review
                    </Button>
                  )}
                  {booking.review && (
                    <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-600 border-none gap-1 font-bold">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      Rated {booking.review.rating}/5
                    </Badge>
                  )}
                  {booking.meetingLink && booking.status === "CONFIRMED" && !isPast && (
                    <Button className="flex-1 md:flex-none gap-2 rounded-xl shadow-lg" asChild>
                      <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" aria-label="Join meeting (opens in new tab)">
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0" asChild>
                    <a href={`/tutors/${booking.tutorId}`} aria-label={`View ${booking.tutor?.user?.name ?? "tutor"} profile`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] border-2 border-dashed border-primary/20 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <CalendarDays className="h-10 w-10 text-primary opacity-30" />
            </div>
            <h3 className="text-2xl font-black">No sessions yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Your learning journey is waiting to begin. Find an expert tutor and book your first 1-on-1 session today.
            </p>
            <Button className="mt-8 rounded-2xl px-10 h-14 font-black text-md shadow-xl hover:shadow-primary/20 transition-all" asChild>
              <a href="/tutors">Discover Tutors</a>
            </Button>
          </div>
        )}
      </div>

      {selectedBooking && (
        <ReviewModal 
          booking={selectedBooking} 
          isOpen={isReviewOpen} 
          onOpenChange={setIsReviewOpen} 
        />
      )}
    </div>
  );
}
