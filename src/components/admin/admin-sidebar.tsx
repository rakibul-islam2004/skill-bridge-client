"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Tag,
  Settings,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "System overview and analytics",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage all user accounts",
  },
  {
    title: "Tutors",
    href: "/admin/tutors",
    icon: GraduationCap,
    description: "Manage tutor profiles",
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: BookOpen,
    description: "View all system bookings",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
    description: "Manage tutorial categories",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration",
  },
];

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <Card className={cn("h-full w-80 border-l", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Management Console</p>
          </div>
        </div>

        <Separator className="mb-6" />

        <nav className="space-y-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-accent-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mt-0.5 h-5 w-5 flex-shrink-0",
                  pathname === item.href
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground",
                )}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "font-medium",
                    pathname === item.href ? "text-primary-foreground" : "",
                  )}
                >
                  {item.title}
                </div>
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    pathname === item.href
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        <Separator className="mt-8 mb-4" />

        <div className="text-xs text-muted-foreground text-center">
          SkillBridge Admin v1.0
        </div>
      </CardContent>
    </Card>
  );
}
