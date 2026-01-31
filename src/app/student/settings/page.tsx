"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/shared/profile-form";
import { SecurityForm } from "@/components/shared/security-form";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function StudentSettingsPage() {
  const { data: sessionData } = authClient.useSession();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const { data } = await api.get("/profile/me");
      return data;
    },
  });

  if (isLoading || !sessionData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Update your profile and security settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <ProfileForm 
              initialData={{ 
                name: sessionData.user.name, 
                bio: profile?.bio,
                image: sessionData.user.image || ""
              }} 
            />
          </div>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <SecurityForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
