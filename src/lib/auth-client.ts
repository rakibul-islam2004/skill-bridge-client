import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "https://skill-bridge-client-five.vercel.app"
  ); // Build side
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  basePath: "/api/v1/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export type User = typeof authClient.$Infer.Session.user & {
  role?: "STUDENT" | "TUTOR" | "ADMIN";
};

export type Session = typeof authClient.$Infer.Session & {
  user: User;
};

export const { signIn, signUp, useSession, signOut } = authClient;
