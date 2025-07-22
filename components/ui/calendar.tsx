"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  isShowYear?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  isShowYear = true,
  ...props
}: CalendarProps) {
  // State for month and year
  const [month, setMonth] = React.useState<number>(() => {
    if (props.selected && props.selected instanceof Date)
      return props.selected.getMonth();
    return new Date().getMonth();
  });
  const [year, setYear] = React.useState<number>(() => {
    if (isShowYear) {
      if (props.selected && props.selected instanceof Date)
        return props.selected.getFullYear();
      return new Date().getFullYear();
    } else {
      return new Date().getFullYear();
    }
  });

  // Sync local month/year with selected date
  React.useEffect(() => {
    if (props.selected && props.selected instanceof Date) {
      setMonth(props.selected.getMonth());
      setYear(props.selected.getFullYear());
    }
  }, [props.selected]);

  // Update calendar when month/year changes
  const handleMonthChange = (value: string) => {
    const newMonth = Number(value);
    setMonth(newMonth);
    if (props.onMonthChange && year !== undefined) {
      props.onMonthChange(new Date(year, newMonth, 1));
    }
  };
  const handleYearChange = (value: string) => {
    const newYear = Number(value);
    setYear(newYear);
    if (props.onMonthChange) {
      props.onMonthChange(new Date(newYear, month, 1));
    }
  };

  // Generate month and year options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  // Set displayed month/year in DayPicker
  const displayMonth =
    year !== undefined ? new Date(year, month, 1) : undefined;

  return (
    <div>
      <div className="flex flex-row gap-2 mb-2 items-center justify-center flex-wrap">
        <Select
          value={String(month)}
          onValueChange={handleMonthChange}
          disabled={isShowYear && year === undefined}
        >
          <SelectTrigger className="w-32">
            <SelectValue>{months[month]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((m, idx) => (
              <SelectItem key={m} value={String(idx)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isShowYear && (
          <Select
            value={year !== undefined ? String(year) : ""}
            onValueChange={handleYearChange}
            required
          >
            <SelectTrigger className="w-24">
              <SelectValue>{year || "Year"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout={undefined}
        month={displayMonth}
        onMonthChange={(date) => {
          setMonth(date.getMonth());
          setYear(date.getFullYear());
        }}
        {...(["single", "multiple", "range"].includes(props.mode as string) &&
        (props as any).onSelect
          ? { onSelect: (props as any).onSelect }
          : {})}
        fromYear={fromYear}
        toYear={toYear}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "hidden", // Hide default caption
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
        disabled={
          isShowYear && year === undefined ? () => true : props.disabled
        }
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
