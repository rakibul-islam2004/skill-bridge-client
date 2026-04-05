"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";

function SSLCommerzSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");
  const tranId = searchParams.get("tran_id");
  const status = searchParams.get("status") || "VALID";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-[2rem] border-none shadow-2xl overflow-hidden">
        <CardContent className="p-10 text-center">
          <div className="space-y-6">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="text-3xl font-black">Payment Confirmed</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your SSLCommerz sandbox payment was successful.
            </p>
            {bookingId ? (
              <p className="text-sm text-slate-500">
                Booking ID: <span className="font-bold">{bookingId}</span>
              </p>
            ) : null}
            {tranId ? (
              <p className="text-sm text-slate-500">
                Transaction ID: <span className="font-bold">{tranId}</span>
              </p>
            ) : null}
            <p className="text-sm text-slate-500">Payment status: {status}</p>
            <Button
              onClick={() => router.push("/student/bookings")}
              className="mx-auto rounded-full px-10"
            >
              Go to My Bookings
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SSLCommerzSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSLCommerzSuccessPageContent />
    </Suspense>
  );
}
