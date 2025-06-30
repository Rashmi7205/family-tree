"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ManualOTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function ManualOTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className = "",
}: ManualOTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);

  // Pad value so all boxes are always editable
  const valuePadded = (value ?? "").padEnd(length, "");

  useEffect(() => {
    if (focusIdx !== null) {
      inputsRef.current[focusIdx]?.focus();
      setFocusIdx(null);
    }
  }, [focusIdx, value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newValue =
      valuePadded.substring(0, idx) +
      val[val.length - 1] +
      valuePadded.substring(idx + 1);
    onChange(newValue);
    // Move to next input
    if (val && idx < length - 1) {
      setFocusIdx(idx + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      if (valuePadded[idx]) {
        // Clear current
        const newValue =
          valuePadded.substring(0, idx) + "" + valuePadded.substring(idx + 1);
        onChange(newValue);
      } else if (idx > 0) {
        setFocusIdx(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      setFocusIdx(idx - 1);
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      setFocusIdx(idx + 1);
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className={cn(
            "size-10 rounded-lg border border-input bg-background text-center text-lg font-medium text-foreground shadow-sm transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
            valuePadded[idx] ? "border-ring ring-2" : ""
          )}
          value={valuePadded[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          disabled={disabled}
          autoFocus={idx === 0}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}
