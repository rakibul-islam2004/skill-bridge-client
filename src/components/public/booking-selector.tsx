"use client";

import { useState } from "react";
// 1. Ensure usePathname is imported from next/navigation
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Calendar, Clock, Loader2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

interface BookingSelectorProps {
  tutor: any;
  pricings: any[];
  availabilities: any[];
}

export function BookingSelector({
  tutor,
  pricings,
  availabilities,
}: BookingSelectorProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // 2. CRITICAL FIX: Define pathname using the hook
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const [selectedPricingId, setSelectedPricingId] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out slots that are already booked
  const availableSlots = availabilities.filter(
    (slot) => !slot.bookings || slot.bookings.length === 0,
  );

  // Group availabilities by date
  const groupedSlots: Record<string, any[]> = {};
  availableSlots.forEach((slot) => {
    const dateKey = format(new Date(slot.startTime), "yyyy-MM-dd");
    if (!groupedSlots[dateKey]) groupedSlots[dateKey] = [];
    groupedSlots[dateKey].push(slot);
  });

  const uniqueDates = Object.keys(groupedSlots).sort();
  const [activeDate, setActiveDate] = useState(uniqueDates[0] || "");

  const handleBooking = async () => {
    if (!session) {
      toast.error("Please login to book a session");
      // 3. FIX: Use the safe pathname variable instead of window.location
      router.push(
        `/login?redirect=${encodeURIComponent(pathname || "/tutors")}`,
      );
      return;
    }

    if (!selectedPricingId || !selectedSlotId) {
      toast.warning("Please select a duration and a time slot");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: res } = await api.post<{
        success: boolean;
        data: { meetingLink?: string; startTime?: string };
      }>("/booking/confirm", {
        tutorId: tutor.id,
        pricingId: selectedPricingId,
        availabilityId: selectedSlotId,
      });

      queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
      toast.success("Booking confirmed!");
      router.push("/student/bookings");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPricing = pricings.find((p) => p.id === selectedPricingId);

  return (
    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-primary/10">
      <CardHeader className="bg-primary/5 pb-6">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Book Your Session
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Step 1: Select Duration */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
              1
            </span>
            Select Duration
          </label>
          <div className="grid grid-cols-1 gap-2">
            {pricings.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPricingId(p.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  selectedPricingId === p.id
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-transparent bg-zinc-50 dark:bg-black/40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">
                    {p.durationMinutes} Minutes Session
                  </p>
                  <p className="font-black text-primary text-lg">৳{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date & Slot */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
              2
            </span>
            Select Time Slot
          </label>

          {uniqueDates.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setActiveDate(date)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all ${
                      activeDate === date
                        ? "bg-primary text-white shadow-lg"
                        : "bg-zinc-50 dark:bg-black/40 hover:bg-zinc-100"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">
                      {format(new Date(date), "EEE")}
                    </span>
                    <span className="text-lg font-black">
                      {format(new Date(date), "d")}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {groupedSlots[activeDate]?.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      selectedSlotId === slot.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-zinc-50 dark:bg-black/40 hover:bg-zinc-100"
                    }`}
                  >
                    {format(new Date(slot.startTime), "p")}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-50 dark:bg-black/40 rounded-3xl border-2 border-dashed">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-medium text-muted-foreground">
                No slots available.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-zinc-50 dark:bg-black/40 border-t">
        {/* 4. FIX: pathname is now safely defined for this Link component */}
        {!session ? (
          <Button className="w-full h-14 rounded-2xl font-black gap-2" asChild>
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/tutors")}`}
            >
              <Lock className="h-4 w-4" />
              Login to Book
            </Link>
          </Button>
        ) : isSubmitting ? (
          <Button disabled className="w-full h-14 rounded-2xl font-black gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl hover:shadow-primary/20 transition-all"
            disabled={!selectedPricingId || !selectedSlotId}
          >
            Confirm & Book
            {selectedPricing && (
              <span className="ml-1">for ৳{selectedPricing.price}</span>
            )}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
