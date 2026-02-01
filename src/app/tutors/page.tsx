"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Frown, 
  Loader2,
  SlidersHorizontal,
  LayoutGrid
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TutorCard } from "@/components/public/tutor-card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function DiscoveryContent() {
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category") || "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  const { data: tutors, isLoading: loadingTutors, error } = useQuery({
    queryKey: ["tutors-list", search, categoryId, minPrice, maxPrice, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryId !== "all") params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortBy) params.append("sortBy", sortBy);
      
      console.log("[TutorsPage] Fetching tutors with params:", params.toString());
      const { data } = await api.get(`/booking/tutors?${params.toString()}`);
      console.log("[TutorsPage] Received tutors:", data?.length || 0);
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

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black">Find Your <span className="text-primary italic">Expert</span></h1>
            <p className="text-muted-foreground mt-2">Explore {tutors?.length || 0} world-class tutors ready to help you.</p>
          </div>
          <div className="flex-1 max-w-xl group relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Search by name or keyword..." 
              className="h-14 pl-12 rounded-2xl shadow-sm focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-primary/5 h-fit sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-black flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-[10px] h-7 px-2 font-bold opacity-70 hover:opacity-100"
              >
                Clear All
              </Button>
            </div>

            <Separator className="opacity-50" />

            {/* Sort Filter */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider opacity-60">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-black border-none shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider opacity-60">Category</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-black border-none shadow-sm">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider opacity-60">Price Range (৳)</label>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="Min" 
                  type="number" 
                  className="h-12 rounded-xl border-none shadow-sm bg-white dark:bg-black"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input 
                  placeholder="Max" 
                  type="number" 
                  className="h-12 rounded-xl border-none shadow-sm bg-white dark:bg-black"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <Separator className="opacity-50" />
            
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                Tutors set their own pricing tiers. Filter by your budget to find the best match.
              </p>
            </div>
          </aside>

          {/* Tutor Grid */}
          <main className="flex-1">
            {loadingTutors ? (
              <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              </div>
            ) : tutors?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor: any) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] border-2 border-dashed border-primary/10">
                <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Frown className="h-10 w-10 text-primary opacity-30" />
                </div>
                <h3 className="text-2xl font-black">No Tutors Found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  Try adjusting your filters or search terms to see more results.
                </p>
                <Button variant="link" className="mt-4" onClick={clearFilters}>
                  Clear all filters
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
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <DiscoveryContent />
    </Suspense>
  );
}
