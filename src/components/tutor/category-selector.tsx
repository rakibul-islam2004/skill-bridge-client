"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  initialSelectedIds?: string[];
}

export function CategorySelector({ initialSelectedIds = [] }: CategorySelectorProps) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  useEffect(() => {
    setSelectedIds(initialSelectedIds);
  }, [initialSelectedIds]);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/category");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { data } = await api.post("/tutor/setup", { categoryIds: ids });
      return data;
    },
    onSuccess: () => {
      toast.success("Categories updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update categories");
    },
  });

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    mutation.mutate(selectedIds);
  };

  const hasChanges = JSON.stringify([...selectedIds].sort()) !== JSON.stringify([...initialSelectedIds].sort());

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Tag className="h-5 w-5" />
          <h3 className="text-xl font-black">Choose Your Subjects</h3>
        </div>
        <p className="text-sm text-muted-foreground">Select the categories you are most qualified to teach. You can change these anytime.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => {
          const isSelected = selectedIds.includes(category.id);
          return (
            <Card 
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`cursor-pointer transition-all duration-300 rounded-[1.5rem] border-2 group ${
                isSelected 
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                  : "border-zinc-100 dark:border-zinc-800 hover:border-primary/20 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-primary"
                  }`}>
                    <Tag className="h-5 w-5" />
                  </div>
                  <span className={`font-bold transition-colors ${isSelected ? "text-primary" : "text-zinc-600 dark:text-zinc-400 group-hover:text-primary"}`}>
                    {category.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-4 flex items-center gap-4">
        <Button
          size="lg"
          className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          onClick={handleSave}
          disabled={mutation.isPending || !hasChanges}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Tag className="mr-2 h-5 w-5" />
          )}
          {mutation.isPending ? "Updating..." : "Save Selection"}
        </Button>
        {hasChanges && (
          <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Unsaved Changes</p>
        )}
      </div>
    </div>
  );
}
