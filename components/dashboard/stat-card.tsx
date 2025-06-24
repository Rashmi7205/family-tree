import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  imageSrc: string; // now uses an image
  variant?: "green" | "blue" | "purple" | "gray";
  height?: number;
  imageSize?: number;
  padding?: string;
}

const colorVariants = {
  green: {
    bg: "bg-[#E8F8E9] dark:bg-[#1E2E21]", // pastel green
    label: "text-[#336633] dark:text-[#A2C9A1]",
    value: "text-[#1E3A1E] dark:text-[#C8E1C9]",
    border: "border-[#CDE5CC] dark:border-[#315037]",
  },
  blue: {
    bg: "bg-[#E7F3FB] dark:bg-[#1B2833]", // pastel blue
    label: "text-[#1E3B55] dark:text-[#93B9D8]",
    value: "text-[#10293B] dark:text-[#C7E1F3]",
    border: "border-[#C2E1F5] dark:border-[#293B4F]",
  },
  purple: {
    bg: "bg-[#F3E9F9] dark:bg-[#2E2435]", // pastel purple
    label: "text-[#563568] dark:text-[#C9B1DA]",
    value: "text-[#3C2349] dark:text-[#E0C9F3]",
    border: "border-[#E1CDEC] dark:border-[#44314F]",
  },
  gray: {
    bg: "bg-[#F3F3F3] dark:bg-[#242424]", // neutral gray
    label: "text-[#3A3A3A] dark:text-[#C2C2C2]",
    value: "text-[#222222] dark:text-[#E5E5E5]",
    border: "border-[#E0E0E0] dark:border-[#393939]",
  },
};

export function StatCard({
  label,
  value,
  imageSrc,
  variant = "gray",
  height,
  imageSize = 40,
  padding = "p-3 md:p-4",
}: StatCardProps) {
  const colors = colorVariants[variant];
  return (
    <Card className={cn("shadow-sm rounded-xl flex-1", colors.bg)}>
      <CardContent
        className={cn(
          padding,
          "border-2 rounded-xl flex items-center justify-between",
          colors.border,
          height ? `!h-[${height}px] min-h-0` : ""
        )}
      >
        <div className="flex flex-col">
          <p className={cn("text-sm md:text-base font-medium", colors.label)}>
            {label}
          </p>
          <p className={cn("text-xl md:text-2xl font-bold mt-1", colors.value)}>
            {value}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={imageSrc}
            alt={label}
            style={{ height: imageSize, width: imageSize }}
            className="object-contain"
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>
  );
}
