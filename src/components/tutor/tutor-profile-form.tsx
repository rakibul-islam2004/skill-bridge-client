"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tutorProfileSchema, TutorProfileValues } from "@/lib/validations/tutor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TutorProfileFormProps {
  initialData?: Partial<TutorProfileValues>;
}

export function TutorProfileForm({ initialData }: TutorProfileFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<TutorProfileValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      experience: initialData?.experience || 0,
      experienceDetails: initialData?.experienceDetails || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TutorProfileValues) => {
      const { data } = await api.post("/tutor/setup", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Professional profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update profile");
    },
  });

  function onSubmit(values: TutorProfileValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormDescription>
                How many years have you been teaching or working in this field?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Background</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your qualifications, certifications, and teaching style..."
                  className="min-h-[150px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Professional Details
        </Button>
      </form>
    </Form>
  );
}
