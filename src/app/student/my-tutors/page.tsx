"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Users,
  Loader2,
  Calendar,
  BookOpen,
  Star,
  ArrowRight,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Booking {
  id: string;
  tutorId: string;
  startTime: string;
  status: string;
  tutor: {
    id: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
}

export default function MyTutorsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["student-bookings"],
    queryFn: async () => {
      const { data } = await api.get<Booking[]>("/booking/my-bookings");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const tutorMap = new Map<string, {
    tutor: Booking["tutor"];
    sessions: Booking[];
  }>();

  bookings?.forEach((booking) => {
    if (booking.tutor && booking.tutorId) {
      const existing = tutorMap.get(booking.tutorId);
      if (existing) {
        existing.sessions.push(booking);
      } else {
        tutorMap.set(booking.tutorId, {
          tutor: booking.tutor,
          sessions: [booking],
        });
      }
    }
  });

  const myTutors = Array.from(tutorMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tutors</h1>
        <p className="text-muted-foreground mt-1">
          Tutors you've booked sessions with.
        </p>
      </div>

      {myTutors.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-primary opacity-30" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tutors yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Book your first session to start building your tutor network.
            </p>
            <Button asChild>
              <Link href="/tutors">
                <Search className="mr-2 h-4 w-4" />
                Find Tutors
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTutors.map(({ tutor, sessions }) => {
            const sessionsCount = sessions.length;
            const lastSession = sessions
              .map((s) => new Date(s.startTime))
              .sort((a, b) => b.getTime() - a.getTime())[0];
            const completedSessions = sessions.filter(
              (s) => s.status === "COMPLETED"
            ).length;

            return (
              <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage src={tutor.user?.image ?? undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">
                        {tutor.user?.name?.charAt(0) ?? "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {tutor.user?.name ?? "Tutor"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {sessionsCount} session{sessionsCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        Last session: {format(lastSession, "MMM d, yyyy")}
                      </span>
                    </div>
                    {completedSessions > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{completedSessions} completed</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/tutors/${tutor.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/tutors/${tutor.id}`}>
                        Book Again
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
