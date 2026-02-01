"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  Star, 
  Loader2,
  TrendingUp,
  Clock
} from "lucide-react";
import { UpcomingSessions } from "@/components/tutor/upcoming-sessions";
import { RatingsView } from "@/components/tutor/ratings-view";

export default function TutorDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["tutor-dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/tutor/dashboard");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, upcomingSessions, recentReviews } = dashboard || {};

  const statCards = [
    { 
      title: "Total Sessions", 
      value: stats?.totalSessions || 0, 
      icon: <Users className="h-4 w-4 text-blue-500" />,
      bg: "bg-blue-500/5"
    },
    { 
      title: "Upcoming", 
      value: stats?.upcomingCount || 0, 
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      bg: "bg-purple-500/5"
    },
    { 
      title: "Balance", 
      value: `৳${stats?.totalEarnings || 0}`, 
      icon: <Wallet className="h-4 w-4 text-green-500" />, 
      bg: "bg-green-500/5"
    },
    { 
      title: "Rating", 
      value: stats?.ratingAvg?.toFixed(1) || "N/A", 
      icon: <Star className="h-4 w-4 text-yellow-500" />, 
      bg: "bg-yellow-500/5"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! You have <span className="text-primary font-bold">{stats?.upcomingCount || 0} sessions</span> scheduled for the coming days.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="group rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <TrendingUp className="h-3 w-3 text-muted-foreground opacity-20" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Upcoming Sessions</h2>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm min-h-[300px]">
            <UpcomingSessions sessions={upcomingSessions} />
          </div>
        </div>

        {/* Sidebar: Recent Reviews */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Recent Reviews</h2>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <RatingsView 
              reviews={recentReviews} 
              ratingAvg={stats?.ratingAvg} 
              reviewCount={stats?.reviewCount} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
