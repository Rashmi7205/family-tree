import React, { useEffect } from "react";
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
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

// Simple mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

interface ShareDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  url: string;
  trigger?: React.ReactNode;
  onOpen?: () => void;
}

function QRSVG({ value, size = 160 }: { value: string; size?: number }) {
  const qr = new QR(value);
  const cells = qr.modules;
  if (!cells) return null;
  const cellSize = size / cells.length;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-xl border shadow-md bg-white"
    >
      <rect width={size} height={size} fill="#fff" />
      {cells.map((row: any, rIdx: number) =>
        row.map((cell: any, cIdx: number) =>
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
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  url,
  trigger,
  onOpen,
}) => {
  const [copied, setCopied] = React.useState(false);
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
  const shareUrl = encodeURIComponent(url);

  const content = (
    <div className="flex flex-col items-center gap-5 rounded-2xl shadow-2xl border bg-background font-sans">
      <div className="flex items-center gap-2 mb-2">
        <Share2 className="w-6 h-6 text-bright-green" />
        <span className="font-bold text-xl tracking-tight">
          Share this tree
        </span>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="mb-3 p-2 rounded-xl bg-gray-50 border shadow-inner">
          <QRSVG value={url} size={140} />
        </div>
        <div className="flex items-center gap-2 w-full mt-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-2 py-1 rounded border text-xs bg-gray-100 font-mono"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopy}
            title="Copy link"
            className="border-bright-green"
          >
            <Copy className="w-4 h-4 text-bright-green" />
          </Button>
          {copied && (
            <span className="text-green-600 text-xs ml-1">Copied!</span>
          )}
        </div>
      </div>
      <div className="w-full border-t my-3" />
      <div className="w-full flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground mb-1">Share via</span>
        <div className="flex gap-4 justify-center">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
            title="Share on Twitter"
          >
            <Icons.twitter className="w-8 h-8 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1 font-medium text-[#1DA1F2]">
              Twitter
            </span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
            title="Share on Facebook"
          >
            <Icons.facebook className="w-8 h-8 text-[#1877F3] group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1 font-medium text-[#1877F3]">
              Facebook
            </span>
          </a>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
            title="Share on WhatsApp"
          >
            <Icons.whatsapp className="w-8 h-8 text-[#25D366] group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1 font-medium text-[#25D366]">
              WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="max-w-sm w-full p-6">
          <SheetHeader>
          </SheetHeader>
          {content}
          <SheetClose asChild>
            <Button variant="outline" className="mt-6 w-full">
              Close
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={onClose}>
      {trigger ? <PopoverTrigger asChild>{trigger}</PopoverTrigger> : null}
      <PopoverContent className="max-w-sm w-full p-6 flex flex-col items-center gap-5 rounded-2xl shadow-2xl border bg-background font-sans">
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default ShareDialog;
