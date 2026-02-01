"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Search,
  ArrowRight,
  Users,
  GraduationCap,
  Star,
  BookOpen,
  Clock,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorCard } from "@/components/public/tutor-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(search)}`);
    } else {
      router.push("/tutors");
    }
  };

  const { data: featuredResponse, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured-tutors-only"],
    queryFn: async () => {
      const { data } = await api.get("/booking/featured-tutors-only");
      return data;
    },
  });

  const { data: topRatedResponse, isLoading: loadingTopRated } = useQuery({
    queryKey: ["top-rated-tutors"],
    queryFn: async () => {
      const { data } = await api.get("/booking/top-rated-tutors");
      return data;
    },
  });

  const featuredTutors = featuredResponse?.data || [];
  const topRatedTutors = topRatedResponse?.data || [];

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/category");
      return data;
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 rounded-full border-primary/30 bg-primary/10 text-primary font-bold"
            >
              Join 10,000+ students learning daily
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Learn from the best,
              <br />
              <span className="text-primary">achieve your goals</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect with expert tutors for personalized 1-on-1 sessions.
              Master any skill with guidance from verified professionals.
            </p>
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-card border shadow-lg p-2 sm:py-2 sm:pr-2 sm:pl-5">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground sm:block hidden" />
                <Input
                  type="text"
                  placeholder="Search tutors, subjects, or skills..."
                  className="border-0 bg-transparent focus-visible:ring-0 h-12 pl-10 sm:pl-12 flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" size="lg" className="rounded-xl font-semibold">
                  Search
                </Button>
              </div>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Students", value: "10K+", icon: Users },
                { label: "Tutors", value: "500+", icon: GraduationCap },
                { label: "Sessions", value: "25K+", icon: BookOpen },
                { label: "Rating", value: "4.9★", icon: Star },
              ].map((stat, i) => (
                <Card key={i} className="p-4 text-center border-primary/10">
                  <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <span className="font-bold text-xl block">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why SkillBridge */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">
              Why choose us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Built for learners and tutors
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A trusted platform that puts quality teaching and flexible learning first.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified tutors",
                desc: "Every tutor is reviewed so you learn from qualified experts.",
              },
              {
                icon: Clock,
                title: "Flexible booking",
                desc: "Pick a time that works. Reschedule when life gets in the way.",
              },
              {
                icon: CreditCard,
                title: "Secure payments",
                desc: "Pay safely. Your sessions are protected and transparent.",
              },
              {
                icon: Target,
                title: "1-on-1 focus",
                desc: "Personalized sessions tailored to your pace and goals.",
              },
            ].map((item, i) => (
              <Card key={i} className="border-primary/5 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 scroll-mt-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get started in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Find your tutor",
                desc: "Browse experts by subject, rating, and price. Read reviews and pick the right fit.",
                icon: Search,
              },
              {
                step: "2",
                title: "Book a session",
                desc: "Choose a time slot and confirm. You’ll get a meeting link before the session.",
                icon: Clock,
              },
              {
                step: "3",
                title: "Start learning",
                desc: "Join via video call and learn at your pace. Leave a review after your session.",
                icon: TrendingUp,
              },
            ].map((step, i) => (
              <Card key={i} className="relative overflow-visible border-primary/10">
                <div className="absolute -top-3 left-6 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <CardHeader className="pt-8">
                  <step.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Tutors */}
      {featuredTutors.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <Badge className="mb-2 bg-amber-500/90 text-black hover:bg-amber-500">
                  Featured
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight">
                  Featured tutors
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Hand-picked experts recommended by our team.
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-fit rounded-full" asChild>
                <Link href="/tutors">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingFeatured ? (
                [1, 2, 3].map((i) => (
                  <Card key={i} className="h-[380px] animate-pulse" />
                ))
              ) : (
                featuredTutors.map((tutor: { id: string }) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Tutors */}
      <section className="py-16">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Top rated tutors
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Highly-rated experts in their subjects.
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-fit rounded-full" asChild>
              <Link href="/tutors">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingTopRated ? (
              [1, 2, 3].map((i) => (
                <Card key={i} className="h-[380px] animate-pulse" />
              ))
            ) : topRatedTutors?.length > 0 ? (
              topRatedTutors.map((tutor: { id: string }) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))
            ) : (
              <Card className="col-span-full py-16 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No tutors yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Be the first to join as a tutor.
                </p>
                <Button asChild>
                  <Link href="/register">Become a tutor</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Popular categories
            </h2>
            <p className="text-muted-foreground text-sm">
              Explore subjects and find your tutor.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {categories?.slice(0, 6).map((cat: { id: string; name: string }) => (
              <Link
                key={cat.id}
                href={`/tutors?category=${cat.id}`}
                className="group"
              >
                <Card className="p-6 text-center border-primary/5 hover:border-primary/30 hover:shadow-md transition-all h-full">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{cat.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - guests only */}
      {!session && (
        <section className="py-16">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent)]" />
              <CardContent className="relative py-14 px-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-primary-foreground/90 max-w-xl mx-auto mb-8">
                  Join thousands of students. Sign up and book your first session.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full font-semibold"
                    asChild
                  >
                    <Link href="/register">Get started free</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full font-semibold border-white/30 bg-white/10 hover:bg-white/20 text-white"
                    asChild
                  >
                    <Link href="/tutors">Browse tutors</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
