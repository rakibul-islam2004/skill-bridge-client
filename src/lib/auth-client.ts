import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  // 1. Browser Check: Use the current domain (perfect for proxy/rewrites)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 2. SSR/Build Check: Better Auth REQUIRES a full URL here
  const envUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

  // If env is missing or is just "/", use the production fallback
  if (!envUrl || envUrl === "/") {
    return "https://skill-bridge-client-five.vercel.app";
  }

  return envUrl;
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
