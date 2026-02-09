"use client";

import { useState } from "react";
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
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [selectedPricingId, setSelectedPricingId] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = availabilities.filter(
    (slot) => !slot.bookings || slot.bookings.length === 0,
  );

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
      await api.post("/booking/confirm", {
        tutorId: tutor.id,
        pricingId: selectedPricingId,
        availabilityId: selectedSlotId,
      });

      queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
      toast.success("Booking confirmed!");
      router.push("/student/bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPricing = pricings.find((p) => p.id === selectedPricingId);

  return (
    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-primary/10">
      <CardHeader className="bg-zinc-950 pb-6 border-b border-white/5">
        <CardTitle className="text-xl font-black flex items-center gap-2 text-zinc-100">
          <Calendar className="h-5 w-5 text-primary" />
          Book Your Session
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
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
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {p.durationMinutes} Minutes Session
                  </p>
                  <p className="font-black text-primary text-lg">৳{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
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
                        : "bg-zinc-50 dark:bg-black/40 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-400"
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
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent bg-zinc-50 dark:bg-black/40 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {format(new Date(slot.startTime), "p")}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-50 dark:bg-black/40 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-bold text-zinc-500">
                No slots available.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-zinc-950 dark:bg-black border-t border-white/5">
        {!session ? (
          <Button
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-lg"
            asChild
          >
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
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 transition-all"
            disabled={!selectedPricingId || !selectedSlotId}
          >
            Confirm & Book
            {selectedPricing && (
              <span className="ml-1 opacity-80">
                for ৳{selectedPricing.price}
              </span>
            )}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
