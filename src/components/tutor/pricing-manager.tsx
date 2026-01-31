"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tutorPricingSchema, TutorPricingValues } from "@/lib/validations/tutor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Banknote, Trash2, Plus } from "lucide-react";

interface PricingEntry {
  id: string;
  durationMinutes: number;
  price: string;
}

interface PricingManagerProps {
  initialPricing?: PricingEntry[];
}

export function PricingManager({ initialPricing = [] }: PricingManagerProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<TutorPricingValues>({
    resolver: zodResolver(tutorPricingSchema),
    defaultValues: {
      durationMinutes: 60,
      price: 500,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (values: TutorPricingValues) => {
      const { data } = await api.post("/tutor/setup", {
        pricings: [{ duration: values.durationMinutes, price: values.price }],
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Pricing tier added!");
      setIsAdding(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add pricing");
    },
  });

  function onSubmit(values: TutorPricingValues) {
    addMutation.mutate(values);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Banknote className="h-5 w-5" />
          <h3 className="font-semibold">Pricing Tiers (Taka ৳)</h3>
        </div>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {initialPricing.length === 0 && !isAdding && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
            No pricing tiers set. Add one to start accepting bookings.
          </div>
        )}

        {initialPricing.map((pricing) => (
          <div
            key={pricing.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-accent/5"
          >
            <div>
              <p className="font-bold text-lg">{pricing.durationMinutes} Minutes</p>
              <p className="text-primary text-xl font-black">৳{pricing.price}</p>
            </div>
            {/* Future: Add delete mutation here */}
          </div>
        ))}

        {isAdding && (
          <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 space-y-4">
            <h4 className="font-medium">New Pricing Tier</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Mins)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (৳)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Tier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
