"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Member {
  _id: string;
  name: string;
  dob: string;
  gender?: "male" | "female" | "other";
  imageUrl?: string;
  familyTreeId?: string;
}

interface DobEvent {
  date: string; // YYYY-MM-DD
  members: Member[];
}

type EventsByDate = Record<string, Member[]>;

const CONFETTI_BG =
  "bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 animate-birthdayWish";

export default function EventCalendar() {
  const { user } = useAuth();
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Get current month in YYYY-MM
  const now = new Date();
  const monthStr = format(now, "yyyy-MM");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDobs = async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/members/dobs?month=${monthStr}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: DobEvent[] = await response.json();
          const map: EventsByDate = {};
          data.forEach((event) => {
            map[event.date] = event.members;
          });
          setEventsByDate(map);
        }
      } catch (error) {
        console.error("Failed to fetch DOBs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDobs();
  }, [monthStr, user]);

  // Memoize all days in the current month
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    });
  }, [now]);

  // Render a custom day cell
  function renderDay(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd");
    const members = eventsByDate[dateStr];
    const isMarked = !!members?.length;

    if (!isMarked) {
      return (
        <div className="w-9 h-9 flex items-center justify-center">
          {format(day, "d")}
        </div>
      );
    }

    // Popover on hover
    return (
      <Popover
        open={activeDate === dateStr}
        onOpenChange={(isOpen) => !isOpen && setActiveDate(null)}
      >
        <PopoverTrigger asChild>
          <div
            className="w-full h-full flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-bold cursor-pointer border-2 border-blue-400 hover:shadow-lg transition-all relative"
            onClick={() =>
              setActiveDate(activeDate === dateStr ? null : dateStr)
            }
          >
            {format(day, "d")}
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={8}
          className={`w-64 p-0 border-none shadow-xl rounded-2xl overflow-hidden ${CONFETTI_BG}`}
        >
          {members.length === 1 ? (
            // Single member card
            (() => {
              const member = members[0];
              const dob = parseISO(member.dob);
              const today = new Date();
              let age = today.getFullYear() - dob.getFullYear();
              const m = today.getMonth() - dob.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
              }
              const imgSrc =
                member.imageUrl ||
                (member.gender === "male"
                  ? "/assets/man.png"
                  : member.gender === "female"
                  ? "/assets/woman.png"
                  : "/assets/placeholder-user.jpg");
              return (
                <div
                  key={member._id}
                  className="flex flex-col items-center justify-center p-4 gap-2"
                >
                  <div className="w-full flex items-center gap-2 text-base font-semibold text-pink-700 justify-center">
                    <span role="img" aria-label="balloon">
                      🎈
                    </span>{" "}
                    Happy Birthday, {member.name}!
                  </div>
                  <div className="my-2 flex items-center justify-center">
                    <img
                      src={imgSrc}
                      alt={member.name}
                      className="w-24 h-28 object-cover rounded-2xl border-4 border-white shadow-lg bg-gray-100"
                    />
                  </div>
                  <div className="w-full text-center text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                    He/she turning {age} today!{" "}
                    <span role="img" aria-label="cake">
                      🎂
                    </span>
                  </div>
                  <Button
                    asChild
                    className="mt-3 w-full rounded-xl text-base font-bold py-2 bg-gradient-to-r from-pink-400 to-yellow-300 hover:from-pink-500 hover:to-yellow-400 shadow-md"
                  >
                    <a href={`/trees/${member.familyTreeId}`}>View Tree</a>
                  </Button>
                </div>
              );
            })()
          ) : (
            // Multiple members: Carousel
            <div className="relative">
              <Carousel>
                <CarouselContent>
                  {members.map((member) => {
                    const dob = parseISO(member.dob);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const m = today.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                      age--;
                    }
                    const imgSrc =
                      member.imageUrl ||
                      (member.gender === "male"
                        ? "/assets/man.png"
                        : member.gender === "female"
                        ? "/assets/woman.png"
                        : "/assets/placeholder-user.jpg");
                    return (
                      <CarouselItem key={member._id}>
                        <div className="flex flex-col items-center justify-center p-4 gap-2">
                          <div className="w-full flex items-center gap-2 text-base font-semibold text-pink-700 justify-center">
                            <span role="img" aria-label="balloon">
                              🎈
                            </span>{" "}
                            Happy Birthday, {member.name}!
                          </div>
                          <div className="my-2 flex items-center justify-center">
                            <img
                              src={imgSrc}
                              alt={member.name}
                              className="w-24 h-28 object-cover rounded-2xl border-4 border-white shadow-lg bg-gray-100"
                            />
                          </div>
                          <div className="w-full text-center text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                            He/she turning {age} today!{" "}
                            <span role="img" aria-label="cake">
                              🎂
                            </span>
                          </div>
                          <Button
                            asChild
                            className="mt-3 w-full rounded-xl text-base font-bold py-2 bg-gradient-to-r from-pink-400 to-yellow-300 hover:from-pink-500 hover:to-yellow-400 shadow-md"
                          >
                            <a href={`/trees/${member.familyTreeId}`}>
                              View Tree
                            </a>
                          </Button>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {/* Add left and right navigation buttons */}
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10" />
              </Carousel>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Event Calendar</h2>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading events...
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={now}
            month={now}
            onMonthChange={() => {}}
            showOutsideDays
            modifiers={{}}
            components={{
              Day: ({ date }) => renderDay(date),
            }}
            className=""
          />
        )}
      </div>
    </div>
  );
}
