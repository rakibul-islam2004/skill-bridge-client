"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

function SSLCommerzFailPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-[2rem] border-none shadow-2xl overflow-hidden">
        <CardContent className="p-10 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="text-3xl font-black mt-6">Payment Not Completed</h1>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Your SSLCommerz sandbox payment did not complete.{" "}
            {error ? error : "You can try booking again."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-10">
              <Link href="/tutors">Return to Tutors</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full px-10">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SSLCommerzFailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSLCommerzFailPageContent />
    </Suspense>
  );
}
