"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manage Tutors",
    href: "/admin/tutors",
    icon: GraduationCap,
  },
  {
    title: "System Bookings",
    href: "/admin/bookings",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background border-r w-64 fixed left-0 top-16 z-30">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  pathname === item.href
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
