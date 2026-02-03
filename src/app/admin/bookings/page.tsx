"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Clock, 
  Loader2,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ["admin-bookings-list"],
    queryFn: async () => {
      const { data } = await api.get<any[]>("/admin/bookings");
      return data;
    },
  });

  const filteredBookings = bookings?.filter((booking) => {
    const studentName = booking.student?.name?.toLowerCase() ?? "";
    const tutorName = booking.tutor?.user?.name?.toLowerCase() ?? "";
    const query = searchQuery.toLowerCase();
    return studentName.includes(query) || tutorName.includes(query);
  }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Bookings</h1>
        <p className="text-muted-foreground mt-1">
          Monitor all session bookings across the platform.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or tutor name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-destructive">
              <p>Failed to load bookings.</p>
              <p className="text-sm">{(error as any)?.message ?? "Try again later."}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No bookings found matching your search.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 text-[10px]">
                          <AvatarImage src={booking.student?.image || ""} />
                          <AvatarFallback>
                            {booking.student?.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{booking.student?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 text-[10px]">
                          <AvatarImage src={booking.tutor?.user?.image || ""} />
                          <AvatarFallback>
                            {booking.tutor?.user?.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{booking.tutor?.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {format(new Date(booking.startTime), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(booking.startTime), "p")} ({booking.pricing?.durationMinutes ?? 0}m)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">
                        ৳{booking.pricing?.amount ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`font-normal text-[10px] uppercase tracking-wider ${
                          booking.status === "COMPLETED" ? "bg-green-500/10 text-green-600 hover:bg-green-500/10" : 
                          booking.status === "CONFIRMED" ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10" :
                          booking.status === "CANCELLED" ? "bg-red-500/10 text-red-600 hover:bg-red-500/10" :
                          booking.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10" : ""
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
