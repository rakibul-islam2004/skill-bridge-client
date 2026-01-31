import * as z from "zod";

export const tutorProfileSchema = z.object({
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
  experienceDetails: z.string().min(10, "Please provide more detail about your experience (min 10 characters)"),
});

export type TutorProfileValues = z.infer<typeof tutorProfileSchema>;

export const tutorPricingSchema = z.object({
  durationMinutes: z.coerce.number().min(15, "Minimum duration is 15 minutes"),
  price: z.coerce.number().min(1, "Price must be at least 1 Taka"),
});

export type TutorPricingValues = z.infer<typeof tutorPricingSchema>;
