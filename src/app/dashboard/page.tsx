"use client";

import { authClient, User } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardGate() {
  const { data: sessionData, isPending, refetch: refetchSession } = authClient.useSession();
  const router = useRouter();
  const hasRefetchedForRole = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!sessionData) {
      router.push("/login");
      return;
    }

    const user = sessionData.user as User;

    if (!user.role) {
      if (!hasRefetchedForRole.current) {
        hasRefetchedForRole.current = true;
        refetchSession();
        return;
      }
      router.push("/onboard");
      return;
    }

    if (user.role === "ADMIN") router.push("/admin/dashboard");
    else if (user.role === "TUTOR") router.push("/tutor/dashboard");
    else router.push("/student/dashboard");
  }, [sessionData, isPending, router, refetchSession]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center" role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground animate-pulse">
          Checking your credentials...
        </p>
      </div>
    </div>
  );
}
