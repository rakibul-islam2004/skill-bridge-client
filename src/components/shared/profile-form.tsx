"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileUpdateSchema } from "@/lib/validations/profile";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileFormProps {
  initialData: {
    name: string;
    bio?: string;
    image?: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: initialData.name,
      bio: initialData.bio || "",
      image: initialData.image || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initialData.name,
      bio: initialData.bio || "",
      image: initialData.image || "",
    });
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof profileUpdateSchema>) => {
    try {
      await api.patch("/profile/me", values);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const imageUrl = form.watch("image");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={imageUrl} />
            <AvatarFallback className="text-xl">
              {form.getValues("name")?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/photo.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
