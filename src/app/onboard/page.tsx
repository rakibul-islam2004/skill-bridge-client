"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authClient, Session } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap, Presentation, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OnboardError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface OnboardButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

export default function OnboardPage() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { data: rawSession, isPending: isSessionPending } = authClient.useSession();
  const session = rawSession as Session | null;

  const handleSelection = useCallback(async (role: "STUDENT" | "TUTOR") => {
    setIsPending(true);
    try {
      await api.post("/profile/onboard", { role });
      await authClient.getSession(); 
      
      toast.success(`Welcome!`);
      router.refresh();
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as OnboardError;
      const errorMessage = err.response?.data?.message || err.message || "Onboarding failed.";
      
      toast.error(errorMessage);
      setIsPending(false);
    }
  }, [router]);

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
          <OnboardButton
            icon={<GraduationCap className="h-10 w-10 text-primary" />}
            title="Student"
            description="I want to learn"
            onClick={() => handleSelection("STUDENT")}
            disabled={isPending}
          />
          <OnboardButton
            icon={<Presentation className="h-10 w-10 text-primary" />}
            title="Tutor"
            description="I want to teach"
            onClick={() => handleSelection("TUTOR")}
            disabled={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function OnboardButton({ icon, title, description, onClick, disabled }: OnboardButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-44 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="p-4 bg-primary/10 rounded-full">{icon}</div>
      <div className="flex flex-col text-center">
        <span className="text-xl font-bold">{title}</span>
        <span className="text-xs text-muted-foreground font-normal">{description}</span>
      </div>
    </Button>
  );
}
