import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const ExploreButton = ({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex justify-center items-center gap-2 shadow-lg text-base font-semibold",
        "bg-background hover:text-primary-foreground border-2 border-border rounded-full",
        "relative z-10 overflow-hidden group transition-all duration-300",
        "before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary hover:text-primary-foreground before:-z-10 before:aspect-square before:hover:scale-150",
        "px-3 py-2",
        className
      )}
    >
      <span className="hidden sm:inline">{text}</span>
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-0" />
    </Link>
  );
};

export default ExploreButton;
