"use client";

import { format, isPast, addMinutes } from "date-fns";
import { 
  Video, 
  User, 
  Calendar, 
  Clock, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UpcomingSessionsProps {
  sessions: any[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
        <Calendar className="h-10 w-10 mb-4 opacity-20" />
        <p>No upcoming sessions booked yet.</p>
        <p className="text-sm">When students book your slots, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const startTime = new Date(session.startTime);
        const isActive = !isPast(addMinutes(startTime, 10)) && isPast(addMinutes(startTime, -10));
        
        return (
          <div 
            key={session.id} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/30 transition-all hover:shadow-md gap-4"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={session.student?.user?.image || ""} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {session.student?.user?.name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{session.student?.user?.name}</p>
                  {isActive && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 animate-pulse text-[10px] h-5">
                      Live Now
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(startTime, "MMM do")}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="h-3 w-3" />
                    {format(startTime, "p")} ({session.pricing?.durationMinutes}m)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {session.meetingLink && (
                <Button 
                  size="sm" 
                  className={`w-full sm:w-auto gap-2 ${isActive ? "bg-green-600 hover:bg-green-700" : ""}`}
                  asChild
                >
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Join Meeting
                  </a>
                </Button>
              )}
            </div>
          </div>
        );
      })}
      
      {sessions.length >= 5 && (
        <Button variant="ghost" className="w-full text-muted-foreground text-xs gap-2" asChild>
          <a href="/tutor/bookings">
            View All Bookings
            <ArrowRight className="h-3 w-3" />
          </a>
        </Button>
      )}
    </div>
  );
}
