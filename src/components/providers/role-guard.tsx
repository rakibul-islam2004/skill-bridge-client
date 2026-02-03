"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient, Session } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

type Role = "STUDENT" | "TUTOR" | "ADMIN";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

/**
 * Protects routes by ensuring the user is logged in and has one of the allowed roles.
 * Redirects to /login if not authenticated, or to /dashboard if role doesn't match.
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { data: rawSession, isPending } = authClient.useSession();
  const session = rawSession as Session | null;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = session.user?.role as Role | undefined;
    if (!role || !allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [session, isPending, allowedRoles, router]);

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Checking access...</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const role = session.user?.role as Role | undefined;
  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Redirecting...</span>
      </div>
    );
  }

  return <>{children}</>;
}
