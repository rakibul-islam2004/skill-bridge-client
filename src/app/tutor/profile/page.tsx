"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, UserCircle, Tag, Banknote } from "lucide-react";
import { TutorProfileForm } from "@/components/tutor/tutor-profile-form";
import { CategorySelector } from "@/components/tutor/category-selector";
import { PricingManager } from "@/components/tutor/pricing-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TutorProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const { data } = await api.get("/profile/me");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const initialSelectedCategories = profile?.tutorCategories?.map((tc: any) => tc.categoryId) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Professional Profile</h1>
        <p className="text-muted-foreground mt-2">
          Set up your teaching identity, expertise, and pricing to attract students.
        </p>
      </div>

      <Tabs defaultValue="professional" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Professional</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Expertise</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professional">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <TutorProfileForm 
              initialData={{
                experience: profile?.experience,
                experienceDetails: profile?.experienceDetails
              }} 
            />
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <CategorySelector initialSelectedIds={initialSelectedCategories} />
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <PricingManager initialPricing={profile?.pricings || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
