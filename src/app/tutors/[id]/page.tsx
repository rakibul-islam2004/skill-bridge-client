"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams, usePathname } from "next/navigation";
import {
  Star,
  ShieldCheck,
  GraduationCap,
  MessageSquare,
  Loader2,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { BookingSelector } from "../../../components/public/booking-selector";

export default function PublicTutorProfile() {
  const { id } = useParams();
  const pathname = usePathname();

  const { data: tutor, isLoading } = useQuery({
    queryKey: ["public-tutor", id],
    queryFn: async () => {
      const { data } = await api.get(`/booking/tutors/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-white dark:bg-black">
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <div className="h-64 w-full bg-zinc-950 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <Avatar className="h-36 w-36 border-[6px] border-white dark:border-zinc-900 shadow-2xl">
                    <AvatarImage
                      src={tutor.user?.image || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                      {tutor.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {tutor.user?.name}
                      </h1>
                      <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-none px-3 py-1 font-bold gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600 dark:text-zinc-400 font-bold">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {tutor.experience || 0}+ Years Exp.
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-zinc-900 dark:text-white">
                          {tutor.ratingAvg?.toFixed(1) || "New"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {tutor.tutorCategories?.map((tc: any) => (
                        <Badge
                          key={tc.id}
                          className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none px-4 py-1.5 rounded-full text-xs font-bold"
                        >
                          {tc.category?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                    About the Tutor
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line font-medium">
                    {tutor.experienceDetails ||
                      tutor.bio ||
                      "No background provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900">
              <CardContent className="p-8 sm:p-12">
                <h3 className="text-2xl font-black flex items-center gap-3 mb-8 text-zinc-900 dark:text-white">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Reviews
                </h3>
                {tutor.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {tutor.reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {review.student?.user?.name}
                          </p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-sm font-black">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 italic text-sm">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-10 text-muted-foreground font-medium">
                    No reviews yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8 h-fit">
            <BookingSelector
              tutor={tutor}
              pricings={tutor.pricings}
              availabilities={tutor.availabilities}
            />

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-zinc-900 dark:bg-white overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Info className="h-5 w-5" />
                  </div>
                  <h4 className="font-black text-white dark:text-zinc-900">
                    Booking Info
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-600 font-medium">
                  Select a{" "}
                  <span className="text-zinc-100 dark:text-zinc-900 font-bold">
                    plan
                  </span>{" "}
                  and
                  <span className="text-zinc-100 dark:text-zinc-900 font-bold">
                    {" "}
                    time slot
                  </span>{" "}
                  to book your session. Login is required to confirm payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
