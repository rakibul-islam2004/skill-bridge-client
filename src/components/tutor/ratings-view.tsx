"use client";

import { Star, MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface RatingsViewProps {
  reviews: any[];
  ratingAvg: number;
  reviewCount: number;
}

export function RatingsView({ reviews, ratingAvg, reviewCount }: RatingsViewProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
        <MessageSquare className="h-10 w-10 mb-4 opacity-20" />
        <p>No reviews yet.</p>
        <p className="text-sm">Patiently wait for student feedback after your sessions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="text-center">
          <div className="text-4xl font-black text-primary">{ratingAvg.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`h-3 w-3 ${s <= Math.round(ratingAvg) ? "fill-primary text-primary" : "text-muted"}`} 
              />
            ))}
          </div>
        </div>
        <div className="h-12 w-px bg-primary/10" />
        <div>
          <p className="text-sm font-bold">{reviewCount} Total Reviews</p>
          <p className="text-xs text-muted-foreground mt-0.5">Based on student feedback from completed sessions.</p>
        </div>
      </div>

      {/* Review List */}
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarImage src={review.student?.user?.image || ""} />
                  <AvatarFallback className="text-[10px]">
                    {review.student?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{review.student?.user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {format(new Date(review.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-400/10 rounded-full">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                <span className="text-xs font-black text-yellow-600">{review.rating}</span>
              </div>
            </div>
            <p className="text-sm italic text-muted-foreground border-l-2 border-primary/10 pl-4 py-1">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
