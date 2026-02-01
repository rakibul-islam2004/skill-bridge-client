"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Zap, 
  Compass,
  CalendarCheck,
  Crown,
  GraduationCap,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorCard } from "@/components/public/tutor-card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(search)}`);
    }
  };

  const { data: featuredTutors, isLoading: loadingTutors } = useQuery({
    queryKey: ["featured-tutors"],
    queryFn: async () => {
      const { data } = await api.get("/booking/featured-tutors");
      return data;
    },
  });

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
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Modern Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
          <div className="absolute top-[200px] right-[-100px] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] opacity-30" />
        </div>

        <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px] animate-fade-in shadow-sm">
              🚀 Empowering 10,000+ Students Daily
            </Badge>
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-zinc-900 dark:text-zinc-50">
              Where <span className="text-primary italic relative inline-block">Knowledge
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span> Meets <br className="hidden sm:block" /> Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Ambition</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Connect with world-class experts for personalized, 1-on-1 sessions. From coding to calculus, bridge the gap between where you are and where you want to be.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-white dark:bg-zinc-900 p-2 rounded-[2rem] shadow-2xl border border-primary/10">
                <Search className="ml-6 h-6 w-6 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="What do you want to learn today?" 
                  className="border-none focus-visible:ring-0 text-lg h-14 bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button size="lg" className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Search Tutors
                </Button>
              </div>
            </form>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mx-auto border-t border-primary/10 pt-12">
              {[
                { label: "Active Students", value: "10k+", icon: Users },
                { label: "Expert Tutors", value: "500+", icon: GraduationCap },
                { label: "Sessions Done", value: "25k+", icon: CheckCircle2 },
                { label: "Average Rating", value: "4.9/5", icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group/stat">
                   <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-3 group-hover/stat:bg-primary group-hover/stat:text-white transition-all duration-300">
                     <stat.icon className="h-6 w-6" />
                   </div>
                   <span className="font-black text-3xl tabular-nums">{stat.value}</span>
                   <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">The <span className="text-primary italic">SkillBridge</span> Way</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "Find Your Expert", 
                desc: "Browse our curated list of top-tier tutors across 50+ subjects.",
                icon: Search 
              },
              { 
                step: "02", 
                title: "Book with Ease", 
                desc: "Choose a duration and slot that fits your schedule perfectly.",
                icon: CalendarCheck 
              },
              { 
                step: "03", 
                title: "Start Learning", 
                desc: "Join your personalized 1-on-1 session via our built-in video link.",
                icon: Zap 
              },
            ].map((step, i) => (
              <div key={i} className="relative p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-primary/5 hover:border-primary/20 transition-all group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-primary text-white font-black flex items-center justify-center shadow-xl">
                  {step.step}
                </span>
                <div className="mt-4 flex flex-col items-center">
                   <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <step.icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-black mb-3">{step.title}</h3>
                   <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/10">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-600 text-[10px] font-black mb-4 uppercase tracking-widest">
                <Crown className="h-3 w-3 fill-yellow-400" />
                Featured Talent
              </div>
              <h2 className="text-5xl font-black">Meet our <span className="text-primary">Experts</span></h2>
              <p className="mt-4 text-muted-foreground max-w-md">The most highly rated and active tutors on SkillBridge this week.</p>
            </div>
            <Button size="lg" variant="outline" className="rounded-[1.5rem] h-14 px-8 font-black gap-2 border-2" asChild>
              <Link href="/tutors">
                Explore All Tutors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loadingTutors ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              ))
            ) : featuredTutors?.length > 0 ? (
              featuredTutors.map((tutor: any) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed rounded-[4rem] opacity-50 bg-white shadow-inner">
                <Users className="h-16 w-16 mx-auto mb-6 text-primary/20" />
                <h3 className="text-2xl font-black">No featured tutors yet</h3>
                <p className="text-muted-foreground mt-2">Check back soon for our weekly top picks!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-12">Learn <span className="text-blue-500 underline decoration-primary decoration-4 underline-offset-8">Anything</span></h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories?.slice(0, 6).map((cat: any) => (
              <Link 
                key={cat.id}
                href={`/tutors?category=${cat.id}`}
                className="group flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-3xl border transition-all hover:border-primary hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Compass className="h-7 w-7" />
                </div>
                <span className="font-bold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-primary px-8 py-16 rounded-[2rem] text-center text-white">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Ready to Start Learning?</h2>
            <p className="mt-6 text-xl text-primary-foreground/90 max-w-xl mx-auto">
              Join thousands of students accelerating their careers. Sign up today and get your first session booked.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-8 rounded-xl font-bold text-md w-full sm:w-auto" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
              <Button size="lg" className="h-14 px-8 rounded-xl font-bold text-md border-2 border-white/20 bg-white/10 hover:bg-white/20 w-full sm:w-auto" asChild>
                <Link href="/tutors">Browse Tutors First</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
