"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Users,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Ban,
  UserCheck,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isBanned: boolean;
  image: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data } = await api.get<any[]>("/admin/users");
      // Map backend response to handle different profile structures
      return data.map((user) => {
        let isBanned = false;
        if (user.role === "TUTOR") {
          isBanned = user.tutorProfile?.isActive === false;
        } else if (user.role === "ADMIN") {
          isBanned = user.adminProfile?.isActive === false;
        }
        return {
          ...user,
          isBanned
        };
      }) as AdminUser[];
    },
  });

  const toggleBanMutation = useMutation({
    mutationFn: async ({ userId, role, isBanned }: { userId: string; role: string; isBanned: boolean }) => {
      // If currently isBanned, we want to unban (isActive: true)
      // If currently not isBanned, we want to ban (isActive: false)
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: isBanned,
        role
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      toast.success("User status updated.");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to update user status.");
    },
  });

  const filteredUsers = users?.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesSearch = nameMatch || emailMatch;
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered students and tutors.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="relative">
                <select
                  className="flex h-10 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="TUTOR">Tutors</option>
                  <option value="ADMIN">Admins</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 fill-current text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-destructive">
              <p>Failed to load users.</p>
              <p className="text-sm">{(error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Try again later."}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No users found matching your search criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 text-xs">
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {user.name?.slice(0, 2).toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isBanned ? "destructive" : "secondary"} className="font-normal">
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={user.isBanned ? "text-green-600 focus:text-green-600" : "text-destructive focus:text-destructive"}
                            disabled={toggleBanMutation.isPending || user.role === "STUDENT"}
                            onClick={() => toggleBanMutation.mutate({ 
                              userId: user.id, 
                              role: user.role,
                              isBanned: user.isBanned 
                            })}
                          >
                            {user.isBanned ? (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unban User
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </>
                            )}
                          </DropdownMenuItem>
                          {user.role === "STUDENT" && (
                            <div className="px-2 py-1.5 text-[10px] text-muted-foreground italic border-t mt-1">
                              Student status cannot be modified
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
