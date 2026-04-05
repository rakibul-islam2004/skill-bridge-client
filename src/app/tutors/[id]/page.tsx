"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import {
  Star,
  ShieldCheck,
  GraduationCap,
  MessageSquare,
  Loader2,
  Info,
  Award,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookingSelector } from "../../../components/public/booking-selector";

interface TutorCategory {
  id: string;
  category: { name: string };
}

interface TutorReview {
  id: string;
  comment: string;
  student?: { user?: { name?: string; image?: string } };
}

interface Pricing {
  id: string;
  durationMinutes: number;
  price: number;
}

interface Availability {
  id: string;
  startTime: string;
  bookings?: { id: string }[];
}

interface PublicTutorProfileData {
  id: string;
  user?: { name?: string; image?: string };
  ratingAvg?: number | null;
  experience?: number | null;
  experienceDetails?: string | null;
  bio?: string | null;
  tutorCategories?: TutorCategory[];
  pricings?: Pricing[];
  availabilities?: Availability[];
  reviews?: TutorReview[];
}

export default function PublicTutorProfile() {
  const { id } = useParams();

  const { data: tutor, isLoading } = useQuery<PublicTutorProfileData | null>({
    queryKey: ["public-tutor", id],
    queryFn: async () => {
      const { data } = await api.get(`/booking/tutors/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-black">Tutor not found</h2>
        <Button asChild className="mt-6 rounded-full px-8">
          <Link href="/tutors">Explore Tutors</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 font-sans">
      {/* PREMIUM DARK BANNER SECTION */}
      <div className="relative h-80 w-full overflow-hidden shadow-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 opacity-95" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com')]" />
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary/20 blur-[120px] opacity-70" />
        <div className="absolute bottom-0 left-14 h-52 w-52 rounded-full bg-sky-500/10 blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md">
              <CardContent className="p-8 sm:p-14">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                  <div className="relative">
                    <Avatar className="h-44 w-44 border-8 border-white dark:border-zinc-800 shadow-2xl">
                      <AvatarImage
                        src={tutor.user?.image || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-5xl bg-zinc-100 dark:bg-zinc-800 text-primary font-black">
                        {tutor.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-zinc-900">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {tutor.user?.name}
                      </h1>
                      <p className="text-primary font-bold text-sm tracking-widest uppercase">
                        Verified Professional Educator
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-2xl">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-black text-sm">
                          {tutor.ratingAvg?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-2xl">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="font-black text-sm">
                          {tutor.experience || 0}+ Yrs Exp.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                      {tutor.tutorCategories?.map((tc: TutorCategory) => (
                        <Badge
                          key={tc.id}
                          className="bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 border-none px-5 py-2 rounded-full text-xs font-bold shadow-sm"
                        >
                          {tc.category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-16 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">
                      About me
                    </h3>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-medium italic">
                    &quot;
                    {tutor.experienceDetails ||
                      tutor.bio ||
                      "Success-driven education focused on student results."}
                    &quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-3 px-6">
                <MessageSquare className="h-6 w-6 text-primary" /> Student
                Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutor.reviews && tutor.reviews.length > 0 ? (
                  tutor.reviews.map((review) => (
                    <Card
                      key={review.id}
                      className="rounded-[2.5rem] border-none shadow-lg bg-white dark:bg-zinc-900 p-8"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                          <AvatarImage src={review.student?.user?.image} />
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <p className="font-black text-sm">
                          {review.student?.user?.name}
                        </p>
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
                        &quot;{review.comment}&quot;
                      </p>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed rounded-[3rem] opacity-30">
                    <Award className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm font-bold">No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8 h-fit">
            <BookingSelector
              tutor={tutor}
              pricings={tutor.pricings ?? []}
              availabilities={tutor.availabilities ?? []}
            />

            <Card className="rounded-[3rem] border-none shadow-2xl bg-slate-950/95 dark:bg-zinc-900/95 text-white overflow-hidden backdrop-blur-sm">
              <CardContent className="p-10 space-y-6 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Info className="h-16 w-16" />
                </div>
                <h4 className="text-xl font-black flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" /> Booking Info
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Select a{" "}
                  <span className="text-white font-bold">pricing plan</span> and
                  an
                  <span className="text-white font-bold"> available slot</span>.
                  Complete payment to secure your session.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
