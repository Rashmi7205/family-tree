import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  HelpCircle,
  Menu,
  Moon,
  Sun,
  Share2,
  Plus,
  Info,
  Users,
  Eye,
  Edit,
  Trash2,
  Save,
  Copy,
} from "lucide-react";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { SaveLayoutButton } from "./SaveLayoutButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyMember } from "./types";
import QR from "qr.js";

interface HeaderProps {
  onResetView: () => void;
  extraActions?: React.ReactNode;
  showProfile?: boolean;
  treeName?: string;
  createdDate?: string;
  viewOnly?: boolean;
  onShareOpen?: () => void;
  // Save layout props
  onSaveLayout?: () => void;
  onResetLayout?: () => void;
  isUsingCustomPositions?: boolean;
  savingPositions?: boolean;
  // New props for statistics and add member
  members?: FamilyMember[];
  edges?: any[];
  selectedMember?: FamilyMember | null;
  onAddMember?: () => void;
  onEditMember?: (member: FamilyMember) => void;
  onDeleteMember?: (id: string) => void;
}

export const Header: FC<HeaderProps> = ({
  onResetView,
  extraActions,
  showProfile = true,
  treeName,
  createdDate,
  viewOnly = false,
  onShareOpen,
  // Save layout props
  onSaveLayout,
  onResetLayout,
  isUsingCustomPositions,
  savingPositions,
  // New props
  members = [],
  edges = [],
  selectedMember,
  onAddMember,
  onEditMember,
  onDeleteMember,
}) => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [shareOpen, setShareOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  // Debug logging for createdDate

  // Compute share URL for public tree view
  let shareUrl = url;
  if (viewOnly && url && /\/trees\/[\w-]+(?!\/public$)/.test(url)) {
    // If on a /trees/[id] page but not already /public, append /public
    if (!url.endsWith("/public")) {
      shareUrl = url.replace(/(\/trees\/[\w-]+)(\/public)?$/, "$1/public");
    }
  }

  const handleSignOut = async () => {
    await logout();
    router.push("/auth/signin");
  };

  // Helper function to format the created date
  const formatCreatedDate = (date: any) => {
    if (!date) return null;

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return null;

      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  const formattedDate = formatCreatedDate(createdDate);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-10 px-2 sm:px-4 pt-2 pb-1 sm:pt-4 sm:pb-2">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center bg-background/80 backdrop-blur-sm rounded-lg shadow-sm px-2 sm:px-4 py-2 sm:py-3">
          {/* - Tree name and created date */}
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">
              {treeName || "Family Tree"}
            </h1>
            {formattedDate && (
              <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Created on {formattedDate}
              </div>
            )}
          </div>

          {/* Right side - All action icons */}
          <div className="flex items-center gap-2">
            {/* Add Member button (only in edit mode) */}
            {!viewOnly && onAddMember && (
              <Button
                variant="default"
                size="icon"
                onClick={onAddMember}
                className="h-10 w-10 min-w-[44px] min-h-[44px]"
                title="Add Member"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}

            {/* Share button (view only) */}
            {viewOnly && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 min-w-[44px] min-h-[44px]"
                onClick={() => setShareOpen(true)}
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            )}

            {/* Extra actions */}
            {extraActions}

            {/* Save layout button (edit mode only) */}
            {!viewOnly && onSaveLayout && (
              <SaveLayoutButton
                onSave={onSaveLayout}
                onReset={onResetLayout || (() => {})}
                isUsingCustomPositions={isUsingCustomPositions || false}
                savingPositions={savingPositions || false}
              />
            )}

            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 min-w-[44px] min-h-[44px]"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Info button for statistics - moved to end */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 min-w-[44px] min-h-[44px]"
              onClick={() => setInfoOpen(true)}
              title="View Statistics"
            >
              <Info className="h-5 w-5" />
            </Button>

            {/* User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 min-w-[44px] min-h-[44px] rounded-full p-0"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.photoURL || userProfile?.photoURL || ""}
                        alt={
                          userProfile?.displayName ||
                          user?.displayName ||
                          "User"
                        }
                      />
                      <AvatarFallback>
                        {userProfile?.displayName?.charAt(0).toUpperCase() ||
                          user?.displayName?.charAt(0).toUpperCase() || (
                            <Icons.user className="h-5 w-5" />
                          )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.displayName ||
                          user?.displayName ||
                          "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground break-all">
                        {userProfile?.email || user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/user-profile")}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/trees")}
                    className="cursor-pointer"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-700"
                  >
                    <Icons.logOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Layout - Tree info only + hamburger menu */}
        <div className="md:hidden bg-background/80 backdrop-blur-sm rounded-lg shadow-sm p-3">
          <div className="flex items-center justify-between">
            {/* Left side - Tree name and created date only */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">
                {treeName || "Family Tree"}
              </h1>
              {formattedDate && (
                <div className="text-xs text-gray-500 mt-0.5 truncate">
                  Created on {formattedDate}
                </div>
              )}
            </div>

            {/* Right side - Hamburger menu only */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 min-w-[44px] min-h-[44px] ml-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Info/Statistics */}
                <DropdownMenuItem
                  onClick={() => setInfoOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  View Statistics
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Add Member */}
                {!viewOnly && onAddMember && (
                  <>
                    <DropdownMenuItem
                      onClick={onAddMember}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Extra actions */}
                {extraActions && (
                  <>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      {extraActions}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Share */}
                {viewOnly && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setShareOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Save Layout */}
                {!viewOnly && onSaveLayout && (
                  <>
                    <DropdownMenuItem
                      onClick={onSaveLayout}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Layout
                    </DropdownMenuItem>
                    {onResetLayout && (
                      <DropdownMenuItem
                        onClick={onResetLayout}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Layout
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>

                {user && <DropdownMenuSeparator />}
                {user && (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/user-profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/trees")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 focus:text-red-700"
                    >
                      <Icons.logOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Statistics Dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Tree Statistics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Members:</span>
                  <Badge variant="secondary">{members.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Male:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {members.filter((m) => m.gender === "male").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Female:</span>
                  <Badge variant="outline" className="bg-pink-50 text-pink-700">
                    {members.filter((m) => m.gender === "female").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Other:</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {
                      members.filter(
                        (m) => m.gender !== "male" && m.gender !== "female"
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relationships:</span>
                  <Badge variant="outline">{edges.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {selectedMember && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Selected Member
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {selectedMember.gender}
                      </p>
                    </div>
                    {!viewOnly && onEditMember && onDeleteMember && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onEditMember(selectedMember);
                            setInfoOpen(false);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onDeleteMember(selectedMember.id);
                            setInfoOpen(false);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Birth Date:</span>
                      <p className="text-sm">
                        {selectedMember.birthDate
                          ? new Date(
                              selectedMember.birthDate
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Parents:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMember.parents &&
                        selectedMember.parents.length > 0 ? (
                          selectedMember.parents.map((parentId) => {
                            const parent = members.find(
                              (m) => m.id === parentId
                            );
                            return parent ? (
                              <Badge
                                key={parentId}
                                variant="outline"
                                className="text-xs"
                              >
                                {parent.firstName} {parent.lastName}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Children:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMember.children &&
                        selectedMember.children.length > 0 ? (
                          selectedMember.children.map((childId) => {
                            const child = members.find((m) => m.id === childId);
                            return child ? (
                              <Badge
                                key={childId}
                                variant="outline"
                                className="text-xs"
                              >
                                {child.firstName} {child.lastName}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {viewOnly && (
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent className="max-w-sm w-full p-0 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-600" /> Share this Tree
              </DialogTitle>
            </DialogHeader>
            <ShareDialogContent url={shareUrl} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Share Dialog Content Component
const ShareDialogContent = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);
  const shareText = encodeURIComponent("Check out this family tree!");

  const QRSVG = ({ value, size = 160 }: { value: string; size?: number }) => {
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
        {cells.flatMap((row: boolean[], rIdx: number) =>
          row.map((cell: boolean, cIdx: number) =>
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-inner">
        <QRSVG value={url} size={160} />
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
      <div className="border-t border-gray-100 dark:border-gray-800 my-2 w-full" />
      <div className="px-4 flex flex-col items-center gap-1 w-full">
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
      <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 w-full">
        Anyone with this link can view this tree.
      </div>
    </div>
  );
};
