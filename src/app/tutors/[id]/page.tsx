"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Video,
  Award,
  GraduationCap,
  MessageSquare,
  Loader2,
  ChevronRight,
  Info
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay } from "date-fns";
import { useState } from "react";
import Link from "next/link";
import { BookingSelector } from "../../../components/public/booking-selector";

export default function PublicTutorProfile() {
  const { id } = useParams();
  
  const { data: tutor, isLoading } = useQuery({
    queryKey: ["public-tutor", id],
    queryFn: async () => {
      const { data } = await api.get(`/booking/tutors/${id}`);
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

  if (!tutor) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">Tutor not found</h2>
        <Button asChild className="mt-4">
          <Link href="/tutors">Back to Discovery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Background Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-primary to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card & Bio */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-zinc-900 shadow-xl">
                    <AvatarImage src={tutor.user?.image || ""} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {tutor.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-4xl font-black tracking-tight">{tutor.user?.name}</h1>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-none px-3 font-bold gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm font-medium opacity-70">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        {tutor.experience || 0}+ Years Experience
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 border-none" />
                        {tutor.ratingAvg?.toFixed(1) || "New"} / 5.0 Rating
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {tutor.tutorCategories?.map((tc: any) => (
                        <Badge key={tc.id} className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors px-4 py-1 rounded-full">
                          {tc.category?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 space-y-6">
                  <h3 className="text-2xl font-black">About the Tutor</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {tutor.experienceDetails || tutor.bio || "No detailed background provided yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Student Reviews
                  </h3>
                </div>

                {tutor.reviews?.length > 0 ? (
                  <div className="space-y-8">
                    {tutor.reviews.map((review: any) => (
                      <div key={review.id} className="group border-b last:border-none pb-8 last:pb-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                              <AvatarImage src={review.student?.user?.image || ""} />
                              <AvatarFallback>{review.student?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold">{review.student?.user?.name}</p>
                              <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/10 rounded-full">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                            <span className="text-sm font-black text-yellow-600">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic pl-14 relative">
                          <span className="absolute left-10 top-0 text-primary text-2xl font-serif opacity-30">"</span>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border-2 border-dashed rounded-[2rem] opacity-50">
                    <MessageSquare className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <p>No reviews yet. Be the first student!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Booking Sidecard */}
          <div className="space-y-8 lg:sticky lg:top-24 h-fit">
            <BookingSelector 
              tutor={tutor} 
              pricings={tutor.pricings} 
              availabilities={tutor.availabilities} 
            />
            
            {/* Quick Info Card */}
            <Card className="rounded-[2rem] border-none shadow-lg bg-zinc-900 text-white dark:bg-white dark:text-black">
              <CardContent className="p-8 space-y-6">
                <h4 className="font-bold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Things to Note
                </h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    Sessions take place via Jitsi Meet.
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    You can cancel up to 24h before.
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    Payments are handled securely.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
