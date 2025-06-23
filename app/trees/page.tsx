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
  Users,
  Globe,
  Lock,
  BarChart3,
  ArrowLeft,
  Grid3X3,
  List,
  Copy,
  Share2,
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
      const token = user?.accessToken;
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
    if (!deletingTreeId) return;
    setEditLoading(true);
    try {
      // Fetch members for the tree
      const membersRes = await fetch(
        `/api/family-trees/${deletingTreeId}/members`,
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );
      const members = membersRes.ok ? await membersRes.json() : [];
      // Delete all members (and their files)
      for (const member of members) {
        await fetch(
          `/api/family-trees/${deletingTreeId}/members/${member.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user?.accessToken}` },
          }
        );
      }
      // Delete the tree
      const res = await fetch(`/api/family-trees/${deletingTreeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.accessToken}` },
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

  const getStatistics = () => {
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
    if (!editingTree) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/family-trees/${editingTree.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
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

  if (authLoading || loading) {
    return <PageLoader text="Loading your family trees..." />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-background">
      {editLoading && <Loader variant="overlay" text="Processing..." />}
      <Header
        treeName="My Family Trees"
        extraActions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Tree
          </Button>
        }
        showProfile={true}
        onResetView={() => router.push("/user-profile")}
      />
      <main className="max-w-full min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-120px)] mx-auto py-4 sm:py-6 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-24 sm:pb-8">
        <div className="px-1 sm:px-4 py-4 sm:py-6">
          {/* Statistics Cards */}
          <div className="flex gap-3 mb-6 overflow-x-auto md:grid md:grid-cols-4 md:gap-4 md:mb-8">
            <div className="min-w-[170px] sm:min-w-[200px] md:min-w-0">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-foreground">
                        Total Trees
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        {trees.length}
                      </p>
                    </div>
                    <TreePine className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="min-w-[170px] sm:min-w-[200px] md:min-w-0">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-foreground">
                        Family Members
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        {stats.totalMembers}
                      </p>
                    </div>
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="min-w-[170px] sm:min-w-[200px] md:min-w-0">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-foreground">
                        Public Trees
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        {stats.publicTrees}
                      </p>
                    </div>
                    <Globe className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="min-w-[170px] sm:min-w-[200px] md:min-w-0">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-foreground">
                        Private Trees
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        {stats.privateTrees}
                      </p>
                    </div>
                    <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
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

                <Select
                  value={filterBy}
                  onValueChange={(value: FilterOption) => setFilterBy(value)}
                >
                  <SelectTrigger className="w-full md:w-40 text-sm sm:text-base">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trees</SelectItem>
                    <SelectItem value="public">Public Only</SelectItem>
                    <SelectItem value="private">Private Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
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
              {(searchTerm || filterBy !== "all" || sortBy !== "updated") && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-xs sm:text-sm md:text-base text-foreground">
                    Active filters:
                  </span>
                  {searchTerm && (
                    <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                  )}
                  {filterBy !== "all" && (
                    <Badge variant="secondary">
                      {filterBy === "public" ? "Public trees" : "Private trees"}
                    </Badge>
                  )}
                  {sortBy !== "updated" && (
                    <Badge variant="secondary">
                      Sort:{" "}
                      {sortBy === "name"
                        ? "Name"
                        : sortBy === "created"
                        ? "Created"
                        : "Members"}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterBy("all");
                      setSortBy("updated");
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
                    <Button onClick={() => setShowCreateModal(true)}>
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
                      No family trees match your current search and filter
                      criteria.
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
        </div>
      </main>

      {/* Create Tree Modal */}
      <CreateTreeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(treeId) => {
          console.log("Tree created successfully with ID:", treeId);
          fetchTrees(); // Refresh the tree list
          setShowCreateModal(false); // Close the modal
          router.push(`/trees/${treeId}`); // Navigate to the new tree
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
            <Input
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Description"
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
            />
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
