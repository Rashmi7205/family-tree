import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import QR from "qr.js";
import { Icons } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const QRSVG = ({ value, size = 160 }) => {
  const qr = new QR(value);
  const cells = qr.modules || [];
  const cellSize = size / cells.length;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg"
    >
      <rect width={size} height={size} fill="#fff" />
      {cells.flatMap((row, rIdx) =>
        row.map((cell, cIdx) =>
          cell ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx * cellSize}
              y={rIdx * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111"
            />
          ) : null
        )
      )}
    </svg>
  );
};

const ShareDialog = ({ open, onClose, url, trigger, onOpen }) => {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (open && onOpen) onOpen();
  }, [open, onOpen]);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const shareText = encodeURIComponent("Check out this family tree!");

  const content = (
    <div className="bg-white dark:bg-gray-950 rounded-2xl dark:border-gray-800 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Share2 className="w-5 h-5 text-green-600" />
        <span className="font-bold text-lg">Share this Tree</span>
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-inner">
          <QRSVG value={url} size={isMobile ? 120 : 160} />
        </div>
        <div className="flex flex-col sm:flex-row mt-3 w-full gap-2 items-center">
          <input
            value={url}
            readOnly
            className="flex-1 text-xs rounded border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 font-mono"
          />
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-1"
          >
            <Copy className="w-4 h-4 text-green-600" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
      <div className="px-4 flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">Share via</span>
        <div className="flex justify-center gap-3">
          {[
            {
              icon: Icons.twitter,
              color: "#1DA1F2",
              url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
                url
              )}`,
              label: "Twitter",
            },
            {
              icon: Icons.facebook,
              color: "#1877F3",
              url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`,
              label: "Facebook",
            },
            {
              icon: Icons.whatsapp,
              color: "#25D366",
              url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(
                url
              )}`,
              label: "WhatsApp",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group focus:outline-none focus:ring-2 rounded p-1"
              title={`Share on ${item.label}`}
            >
              <item.icon className="w-8 h-8" style={{ color: item.color }} />
              <span className="text-[10px] mt-1" style={{ color: item.color }}>
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        Anyone with this link can view this tree.
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="max-w-sm w-full p-4">
          <SheetHeader></SheetHeader>
          {content}
          <SheetClose asChild>
            <Button variant="outline" className="mt-4 w-full">
              Close
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      <PopoverContent className="p-4 rounded-2xl border bg-background max-w-sm w-full">
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default ShareDialog;
