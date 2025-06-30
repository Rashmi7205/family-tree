"use client";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  photoUrl?: string;
  gender?: string;
  birthDate?: string;
}

export default function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    fetch(`/api/members?name=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch(() => setError("Failed to fetch results."))
      .finally(() => setLoading(false));
  }, [query]);

  function handleViewTree(id: string) {
    onOpenChange(false);
    router.push(`/trees/${id}/public`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl shadow-xl max-w-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Search Members
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Find family members by name and view their tree.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base sm:text-lg rounded-xl bg-background border border-border shadow-sm focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Escape") onOpenChange(false);
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
          <div className="overflow-y-auto max-h-60 flex flex-col space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {loading && (
              <div className="text-center text-muted-foreground py-8">
                Searching...
              </div>
            )}
            {error && (
              <div className="text-center text-destructive py-8">{error}</div>
            )}
            {!loading && !error && results.length === 0 && query && (
              <div className="text-center text-muted-foreground py-8">
                No members found.
              </div>
            )}
            {results.map((member) => (
              <div
                key={member.id}
                className="flex items-center rounded-xl shadow-lg bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border">
                    <User2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center min-w-0 ml-5">
                  <div className="font-semibold text-gray-900 dark:text-white truncate text-base sm:text-lg mb-1">
                    {member.name}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">
                    {member.gender && (
                      <span className="capitalize">
                        Gender: {member.gender}
                      </span>
                    )}
                    {member.birthDate && (
                      <span>DOB: {formatDate(member.birthDate)}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#FF4F0F] hover:bg-[#ff6833] text-white rounded-lg px-3 py-1.5 text-sm font-medium w-fit mt-1"
                    onClick={() => handleViewTree(member.familyid)}
                  >
                    View Tree
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatYear(date: string | Date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear();
}
