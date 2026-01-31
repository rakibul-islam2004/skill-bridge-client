"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";
import { useState, useEffect } from "react";

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
      toast.success("Categories updated!");
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Tag className="h-5 w-5" />
        <h3 className="font-semibold">Select Your Expertise</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Checkbox
              id={category.id}
              checked={selectedIds.includes(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
            >
              {category.name}
            </Label>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={mutation.isPending || (JSON.stringify(selectedIds) === JSON.stringify(initialSelectedIds))}
      >
        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Categories
      </Button>
    </div>
  );
}
