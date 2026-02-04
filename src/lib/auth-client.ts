import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://skill-bridge-client-five.vercel.app", // Fallback to production URL
  basePath: "/api/v1/auth",
  fetchOptions: {
    credentials: "include",
  },
});

// 1. Export the User type so it can be imported in other files
export type User = typeof authClient.$Infer.Session.user & {
  role?: "STUDENT" | "TUTOR" | "ADMIN";
};

// 2. Export the Session type using the User type above
export type Session = typeof authClient.$Infer.Session & {
  user: User;
};

export const { signIn, signUp, useSession, signOut } = authClient;
