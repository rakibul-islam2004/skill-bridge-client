"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  BookOpen,
  UserPlus,
  Shield,
} from "lucide-react";

const footerLinks = {
  explore: [
    { label: "Find Tutors", href: "/tutors" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Become a Tutor", href: "/register" },
  ],
  account: [
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/register" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 mx-auto py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-xl tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                SB
              </span>
              SkillBridge
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-[200px]">
              Connect with expert tutors. Learn at your pace, achieve your goals.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.explore.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Account
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.account.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} SkillBridge. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-primary" />
            Bridging learners with expert tutors.
          </p>
        </div>
      </div>
    </footer>
  );
}
