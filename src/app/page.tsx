"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  GraduationCap,
  Star,
  BookOpen,
  Clock,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorCard } from "@/components/public/tutor-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full border-primary/30 bg-primary/10 text-primary font-bold">
              🎓 Join 10,000+ Students Learning Daily
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Learn From The Best,
              <br />
              <span className="text-primary">Achieve Your Goals</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect with expert tutors for personalized 1-on-1 sessions. Master any skill with guidance from professionals.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-colors">
                <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for tutors, subjects, or skills..." 
                  className="border-none focus-visible:ring-0 text-base h-16 pl-14 pr-4 rounded-full bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button size="lg" className="h-12 px-8 rounded-full mr-2 font-bold">
                  Search
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Students", value: "10K+", icon: Users },
                { label: "Tutors", value: "500+", icon: GraduationCap },
                { label: "Sessions", value: "25K+", icon: BookOpen },
                { label: "Rating", value: "4.9★", icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm">
                  <stat.icon className="h-6 w-6 text-primary mb-2" />
                  <span className="font-black text-2xl">{stat.value}</span>
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Find Your Tutor",
                desc: "Browse our expert tutors and find the perfect match for your learning goals.",
                icon: Search
              },
              {
                step: "2",
                title: "Book a Session",
                desc: "Choose a convenient time slot and book your personalized 1-on-1 session.",
                icon: Clock
              },
              {
                step: "3",
                title: "Start Learning",
                desc: "Join your session via video call and start achieving your goals.",
                icon: TrendingUp
              }
            ].map((step, i) => (
              <div key={i} className="relative p-8 bg-white dark:bg-zinc-900 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-4 left-8 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {step.step}
                </div>
                <div className="mt-6">
                  <step.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors - Only show if there are featured tutors */}
      {featuredTutors.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge className="mb-3 bg-yellow-400 text-black hover:bg-yellow-500">
                  ⭐ Featured
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-black mb-2">Featured Tutors</h2>
                <p className="text-muted-foreground">Hand-picked experts recommended by our team</p>
              </div>
              <Button variant="outline" className="rounded-full font-bold" asChild>
                <Link href="/tutors">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingFeatured ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-[400px] rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))
              ) : (
                featuredTutors.map((tutor: any) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Top Tutors - Always shown */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2">Top Rated Tutors</h2>
              <p className="text-muted-foreground">Learn from highly-rated experts in their fields</p>
            </div>
            <Button variant="outline" className="rounded-full font-bold" asChild>
              <Link href="/tutors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingTopRated ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))
            ) : topRatedTutors?.length > 0 ? (
              topRatedTutors.map((tutor: any) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-bold mb-2">No Tutors Available Yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to join as a tutor!</p>
                <Button asChild>
                  <Link href="/register">Become a Tutor</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Popular Categories</h2>
            <p className="text-muted-foreground">Explore subjects and find your perfect tutor</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {categories?.slice(0, 6).map((cat: any) => (
              <Link 
                key={cat.id}
                href={`/tutors?category=${cat.id}`}
                className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <BookOpen className="h-6 w-6 text-primary group-hover:text-white" />
                </div>
                <span className="font-bold text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - only for guests */}
      {!session && (
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-16 sm:py-20 rounded-3xl text-center text-white">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black mb-6">Ready to Start Learning?</h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                  Join thousands of students achieving their goals. Sign up today and book your first session.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full font-bold text-base" asChild>
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full font-bold text-base border-white/20 bg-white/10 hover:bg-white/20 text-white" asChild>
                    <Link href="/tutors">Browse Tutors</Link>
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
