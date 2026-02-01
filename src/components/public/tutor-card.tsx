"use client";

import Link from "next/link";
import { Star, Clock, GraduationCap, ArrowRight, CheckCircle, Crown, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TutorCardProps {
  tutor: any;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const lowestPrice = tutor.pricings?.length > 0
    ? Math.min(...tutor.pricings.map((p: any) => parseFloat(p.price)))
    : null;

  const totalReviews = tutor.reviews?.length || 0;

  return (
    <Card className="group overflow-hidden border-2 border-primary/5 transition-all hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:bg-zinc-900/50 rounded-[2.5rem] bg-white">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3]">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage 
                src={tutor.user?.image || ""} 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <AvatarFallback className="text-4xl bg-primary/5 text-primary font-black">
                {tutor.user?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Action Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {tutor.isFeatured && (
              <Badge className="bg-yellow-400 text-black border-none px-3 py-1 font-black shadow-xl animate-bounce">
                <Crown className="h-3 w-3 mr-1 fill-black" />
                TOP PICK
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none shadow-lg px-3 py-1 font-bold">
              <BookOpen className="h-3 w-3 mr-1" />
              {tutor.experience || 0}+ Years
            </Badge>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-zinc-950/80 px-3 py-1.5 text-xs font-black text-white shadow-2xl backdrop-blur-md border border-white/10">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {tutor.ratingAvg?.toFixed(1) || "New"}
            <span className="opacity-40 font-medium ml-1">({totalReviews})</span>
          </div>

          {/* Pricing Highlight */}
          {lowestPrice !== null && (
            <div className="absolute bottom-4 right-4 rounded-2xl bg-primary px-4 py-2 text-sm font-black text-white shadow-2xl transition-transform group-hover:-translate-y-1">
              ৳{lowestPrice}+
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.tutorCategories?.slice(0, 3).map((tc: any) => (
            <Badge key={tc.id} className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
              {tc.category?.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-black line-clamp-1 tracking-tight">{tutor.user?.name}</h3>
          <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500/10" />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed">
          {tutor.bio || "Passionate educator dedicated to helping students achieve their full potential through personalized learning..."}
        </p>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button asChild className="w-full h-14 rounded-2xl gap-3 font-black text-md shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group/btn overflow-hidden relative">
          <Link href={`/tutors/${tutor.id}`}>
            <span className="relative z-10">View Profile</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
