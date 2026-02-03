"use client";

import { useState } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewModalProps {
  booking: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewModal({ booking, isOpen, onOpenChange }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please add a comment about your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/booking/review", {
        bookingId: booking.id,
        tutorId: booking.tutorId,
        rating,
        comment,
      });

      toast.success("Review submitted! Thank you for your feedback.");
      queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px] overflow-hidden p-0 border-none">
        <div className="bg-primary h-2 w-full" />
        <div className="p-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-black">Rate Your Session</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              How was your lesson with <span className="font-bold text-foreground">{booking.tutor?.user?.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-8">
            {/* Star Selector */}
            <div className="flex flex-col items-center gap-3" role="group" aria-label="Rate your session">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                    aria-pressed={rating === star}
                  >
                    <Star 
                      className={`h-10 w-10 ${
                        star <= rating 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-zinc-200 dark:text-zinc-800"
                      }`} 
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {rating === 5 ? "Exceptional!" : 
                 rating === 4 ? "Great Job" : 
                 rating === 3 ? "Just OK" : 
                 rating === 2 ? "Could be Better" : "Poor Experience"}
              </p>
            </div>

            <div className="space-y-3">
              <label htmlFor="review-comment" className="text-xs font-black uppercase tracking-widest opacity-60">
                Your Feedback
              </label>
              <Textarea
                id="review-comment"
                placeholder="Share what you liked or how the tutor could improve..."
                className="min-h-[120px] rounded-2xl bg-zinc-50 dark:bg-black/40 border-none shadow-inner resize-none focus-visible:ring-primary/20"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-describedby="review-comment-hint"
              />
              <span id="review-comment-hint" className="sr-only">Required. Share what you liked or how the tutor could improve.</span>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Submit Review
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
