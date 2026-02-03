"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu, Sun, Moon, Monitor, User, LogOut, GraduationCap,
  LayoutDashboard, BookOpen, Settings, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient, Session } from "@/lib/auth-client";

export default function Navbar() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  const { data: rawData, isPending } = authClient.useSession();
  const session = rawData as Session | null;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { title: "Find Tutors", href: "/tutors", icon: <BookOpen className="w-5 h-5" />, show: true },
    { title: "My Bookings", href: "/student/bookings", icon: <GraduationCap className="w-5 h-5" />, show: session?.user?.role === "STUDENT" },
    { title: "Schedule", href: "/tutor/schedule", icon: <LayoutDashboard className="w-5 h-5" />, show: session?.user?.role === "TUTOR" },
    { title: "Admin Panel", href: "/admin", icon: <ShieldCheck className="w-5 h-5" />, show: session?.user?.role === "ADMIN" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (!mounted) {
    return <div className="h-16 border-b bg-background" />;
  }

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 transition-colors duration-300" aria-label="Main navigation">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md transition-all">SB</div>
            <span className="hidden sm:inline-block">SkillBridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter((link) => link.show).map((link) => (
              <Button key={link.href} variant="ghost" asChild size="sm">
                <Link href={link.href}>{link.title}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <ThemeToggler setTheme={setTheme} />

          {isPending ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <div className="hidden md:block">
              <UserAccountNav session={session} onSignOut={handleSignOut} />
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="sm" asChild><Link href="/login">Login</Link></Button>
              <Button size="sm" asChild className="bg-primary text-primary-foreground shadow-sm"><Link href="/register">Sign Up</Link></Button>
            </div>
          )}

          {/* MOBILE VERSION */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col p-0 h-full">
                <SheetHeader className="p-6 border-b text-left shrink-0">
                  <SheetTitle className="flex items-center gap-2 font-bold">
                    <div className="bg-primary text-primary-foreground p-1 rounded">SB</div>
                    SkillBridge
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-2">
                  {navLinks.filter((link) => link.show).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-base font-medium transition-colors hover:bg-accent rounded-none"
                    >
                      <span className="text-muted-foreground">{link.icon}</span>
                      {link.title}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto border-t bg-muted/20 p-6 shrink-0">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-1">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarImage src={session.user.image || ""} />
                          <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold truncate">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{session.user.role?.toLowerCase()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" asChild size="sm" onClick={() => setIsOpen(false)} className="justify-start">
                          <Link href="/settings"><User className="mr-2 h-4 w-4" /> Profile</Link>
                        </Button>
                        <Button variant="destructive" size="sm" className="justify-start shadow-none" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full shadow-sm" onClick={() => setIsOpen(false)}><Link href="/register">Sign Up</Link></Button>
                      <Button variant="outline" asChild className="w-full" onClick={() => setIsOpen(false)}><Link href="/login">Login</Link></Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggler({ setTheme }: { setTheme: (t: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 focus-visible:ring-0">
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" /> Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" /> Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}><Monitor className="mr-2 h-4 w-4" /> System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAccountNav({ session, onSignOut }: { session: Session, onSignOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Open account menu"
        >
          <Avatar className="h-9 w-9 cursor-pointer border hover:ring-2 hover:ring-primary/20 transition-all">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard" className="w-full flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="w-full flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer" 
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
