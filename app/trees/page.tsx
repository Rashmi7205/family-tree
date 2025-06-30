"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreeCard } from "@/components/family-tree/tree-card";
import { CreateTreeModal } from "@/components/family-tree/create-tree-modal";
import { PageLoader } from "@/components/ui/loader";
import { Header } from "@/components/family-tree-viewer/Header";

import {
  Plus,
  Search,
  Filter,
  TreePine,
  BarChart3,
  ArrowLeft,
  Grid3X3,
  List,
  Copy,
  Share2,
  CalendarDays,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useAuth } from "../../lib/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Icons } from "../../components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/ui/loader";
import QR from "qr.js";
import EventCalendar from "@/components/EventCalendar";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/dashboard/stat-card";

interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareLink: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    relationships: number;
  };
}

type SortOption = "name" | "created" | "updated" | "members";
type FilterOption = "all" | "public" | "private";
type ViewMode = "grid" | "list";

interface Statistics {
  totalMembers: number;
  totalRelationships: number;
  publicTrees: number;
  privateTrees: number;
}

const getStatistics = (trees: FamilyTree[]): Statistics => {
  const totalMembers = trees.reduce(
    (sum, tree) => sum + tree._count.members,
    0
  );
  const totalRelationships = trees.reduce(
    (sum, tree) => sum + tree._count.relationships,
    0
  );
  const publicTrees = trees.filter((tree) => tree.isPublic).length;
  const privateTrees = trees.filter((tree) => !tree.isPublic).length;

  return { totalMembers, totalRelationships, publicTrees, privateTrees };
};

// Add ShareTreeDialog component
function ShareTreeDialog({
  open,
  onClose,
  url,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
}) {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-600" /> Share this Tree
          </DialogTitle>
        </DialogHeader>
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
                  <item.icon
                    className="w-8 h-8"
                    style={{ color: item.color }}
                  />
                  <span
                    className="text-[10px] mt-1"
                    style={{ color: item.color }}
                  >
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
      </DialogContent>
    </Dialog>
  );
}

// --- DashboardHeader ---
function DashboardHeader({
  onNewTree,
  onResetView,
}: {
  onNewTree: () => void;
  onResetView: () => void;
}) {
  const router = useRouter();
  return (
    <Header
      treeName="My Family Trees"
      extraActions={
        <Button onClick={onNewTree}>
          <Plus className="h-4 w-4 mr-2" />
          New Tree
        </Button>
      }
      showProfile={true}
      onResetView={onResetView}
    />
  );
}

// --- StatsAndCalendarSection ---
function StatsAndCalendarSection({
  stats,
  treesLength,
}: {
  stats: Statistics;
  treesLength: number;
}) {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Stats Cards in a Card */}
        <div className="flex-1">
          <Card className="h-full flex flex-col justify-center rounded-2xl shadow-sm">
            <CardContent className="h-full flex flex-col justify-center items-center p-3 md:p-6">
              <h3>Your Tree Stats</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-4 h-full items-center justify-center">
                <StatCard
                  label="Total Trees"
                  value={treesLength}
                  imageSrc="/assets/tree.png"
                  variant="green"
                  height={80}
                  imageSize={24}
                  padding="p-2"
                />
                <StatCard
                  label="Family Members"
                  value={stats.totalMembers}
                  imageSrc="/assets/member.png"
                  variant="blue"
                  height={80}
                  imageSize={24}
                  padding="p-2"
                />
                <StatCard
                  label="Public Trees"
                  value={stats.publicTrees}
                  imageSrc="/assets/family-tree.png"
                  variant="purple"
                  height={80}
                  imageSize={24}
                  padding="p-2"
                />
                <StatCard
                  label="Private Trees"
                  value={stats.privateTrees}
                  imageSrc="/assets/secure.png"
                  variant="gray"
                  height={80}
                  imageSize={24}
                  padding="p-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Event Calendar in a Card */}
        <div className="flex-1">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
}

// --- FiltersSection ---
function FiltersSection({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  activeFilters,
  clearFilters,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterBy: FilterOption;
  setFilterBy: (v: FilterOption) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  activeFilters: React.ReactNode[];
  clearFilters: () => void;
}) {
  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Filter className="h-5 w-5 sm:h-6 sm:w-6" />
          Filter & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 md:gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="Search family trees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-40 text-sm sm:text-base">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trees</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40 text-sm sm:text-base">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="members">Most Members</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 justify-center md:justify-start">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-xs sm:text-sm md:text-base text-foreground">
              Active filters:
            </span>
            {activeFilters}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- TreesResultsSection ---
function TreesResultsSection({
  filteredTrees,
  trees,
  viewMode,
  openEditModal,
  openDeleteConfirm,
  handleShareTree,
  searchTerm,
  filterBy,
  sortBy,
  setSearchTerm,
  setFilterBy,
  setSortBy,
  setViewMode,
}: {
  filteredTrees: FamilyTree[];
  trees: FamilyTree[];
  viewMode: ViewMode;
  openEditModal: (tree: FamilyTree) => void;
  openDeleteConfirm: (treeId: string) => void;
  handleShareTree: (tree: FamilyTree) => void;
  searchTerm: string;
  filterBy: FilterOption;
  sortBy: SortOption;
  setSearchTerm: (v: string) => void;
  setFilterBy: (v: FilterOption) => void;
  setSortBy: (v: SortOption) => void;
  setViewMode: (v: ViewMode) => void;
}) {
  return (
    <>
      {/* Trees Grid/List */}
      {filteredTrees.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10 sm:py-12">
            {trees.length === 0 ? (
              <>
                <TreePine className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground mb-2">
                  No family trees yet
                </h3>
                <p className="text-xs sm:text-base md:text-lg text-foreground mb-6">
                  Get started by creating your first family tree to begin
                  documenting your family history.
                </p>
                <Button onClick={() => setViewMode("grid") /* fallback */}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tree
                </Button>
              </>
            ) : (
              <>
                <Search className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground mb-2">
                  No trees found
                </h3>
                <p className="text-xs sm:text-base md:text-lg text-foreground mb-6">
                  No family trees match your current search and filter criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterBy("all");
                    setSortBy("updated");
                  }}
                >
                  Clear Filters
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 md:mb-4 gap-2">
            <p className="text-xs sm:text-sm md:text-base text-foreground">
              Showing {filteredTrees.length} of {trees.length} family trees
            </p>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <span className="text-xs sm:text-sm md:text-base text-foreground">
                {filteredTrees.reduce(
                  (sum, tree) => sum + tree._count.members,
                  0
                )}{" "}
                total members
              </span>
            </div>
          </div>

          {/* Trees Display */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {filteredTrees.map((tree) => (
              <TreeCard
                key={tree.id}
                tree={tree}
                onDelete={() => openDeleteConfirm(tree.id)}
                onEdit={() => openEditModal(tree)}
                onShare={() => handleShareTree(tree)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function PointerEventsCleanup() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);
  return null;
}

export default function TreesPage() {
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [filteredTrees, setFilteredTrees] = useState<FamilyTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();
  const [editingTree, setEditingTree] = useState<FamilyTree | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isPublic: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deletingTreeId, setDeletingTreeId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }
    if (user) {
      fetchTrees();
    }
  }, [user, authLoading]);

  useEffect(() => {
    filterAndSortTrees();
  }, [trees, searchTerm, sortBy, filterBy]);

  const fetchTrees = async () => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch("/api/family-trees", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrees(data);
      }
    } catch (error) {
      console.error("Failed to fetch trees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTrees = () => {
    const filtered = trees.filter((tree) => {
      const matchesSearch =
        tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tree.description &&
          tree.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "public" && tree.isPublic) ||
        (filterBy === "private" && !tree.isPublic);

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "members":
          return b._count.members - a._count.members;
        default:
          return 0;
      }
    });

    setFilteredTrees(filtered);
  };

  const handleDeleteTree = async () => {
    if (!deletingTreeId || !user) return;
    setEditLoading(true);
    try {
      const token = await user.getIdToken();
      // Fetch members for the tree
      const membersRes = await fetch(
        `/api/family-trees/${deletingTreeId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const members = membersRes.ok ? await membersRes.json() : [];
      // Delete all members (and their files)
      for (const member of members) {
        await fetch(
          `/api/family-trees/${deletingTreeId}/members/${member.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      // Delete the tree
      const res = await fetch(`/api/family-trees/${deletingTreeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast({
          title: "Tree deleted",
          description: "Family tree deleted successfully.",
        });
        setTrees(trees.filter((tree) => tree.id !== deletingTreeId));
      } else {
        const data = await res.json();
        toast({
          title: "Delete failed",
          description: data.error || "Failed to delete tree.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Delete failed",
        description: "Failed to delete tree.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
      setDeleteConfirmOpen(false);
      setDeletingTreeId(null);
    }
  };

  const handleShareTree = (tree: FamilyTree) => {
    const shareUrl = `${window.location.origin}/trees/${tree.id}/public`;
    setShareUrl(shareUrl);
    setShareDialogOpen(true);
  };

  // Edit logic
  const openEditModal = (tree: FamilyTree) => {
    setEditingTree(tree);
    setEditForm({
      name: tree.name,
      description: tree.description || "",
      isPublic: tree.isPublic,
    });
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSwitch = (val: boolean) => {
    setEditForm({ ...editForm, isPublic: val });
  };
  const handleEditSubmit = async () => {
    if (!editingTree || !user) return;
    setEditLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/family-trees/${editingTree.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        toast({
          title: "Tree updated",
          description: "Family tree updated successfully.",
        });
        fetchTrees();
        setEditingTree(null);
      } else {
        const data = await res.json();
        toast({
          title: "Update failed",
          description: data.error || "Failed to update tree.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Update failed",
        description: "Failed to update tree.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Delete logic
  const openDeleteConfirm = (treeId: string) => {
    setDeletingTreeId(treeId);
    setDeleteConfirmOpen(true);
  };

  // Active filter badges
  const activeFilters: React.ReactNode[] = [];
  if (searchTerm)
    activeFilters.push(
      <Badge variant="secondary">Search: "{searchTerm}"</Badge>
    );
  if (filterBy !== "all")
    activeFilters.push(
      <Badge variant="secondary">
        {filterBy === "public" ? "Public trees" : "Private trees"}
      </Badge>
    );
  if (sortBy !== "updated")
    activeFilters.push(
      <Badge variant="secondary">
        Sort:{" "}
        {sortBy === "name"
          ? "Name"
          : sortBy === "created"
          ? "Created"
          : "Members"}
      </Badge>
    );

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBy("all");
    setSortBy("updated");
  };

  if (authLoading || loading) {
    return <PageLoader text="Loading your family trees..." />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const stats = getStatistics(trees);

  return (
    <div className="min-h-screen bg-background">
      <PointerEventsCleanup />
      {editLoading && <Loader variant="overlay" text="Processing..." />}
      <DashboardHeader
        onNewTree={() => setShowCreateModal(true)}
        onResetView={() => router.push("/user-profile")}
      />
      <main className="max-w-full min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-120px)] mx-auto py-4 sm:py-6 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-24 sm:pb-8">
        <div className="px-1 sm:px-4 py-4 sm:py-6">
          <StatsAndCalendarSection stats={stats} treesLength={trees.length} />
          <FiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
          />
          <TreesResultsSection
            filteredTrees={filteredTrees}
            trees={trees}
            viewMode={viewMode}
            openEditModal={openEditModal}
            openDeleteConfirm={openDeleteConfirm}
            handleShareTree={handleShareTree}
            searchTerm={searchTerm}
            filterBy={filterBy}
            sortBy={sortBy}
            setSearchTerm={setSearchTerm}
            setFilterBy={setFilterBy}
            setSortBy={setSortBy}
            setViewMode={setViewMode}
          />
        </div>
      </main>

      {/* Create Tree Modal */}
      <CreateTreeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(treeId) => {
          fetchTrees();
          setShowCreateModal(false);
          router.push(`/trees/${treeId}`);
        }}
      />

      {/* Edit Tree Modal */}
      <Dialog
        open={!!editingTree}
        onOpenChange={(open) => !open && setEditingTree(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Family Tree</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tree-name">Name</Label>
              <Input
                id="edit-tree-name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-tree-description">Description</Label>
              <Input
                id="edit-tree-description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={editForm.isPublic}
                onCheckedChange={handleEditSwitch}
              />
              <span>Public</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit} disabled={editLoading}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Family Tree</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this family tree? This will also
            delete all members and their files. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTree}
              disabled={editLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Tree Dialog */}
      <ShareTreeDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        url={shareUrl}
      />
    </div>
  );
}
