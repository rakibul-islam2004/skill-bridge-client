"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authClient, User, Session } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GraduationCap, Presentation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function OnboardPage() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { data: rawSession, isPending: isSessionPending } = authClient.useSession();
  
  const session = rawSession as Session | null;


  useEffect(() => {
    if (!isSessionPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user?.role) {
        router.push("/dashboard");
      }
    }
  }, [session, isSessionPending, router]);

  const handleSelection = async (role: "STUDENT" | "TUTOR") => {
    setIsPending(true);
    try {
      await api.post("/profile/onboard", { role });
      toast.success(`Welcome! Profile created as a ${role.toLowerCase()}.`);
      

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Onboarding failed. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  };


  if (isSessionPending || session?.user?.role) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-muted/30 px-4">
      <Card className="w-full max-w-lg shadow-xl border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Pick Your Path</CardTitle>
          <CardDescription className="text-base mt-2">
            Are you here to learn or to share your expertise?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          <Button
            variant="outline"
            className="h-44 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all text-center"
            onClick={() => handleSelection("STUDENT")}
            disabled={isPending}
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">Student</span>
              <span className="text-xs text-muted-foreground font-normal">
                I want to learn
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-44 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all text-center"
            onClick={() => handleSelection("TUTOR")}
            disabled={isPending}
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <Presentation className="h-10 w-10 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">Tutor</span>
              <span className="text-xs text-muted-foreground font-normal">
                I want to teach
              </span>
            </div>
          </Button>
        </CardContent>
        {isPending && (
          <div className="flex justify-center pb-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </Card>
    </div>
  );
}
