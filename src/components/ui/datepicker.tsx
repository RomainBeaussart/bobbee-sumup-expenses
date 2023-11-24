"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export function DatePicker({
    range,
    setRange,
}: {
    range?: DateRange | undefined;
    setRange: (date: DateRange | undefined) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !range && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {
                        !range ? "Choisir une date" :
                        range.from && range.to ? `Du ${format(range.from, "dd MMMM", { locale: fr })} au ${format(range.to, "dd MMMM", { locale: fr })}` :
                        range.from ? `À partir du ${format(range.from, "dd MMMM", { locale: fr })}` :
                        range.to ? `Jusqu'au ${format(range.to, "dd MMMM", { locale: fr })}` :
                        "Choisir une date"
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="range" selected={range} onSelect={setRange} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
