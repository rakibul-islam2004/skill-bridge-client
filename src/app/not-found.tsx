"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8 text-black dark:text-white">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl flex items-center justify-center animate-pulse" />
        <div className="relative rounded-full bg-background border-4 border-primary/20 p-8">
          <Search className="h-16 w-16 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 rounded-lg bg-primary px-3 py-1.5 text-4xl font-black text-primary-foreground shadow-lg">
          404
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex-1 h-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button asChild className="flex-1 h-12 shadow-lg hover:shadow-primary/20 transition-all">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home Page
          </Link>
        </Button>
      </div>

      <div className="mt-16 text-sm text-muted-foreground">
        <p>Lost? Check out our <Link href="/tutors" className="text-primary hover:underline font-medium">Tutor Catalog</Link></p>
      </div>
    </div>
  );
}
