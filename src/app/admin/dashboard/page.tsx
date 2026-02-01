"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Users, GraduationCap, BookOpen, Loader2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  activeTutors: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>("/admin/stats");
      return data;
    },
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      className: "text-blue-500",
    },
    {
      title: "Active Tutors",
      value: stats?.activeTutors ?? "—",
      icon: GraduationCap,
      className: "text-green-500",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? "—",
      icon: BookOpen,
      className: "text-purple-500",
    },
    {
      title: "System Revenue",
      value: "৳—",
      icon: Wallet,
      className: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground">
          System-wide overview and administrative controls for SkillBridge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          statCards.map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center bg-muted ${stat.className}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="min-h-[300px] flex items-center justify-center">
        <CardContent className="py-12 text-center text-muted-foreground">
          <p className="font-medium">Manage users, bookings, and categories from the sidebar.</p>
          <p className="text-sm mt-1">Pages for Users, Bookings, and Categories coming next.</p>
        </CardContent>
      </Card>
    </div>
  );
}
