import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const malePalette = {
  card: "bg-indigo-100 dark:bg-indigo-900/50",
  imageBg: "bg-indigo-200/50 dark:bg-indigo-800/50",
  name: "text-gray-900 dark:text-indigo-100",
  meta: "text-gray-600 dark:text-indigo-200/80",
  initial: "text-gray-800 dark:text-indigo-100",
  border: "border-indigo-300 dark:border-indigo-700",
};

const femalePalette = {
  card: "bg-rose-100 dark:bg-rose-900/50",
  imageBg: "bg-rose-200/50 dark:bg-rose-800/50",
  name: "text-gray-900 dark:text-rose-100",
  meta: "text-gray-600 dark:text-rose-200/80",
  initial: "text-gray-800 dark:text-rose-100",
  border: "border-rose-300 dark:border-rose-700",
};

const otherPalette = {
  card: "bg-purple-100 dark:bg-purple-900/50",
  imageBg: "bg-purple-200/50 dark:bg-purple-800/50",
  name: "text-gray-900 dark:text-purple-100",
  meta: "text-gray-600 dark:text-purple-200/80",
  initial: "text-gray-800 dark:text-purple-100",
  border: "border-purple-300 dark:border-purple-700",
};

const getPaletteByGender = (
  gender: "male" | "female" | "other" | undefined
) => {
  switch (gender) {
    case "male":
      return malePalette;
    case "female":
      return femalePalette;
    default:
      return otherPalette;
  }
};

const StyledCardNode = ({ data }: { data: any }) => {
  const member = data.member || data;
  const palette = getPaletteByGender(member.gender);
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 bg-transparent border-0"
      />
      {/* Spouse target handle on the left side (middle) */}
      <Handle
        type="target"
        position={Position.Left}
        id="spouse-left"
        className="w-2 h-2 bg-transparent border-0 top-1/2 -translate-y-1/2"
      />
      <Card
        className={cn(
          "p-0 shadow-xl rounded-xl border-2 w-[90vw] max-w-[260px] sm:w-[260px] cursor-pointer transition ring-0",
          palette.card,
          palette.border,
          "hover:ring-2 hover:ring-bright-green",
          data.isSelected &&
            "ring-2 ring-bright-green ring-offset-2 ring-offset-background"
        )}
        onClick={data.onShowDetails}
      >
        <CardContent className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Image/Avatar */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden",
                palette.imageBg
              )}
            >
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={cn("text-2xl sm:text-3xl", palette.initial)}>
                  {member.firstName?.[0]}
                </span>
              )}
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div
              className={cn(
                "font-semibold text-base sm:text-lg leading-tight capitalize",
                palette.name
              )}
            >
              {member.firstName} {member.lastName}
            </div>
            <div className={cn("text-xs sm:text-sm capitalize", palette.meta)}>
              {member.gender}
            </div>
            <div className={cn("text-xs sm:text-sm mt-1", palette.meta)}>
              {member.birthDate
                ? new Date(member.birthDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(
                      /\b([A-Za-z]{3})\b/,
                      (m) => m.charAt(0).toUpperCase() + m.slice(1)
                    )
                : ""}
            </div>
          </div>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2 h-2 bg-transparent border-0"
      />
      {/* Spouse source handle on the right side (middle) */}
      <Handle
        type="source"
        position={Position.Right}
        id="spouse-right"
        className="w-2 h-2 bg-transparent border-0 top-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default StyledCardNode;
