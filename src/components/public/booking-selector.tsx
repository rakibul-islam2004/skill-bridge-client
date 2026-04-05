"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Calendar, Loader2, Lock, ArrowRight } from "lucide-react";
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

interface BookingSelectorProps {
  tutor: { id: string };
  pricings?: Pricing[];
  availabilities?: Availability[];
}

export function BookingSelector({
  tutor,
  pricings,
  availabilities,
}: BookingSelectorProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedPricingId, setSelectedPricingId] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots =
    availabilities?.filter(
      (slot) => !slot.bookings || slot.bookings.length === 0,
    ) ?? [];
  const groupedSlots: Record<string, Availability[]> = {};
  availableSlots.forEach((slot) => {
    const dateKey = format(new Date(slot.startTime), "yyyy-MM-dd");
    if (!groupedSlots[dateKey]) groupedSlots[dateKey] = [];
    groupedSlots[dateKey].push(slot);
  });

  const uniqueDates = Object.keys(groupedSlots).sort();
  const [activeDate, setActiveDate] = useState("");

  useEffect(() => {
    if (uniqueDates.length && !activeDate) {
      setActiveDate(uniqueDates[0]);
    }
  }, [uniqueDates, activeDate]);

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

    const selectedPricing = pricings?.find((p) => p.id === selectedPricingId);
    if (!selectedPricing) {
      toast.error("Selected pricing plan is not available.");
      return;
    }

    setIsSubmitting(true);
    try {
      const customerPhone =
        typeof session.user === "object" &&
        session.user !== null &&
        "phone" in session.user &&
        typeof (session.user as { phone?: string }).phone === "string"
          ? (session.user as { phone?: string }).phone
          : "01700000000";

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
        customer_phone: customerPhone,
      });

      const data = response.data;
      if (!data?.gatewayUrl) {
        throw new Error(data?.message || "Payment initialization failed.");
      }

      window.location.href = data.gatewayUrl;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Could not initialize payment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white/95 dark:bg-zinc-900/95 border-2 border-primary/15 backdrop-blur-sm">
      <CardHeader className="bg-slate-950/95 pb-6 border-b border-slate-800/70">
        <CardTitle className="text-lg font-black flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5 text-primary" /> Book Session
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            1. Select Plan
          </label>
          <div className="grid grid-cols-1 gap-2">
            {pricings?.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPricingId(p.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedPricingId === p.id ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.8)]" : "border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-900 dark:text-slate-100"}`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
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
                    className={`shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all ${activeDate === date ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800"}`}
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
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {groupedSlots[activeDate]?.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border-2 text-xs font-black transition-all ${selectedSlotId === slot.id ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-transparent bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800"}`}
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

      <CardFooter className="p-6 bg-slate-950/95 dark:bg-zinc-950/90 border-t border-slate-800/70">
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
