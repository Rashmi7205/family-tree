import { Button } from "@/components/ui/button";
import { RotateCcw, HelpCircle, Menu, Moon, Sun, Share2 } from "lucide-react";
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
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import ShareDialog from "./ShareDialog";

interface HeaderProps {
  onResetView: () => void;
  extraActions?: React.ReactNode;
  showProfile?: boolean;
  treeName?: string;
  createdDate?: string;
  viewOnly?: boolean;
  onShareOpen?: () => void;
}

export const Header: FC<HeaderProps> = ({
  onResetView,
  extraActions,
  showProfile = true,
  treeName,
  createdDate,
  viewOnly = false,
  onShareOpen,
}) => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [shareOpen, setShareOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

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
  return (
    <header className="absolute top-0 left-0 right-0 z-10 px-2 sm:px-4 pt-2 pb-1 sm:pt-4 sm:pb-2">
      <div className="flex justify-between items-center bg-background/80 backdrop-blur-sm rounded-lg shadow-sm px-2 sm:px-4 py-2 sm:py-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">
            {treeName || "Family Tree Viewer"}
          </h1>
          {createdDate && (
            <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Created on{" "}
              {new Date(createdDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>
        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          {viewOnly && (
            <ShareDialog
              open={shareOpen}
              onClose={setShareOpen}
              url={shareUrl}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setShareOpen(true)}
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              }
              onOpen={onShareOpen}
            />
          )}
          {extraActions}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-20 sm:h-10 sm:w-24 text-xs sm:text-sm"
            onClick={onResetView}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
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
          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.photoURL || userProfile?.photoURL || ""}
                      alt={
                        userProfile?.displayName || user?.displayName || "User"
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
                      {userProfile?.displayName || user?.displayName || "User"}
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
          {/* End User Profile Dropdown */}
        </div>
        {/* Mobile actions: share button to the left of hamburger menu */}
        <div className="flex sm:hidden items-center gap-2">
          {viewOnly && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setShareOpen(true)}
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {extraActions && (
                <>
                  <DropdownMenuItem asChild className="flex items-center gap-2">
                    {extraActions}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={onResetView}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Reset View
              </DropdownMenuItem>
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
        {/* Render ShareDialog outside the flex row for mobile */}
        {viewOnly && (
          <ShareDialog
            open={shareOpen}
            onClose={setShareOpen}
            url={shareUrl}
            trigger={null}
            onOpen={onShareOpen}
          />
        )}
      </div>
    </header>
  );
};
