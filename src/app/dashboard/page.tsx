"use client";

import { authClient, User } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardGate() {
  const { data: sessionData, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!sessionData) {
        router.push("/login");
        return;
      }


      const user = sessionData.user as User;

      if (!user.role) {
        router.push("/onboard");
      } else {
        const role = user.role;
        if (role === "ADMIN") router.push("/admin/dashboard");
        else if (role === "TUTOR") router.push("/tutor/dashboard");
        else router.push("/student/dashboard");
      }
    }
  }, [sessionData, isPending, router]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Checking your credentials...
        </p>
      </div>
    </div>
  );
}
