"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const [hours, setHours] = useState<number>(date.getHours());
  const [minutes, setMinutes] = useState<number>(date.getMinutes());

  // Update the date when hours or minutes change
  useEffect(() => {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  }, [hours, minutes, date, setDate]);

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          id="hours"
          className="w-16 text-center"
          type="number"
          min={0}
          max={23}
          value={hours}
          onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          id="minutes"
          className="w-16 text-center"
          type="number"
          min={0}
          max={59}
          value={minutes}
          onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}
