"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  GraduationCap,
  Loader2,
  Star,
  BadgeCheck,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface TutorProfile {
  id: string;
  isActive: boolean;
  isFeatured?: boolean;
  ratingAvg?: number | null;
  createdAt?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  tutorProfile: TutorProfile | null;
}

export default function AdminTutorsPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>("/admin/users");
      return data;
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({
      tutorId,
      isFeatured,
    }: {
      tutorId: string;
      isFeatured: boolean;
    }) => {
      await api.patch(`/admin/tutors/${tutorId}/featured`, { isFeatured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Featured status updated.");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to update featured status.");
    },
  });

  const tutors = users?.filter((u) => u.tutorProfile != null) ?? [];
  const togglingTutorId =
    toggleFeaturedMutation.isPending && toggleFeaturedMutation.variables
      ? toggleFeaturedMutation.variables.tutorId
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Tutors</h1>
        <p className="text-muted-foreground mt-1">
          View tutors and feature them on the landing page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            All tutors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">
              Failed to load tutors.{(error as { message?: string })?.message ?? " Try again later."}
            </p>
          ) : tutors.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No tutors yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutors.map((user) => {
                  const profile = user.tutorProfile!;
                  const isFeatured = profile.isFeatured === true;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {user.name?.slice(0, 2).toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                          <span className="font-medium">
                            {profile.ratingAvg != null ? profile.ratingAvg.toFixed(1) : "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BadgeUI
                          variant={profile.isActive !== false ? "default" : "destructive"}
                        >
                          {profile.isActive !== false ? "Active" : "Inactive"}
                        </BadgeUI>
                      </TableCell>
                      <TableCell>
                        {isFeatured ? (
                          <BadgeUI variant="secondary" className="gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            Featured
                          </BadgeUI>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={togglingTutorId !== null}
                          onClick={() =>
                            toggleFeaturedMutation.mutate({
                              tutorId: profile.id,
                              isFeatured: !isFeatured,
                            })
                          }
                        >
                          {togglingTutorId === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isFeatured ? (
                            "Unfeature"
                          ) : (
                            "Feature"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
