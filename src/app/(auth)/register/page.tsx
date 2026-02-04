"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { authClient, User, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      const user = session.user as User;
      const role = user?.role;
      if (role === "ADMIN") router.push("/admin/dashboard");
      else if (role === "TUTOR") router.push("/tutor/dashboard");
      else if (role === "STUDENT") router.push("/student/dashboard");
      else router.push("/onboard");
    }
  }, [session, router]);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "")}/onboard`,
      },
      {
        onSuccess: async () => {
          toast.success("Account created! Choose your role.");
          const { data: session } = await authClient.getSession();
          const user = session?.user as (User & { role?: string }) | undefined;
          const role = user?.role;
          
          if (role) {
            if (role === "ADMIN") router.push("/admin/dashboard");
            else if (role === "TUTOR") router.push("/tutor/dashboard");
            else router.push("/student/dashboard");
          } else {
            router.push("/onboard");
          }
          
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)] px-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11"
                disabled={form.formState.isSubmitting}
                aria-busy={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    <span className="sr-only">Creating account...</span>
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative py-2 text-center text-xs text-muted-foreground uppercase">
            <span className="bg-background px-2 relative z-10">
              Or register with
            </span>
            <hr className="absolute top-1/2 w-full border-t" />
          </div>

          <Button
            variant="outline"
            className="w-full h-11 gap-2"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "")}/dashboard`,
              })
            }
          >
            <FcGoogle className="h-5 w-5" />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Already joined?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
