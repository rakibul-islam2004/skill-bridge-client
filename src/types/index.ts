export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string | null;
  experience: number | null;
  ratingAvg: number | null;
  user: User;
  tutorCategories: {
    category: {
      name: string;
    };
  }[];
}
