"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

export function AvailabilityManager() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00"
  });

  // 1. Fetch Schedule Info
  const { data: tutorProfile, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const { data } = await api.get("/profile/me");
      return data;
    },
  });

  // 2. Mutations
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const start = new Date(`${payload.date}T${payload.startTime}`);
      const end = new Date(`${payload.date}T${payload.endTime}`);
      return await api.post("/tutor/setup", {
        availabilitySlots: [{ start, end }]
      });
    },
    onSuccess: () => {
      toast.success("Availability slot added!");
      setIsAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add slot");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/tutor/availability/${id}`);
    },
    onSuccess: () => {
      toast.success("Slot removed");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: () => toast.error("Failed to remove slot")
  });

  // 3. Helpers
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const slotsForSelected = tutorProfile?.availabilities?.filter((s: Slot) => 
    isSameDay(new Date(s.startTime), selectedDate)
  ) || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Week Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-primary/10">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[150px]">
            <h3 className="font-bold text-lg">{format(weekStart, "PPP")}</h3>
            <p className="text-xs text-muted-foreground">Select a day to manage slots</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-primary/20 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Teaching Slot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={newSlot.date} 
                  onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => addMutation.mutate(newSlot)} disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const active = isSameDay(day, selectedDate);
          const hasSlots = tutorProfile?.availabilities?.some((s: Slot) => isSameDay(new Date(s.startTime), day));
          
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`
                flex flex-col items-center p-2 rounded-lg border transition-all
                ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent/50 border-border"}
                ${isToday(day) && !active ? "border-primary/50 text-primary" : ""}
              `}
            >
              <span className="text-[10px] uppercase font-bold opacity-70">{format(day, "eee")}</span>
              <span className="text-lg font-black">{format(day, "d")}</span>
              {hasSlots && (
                <div className={`w-1 h-1 rounded-full mt-1 ${active ? "bg-primary-foreground" : "bg-primary"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Selected Day Slots Area */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="font-bold">{format(selectedDate, "EEEE, MMMM do")}</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {slotsForSelected.length} Slots Available
          </span>
        </div>
        <CardContent className="p-6">
          {slotsForSelected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <div className="p-4 bg-muted rounded-full">
                <Clock className="h-8 w-8 opacity-20" />
              </div>
              <p>No availability slots set for this day.</p>
              <Button variant="outline" size="sm" onClick={() => setIsAddOpen(true)}>
                Add one now
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slotsForSelected.map((slot: Slot) => (
                <div 
                  key={slot.id} 
                  className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/30 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {format(new Date(slot.startTime), "p")} - {format(new Date(slot.endTime), "p")}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Teaching Slot</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-all"
                    onClick={() => deleteMutation.mutate(slot.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-500/80 leading-relaxed">
          <strong>Tip:</strong> Students can only book you during these slots. Make sure to update your availability regularly 
          to keep your calendar accurate. These blocks are automatically synced to your public profile.
        </p>
      </div>
    </div>
  );
}
