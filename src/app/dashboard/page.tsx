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

    // Wait slightly for session to stabilize on Vercel
    if (!sessionData) {
      const timer = setTimeout(() => {
        if (!sessionData) router.push("/login");
      }, 500);
      return () => clearTimeout(timer);
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

    // Role-based routing
    if (user.role === "ADMIN") router.push("/admin/dashboard");
    else if (user.role === "TUTOR") router.push("/tutor/dashboard");
    else router.push("/student/dashboard");
  }, [sessionData, isPending, router, refetchSession]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Syncing your account...
        </p>
      </div>
    </div>
  );
}
