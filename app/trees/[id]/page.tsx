"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFamilyTree } from "@/components/family-tree-viewer/hooks";
import { Header } from "@/components/family-tree-viewer/Header";
import { Sidebar } from "@/components/family-tree-viewer/Sidebar";
import { TreeCanvas } from "@/components/family-tree-viewer/TreeCanvas";
import { AddEditMemberModal } from "@/components/family-tree-viewer/AddEditMemberModal";
import { Button } from "@/components/ui/button";
import { Loader, PageLoader } from "@/components/ui/loader";
import { PanelLeftClose, PanelLeftOpen, Download, Share2 } from "lucide-react";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import * as htmlToImage from "html-to-image";
import ExportPoster from "@/components/family-tree/ExportPoster";
import { useAuth } from "@/lib/auth/auth-context";
import { ShareDialog } from "@/components/family-tree-viewer/ShareDialog";

const malePalette = {
  // Blue shades similar to ADC4FF
  card: "bg-indigo-100",
  ring: "hover:ring-indigo-300",
  imageBg: "bg-indigo-200/50",
  name: "text-[#414141]",
  meta: "text-[#414141]/80",
  initial: "text-[#414141]",
  border: "border-indigo-300",
};

const femalePalette = {
  // Pink/red shades similar to FFADAD
  card: "bg-rose-100",
  ring: "hover:ring-rose-300",
  imageBg: "bg-rose-200/50",
  name: "text-[#414141]",
  meta: "text-[#414141]/80",
  initial: "text-[#414141]",
  border: "border-rose-300",
};

const otherPalette = {
  // Neutral/default
  card: "bg-purple-100",
  ring: "hover:ring-purple-300",
  imageBg: "bg-purple-200/50",
  name: "text-[#414141]",
  meta: "text-[#414141]/80",
  initial: "text-[#414141]",
  border: "border-purple-300",
};

const getPaletteByGender = (
  gender: "male" | "female" | "other" | undefined
) => {
  switch (gender) {
    case "male":
      return malePalette;
    case "female":
      return femalePalette;
    default:
      return otherPalette;
  }
};

function MemberDetailSheet({
  open,
  member,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  member: any;
  onClose: () => void;
  onEdit: (member: any) => void;
  onDelete: (memberId: string) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  if (!member) return null;
  const palette = getPaletteByGender(member.gender);
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="max-w-[90vw] w-[400px] sm:w-[400px] p-0 bg-white dark:bg-gray-950"
      >
        <div className="p-6 flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {member.firstName} {member.lastName}
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              {member.gender}{" "}
              {member.birthDate && (
                <>
                  |{" "}
                  {new Date(member.birthDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4 flex-1">
            <div
              className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden",
                palette.imageBg
              )}
            >
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={cn("text-4xl", palette.initial)}>
                  {member.firstName?.[0]}
                </span>
              )}
            </div>
            <div className="w-full">
              <div className="mb-4">
                <span className="font-semibold">Bio:</span>
                <p className="text-sm text-gray-600 mt-1">
                  {member.bio || "No biography available."}
                </p>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Parents:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.parents && member.parents.length > 0 ? (
                    member.parents.map((pid: string) => {
                      const parent = member.allMembers?.find(
                        (m: any) => m.id === pid
                      );
                      return parent ? (
                        <span
                          key={pid}
                          className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs"
                        >
                          {parent.firstName} {parent.lastName}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-gray-400 text-xs ml-2">None</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Children:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.children && member.children.length > 0 ? (
                    member.children.map((cid: string) => {
                      const child = member.allMembers?.find(
                        (m: any) => m.id === cid
                      );
                      return child ? (
                        <span
                          key={cid}
                          className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs"
                        >
                          {child.firstName} {child.lastName}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-gray-400 text-xs ml-2">None</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Spouse:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.spouseId ? (
                    (() => {
                      const spouse = member.allMembers?.find(
                        (m: any) => m.id === member.spouseId
                      );
                      return spouse ? (
                        <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">
                          {spouse.firstName} {spouse.lastName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs ml-2">None</span>
                      );
                    })()
                  ) : (
                    <span className="text-gray-400 text-xs ml-2">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onEdit(member)}
            >
              Edit Member
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Member
            </Button>
          </div>
          <SheetClose asChild>
            <Button className="mt-6 w-full">Close</Button>
          </SheetClose>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {member.firstName}{" "}
                {member.lastName}? This action cannot be undone and will also
                remove all relationships associated with this member.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(member.id);
                  setShowDeleteDialog(false);
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}

function DemotreeContent() {
  const params = useParams();
  const treeId = params?.id as string;
  const [treeData, setTreeData] = useState<any>(null);
  const {
    members,
    nodes,
    edges,
    selectedMember,
    isAddModalOpen,
    isEditModalOpen,
    editingMember,
    newMember,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    setNewMember,
    setEditingMember,
    setIsAddModalOpen,
    setIsEditModalOpen,
    addMember,
    editMember,
    deleteMember,
    openEditModal,
    setSelectedNodeId,
    validation,
    loading,
    error,
  } = useFamilyTree(treeId);

  const reactFlowRef = useRef<HTMLDivElement>(null);
  const { setViewport, fitView } = useReactFlow();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMember, setSheetMember] = useState<any>(null);
  const [showPoster, setShowPoster] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      const timeout = setTimeout(() => {
        router.replace("/auth/signin");
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const token = await user?.accessToken;
        const res = await fetch(`/api/family-trees/${treeId}`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const data = await res.json();
        setTreeData(data);
      } catch {}
    };
    if (treeId && user) fetchTree();
  }, [treeId, user]);

  // Custom node click handler to open sheet
  const handleNodeClick = useCallback(
    (_: any, node: any) => {
      const member = members.find((m) => m.id === node.id);
      if (member) {
        setSheetMember({ ...member, allMembers: members });
        setSheetOpen(true);
      }
    },
    [members]
  );

  // Inject onShowDetails into each node's data
  const nodesWithHandler = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onShowDetails: () => {
        const member = members.find((m) => m.id === node.id);
        if (member) {
          setSheetMember({ ...member, allMembers: members });
          setSheetOpen(true);
        }
      },
    },
  }));

  const resetView = useCallback(() => {
    fitView({ duration: 500, padding: 0.2 });
    setSelectedNodeId(null);
  }, [fitView, setSelectedNodeId]);

  // Add export as poster logic
  const exportAsPoster = async () => {
    setShowPoster(true);
    setTimeout(async () => {
      if (posterRef.current) {
        const htmlToImage = await import("html-to-image");
        const dataUrl = await htmlToImage.toPng(posterRef.current, {
          quality: 1.0,
        });
        const link = document.createElement("a");
        link.download = `family-tree-poster-${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowPoster(false);
      }
    }, 100);
  };

  // Show page loader while initial loading
  if (loading && members.length === 0) {
    return <PageLoader text="Loading family tree..." />;
  }

  // Show error state
  if (error && members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Family Tree
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <Header
        treeName={treeData?.name}
        createdDate={treeData?.createdAt}
        onResetView={resetView}
        extraActions={
          <Button onClick={exportAsPoster} variant="outline" size="sm">
            Export as Poster
          </Button>
        }
        viewOnly={true}
        onShareOpen={() => setIsSidebarCollapsed(true)}
      />

      <Button
        variant="outline"
        size="icon"
        className="absolute top-20 left-4 z-20"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </Button>

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        members={members}
        selectedMember={selectedMember ?? null}
        onAddMember={() => setIsAddModalOpen(true)}
        onEditMember={openEditModal}
        onDeleteMember={deleteMember}
        edges={edges}
      />

      <TreeCanvas
        nodes={nodesWithHandler}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        reactFlowRef={reactFlowRef}
        showInfo={showInfo}
      />

      {/* Loading overlay for operations */}
      {loading && members.length > 0 && (
        <Loader variant="overlay" text="Processing..." />
      )}

      <MemberDetailSheet
        open={sheetOpen}
        member={sheetMember}
        onClose={() => setSheetOpen(false)}
        onEdit={(member) => {
          setEditingMember(member);
          setIsEditModalOpen(true);
          setSheetOpen(false);
        }}
        onDelete={(memberId) => {
          deleteMember(memberId);
          setSheetOpen(false);
        }}
      />

      <AddEditMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (formData: FormData) => {
          await addMember(formData);
        }}
        memberData={newMember}
        setMemberData={setNewMember}
        allMembers={members}
        validation={validation}
        isEditMode={false}
        loading={loading}
      />

      <AddEditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (formData: FormData) => {
          if (editingMember) {
            await editMember(editingMember.id, formData);
          }
        }}
        memberData={editingMember}
        setMemberData={setEditingMember}
        allMembers={members}
        validation={validation}
        isEditMode={true}
        loading={loading}
      />

      {/* Hidden poster for export */}
      {showPoster && (
        <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1 }}>
          <ExportPoster
            nodes={nodes}
            edges={edges}
            treeName={"The Family Tree"}
            updatedDate={new Date().toISOString()}
            ref={posterRef}
          />
        </div>
      )}
    </div>
  );
}

export default function DemotreePage() {
  return (
    <ReactFlowProvider>
      <DemotreeContent />
    </ReactFlowProvider>
  );
}
