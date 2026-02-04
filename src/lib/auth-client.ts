import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  // Use the environment variable if it's a full URL (important for Build/SSR)
  const envUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }

  // Fallback for Browser: Use current origin to maintain proxy tunnel
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Hard fallback for Vercel Build Server (prevents ERR_INVALID_URL)
  return "https://skill-bridge-client-five.vercel.app";
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
