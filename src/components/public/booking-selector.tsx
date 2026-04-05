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
      toast.warning("Please select a plan and time slot");
      return;
    }

    const selectedPricing = pricings.find((p) => p.id === selectedPricingId);
    if (!selectedPricing) {
      toast.error("Selected pricing plan is not available.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/payment/ssl-commerce/session", {
        tutorId: tutor.id,
        pricingId: selectedPricingId,
        availabilityId: selectedSlotId,
        amount: selectedPricing.price,
        currency: "BDT",
        product_name: `${selectedPricing.durationMinutes} Min Session`,
        product_category: "Online Tutoring",
        customer_name: session.user?.name || "SkillBridge Student",
        customer_email: session.user?.email || "demo@skillbridge.local",
        customer_phone: session.user?.phone || "01700000000",
      });

      const data = response.data;
      if (!data?.gatewayUrl) {
        throw new Error(data?.message || "Payment initialization failed.");
      }

      window.location.href = data.gatewayUrl;
    } catch (err: any) {
      toast.error(err.message || "Could not initialize payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPricing = pricings.find((p) => p.id === selectedPricingId);

  return (
    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-primary/10">
      <CardHeader className="bg-zinc-950 pb-6 border-b border-white/5">
        <CardTitle className="text-lg font-black flex items-center gap-2 text-zinc-100">
          <Calendar className="h-5 w-5 text-primary" /> Book Session
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            1. Select Plan
          </label>
          <div className="grid grid-cols-1 gap-2">
            {pricings.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPricingId(p.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedPricingId === p.id ? "border-primary bg-primary/5 shadow-inner" : "border-transparent bg-zinc-50 dark:bg-black/40 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">
                    {p.durationMinutes} Min Session
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary text-lg">৳{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            2. Select Time
          </label>
          {uniqueDates.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setActiveDate(date)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all ${activeDate === date ? "bg-primary text-white shadow-lg" : "bg-zinc-50 dark:bg-black/40 text-zinc-400"}`}
                  >
                    <span className="text-[10px] font-bold">
                      {format(new Date(date), "EEE")}
                    </span>
                    <span className="text-lg font-black">
                      {format(new Date(date), "d")}
                    </span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {groupedSlots[activeDate]?.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border-2 text-xs font-black transition-all ${selectedSlotId === slot.id ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-zinc-50 dark:bg-black/40 text-zinc-500"}`}
                  >
                    {format(new Date(slot.startTime), "p")}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-50 dark:bg-black/40 rounded-3xl border-2 border-dashed opacity-30">
              <p className="text-xs font-bold">No slots</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-zinc-950 dark:bg-black border-t border-white/5">
        {!session ? (
          <Button
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl"
            asChild
          >
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/tutors")}`}
            >
              <Lock className="h-4 w-4" /> Login to Book
            </Link>
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 transition-all"
            disabled={isSubmitting || !selectedPricingId || !selectedSlotId}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Booking"
            )}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
