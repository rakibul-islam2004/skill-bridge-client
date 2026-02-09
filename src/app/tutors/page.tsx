"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSearchParams, usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { Search, Frown, Loader2, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TutorCard } from "@/components/public/tutor-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function DiscoveryContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Added for environment stability

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || "all",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  const { data: tutors, isLoading: loadingTutors } = useQuery({
    queryKey: ["tutors-list", search, categoryId, minPrice, maxPrice, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryId !== "all") params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortBy) params.append("sortBy", sortBy);
      const { data } = await api.get(`/booking/tutors?${params.toString()}`);
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

  const clearFilters = () => {
    setSearch("");
    setCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
  };

  // Reusable Filter UI for both Desktop and Mobile
  const FilterStack = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-black flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[10px] h-7 px-2 font-bold opacity-70 hover:opacity-100 hover:bg-primary/10"
        >
          Clear All
        </Button>
      </div>

      <Separator className="opacity-50" />

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">
          Sort By
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-zinc-950 border-none shadow-sm ring-1 ring-zinc-200 dark:ring-white/5">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">Highest Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">
          Category
        </label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-zinc-950 border-none shadow-sm ring-1 ring-zinc-200 dark:ring-white/5">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {categories?.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">
          Price Range (৳)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Min"
            type="number"
            className="h-12 rounded-xl border-none shadow-sm bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-white/5"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max"
            type="number"
            className="h-12 rounded-xl border-none shadow-sm bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-white/5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header & Search */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                Find Your <span className="text-primary italic">Expert</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium">
                Explore {tutors?.length || 0} world-class tutors ready to help
                you.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl gap-2 border-zinc-200 dark:border-white/10 h-12 shadow-sm font-bold"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Filter & Sort
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[80vh] rounded-t-[2.5rem] bg-white dark:bg-zinc-950 border-t-primary/20"
                >
                  <SheetHeader className="pb-6">
                    <SheetTitle className="text-2xl font-black">
                      Search Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterStack />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="w-full max-w-2xl group relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or keyword..."
              className="h-12 sm:h-16 pl-12 rounded-2xl sm:rounded-[1.5rem] shadow-sm border-none ring-1 ring-zinc-200 dark:ring-white/10 focus-visible:ring-primary/40 bg-white dark:bg-zinc-900/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <aside className="hidden lg:block w-72 space-y-8 bg-white dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 h-fit sticky top-24 shadow-sm">
            <FilterStack />
          </aside>

          {/* Tutor Grid */}
          <main className="flex-1">
            {loadingTutors ? (
              <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
              </div>
            ) : tutors?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {tutors.map((tutor: any) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 sm:py-40 text-center rounded-[2.5rem] sm:rounded-[4rem] border-4 border-dashed border-zinc-100 dark:border-zinc-900 px-6">
                <Frown className="h-16 w-16 text-zinc-200 dark:text-zinc-800 mb-6" />
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  No Tutors Found
                </h3>
                <p className="text-zinc-500 mt-2 max-w-xs mx-auto text-sm font-medium">
                  Try broadening your search or adjusting the price filters.
                </p>
                <Button
                  variant="link"
                  className="mt-6 text-primary font-black uppercase tracking-widest text-xs"
                  onClick={clearFilters}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
      }
    >
      <DiscoveryContent />
    </Suspense>
  );
}
