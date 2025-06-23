"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import ExploreButton from "@/components/ui/ExploreButton";
import SearchModal from "./SearchModal";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  isAuth?: boolean;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  showThemeToggle?: boolean;
}

export function NavBar({ items, className, showThemeToggle }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
          className
        )}
      >
        <div className="flex items-center gap-2 bg-background/5 border border-border backdrop-blur-lg p-1 rounded-full shadow-lg">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => {
                  if (!item.isAuth) {
                    setActiveTab(item.name);
                  }
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                  "text-foreground/80 hover:text-primary",
                  isActive && !item.isAuth && "bg-muted text-primary"
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && !item.isAuth && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}

          {showThemeToggle && <ThemeToggle />}
          <button
            type="button"
            aria-label="Search"
            className="flex items-center justify-center rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <ExploreButton href="/trees" text="Get Started" />
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
