"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TutorCardProps {
  tutor: any;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const pathname = usePathname();

  const lowestPrice =
    tutor.pricings?.length > 0
      ? Math.min(...tutor.pricings.map((p: any) => parseFloat(p.price)))
      : null;

  const totalReviews = tutor._count?.reviews || tutor.reviews?.length || 0;
  const rating = tutor.ratingAvg?.toFixed(1) || "New";

  // Check if we are already on this tutor's specific profile page
  const isCurrentProfile = pathname === `/tutors/${tutor.id}`;

  return (
    <Card className="group overflow-hidden border hover:border-primary/50 transition-all hover:shadow-lg bg-white dark:bg-zinc-900">
      <CardContent className="p-0">
        {/* Avatar Section */}
        <div className="relative bg-gradient-to-br from-primary/10 to-blue-500/10 p-8">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-800 shadow-lg mb-4">
              <AvatarImage
                src={tutor.user?.image || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                {tutor.user?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold line-clamp-1">
                {tutor.user?.name}
              </h3>
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{rating}</span>
              <span className="text-xs text-muted-foreground">
                ({totalReviews})
              </span>
            </div>
          </div>

          {/* Price Badge */}
          {lowestPrice !== null && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg">
              ৳{lowestPrice}+
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {tutor.tutorCategories?.slice(0, 3).map((tc: any) => (
              <Badge
                key={tc.id}
                variant="secondary"
                className="text-xs font-medium"
              >
                {tc.category?.name}
              </Badge>
            ))}
            {tutor.tutorCategories?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tutor.tutorCategories.length - 3}
              </Badge>
            )}
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[40px]">
            {tutor.bio ||
              "Experienced tutor dedicated to helping students achieve their learning goals through personalized instruction."}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{tutor.experience || 0}+ years</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{totalReviews} reviews</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="w-full group/btn"
          variant={isCurrentProfile ? "outline" : "default"}
          disabled={isCurrentProfile}
        >
          <Link href={`/tutors/${tutor.id}`}>
            {isCurrentProfile ? "Currently Viewing" : "View Profile"}
            {!isCurrentProfile && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
