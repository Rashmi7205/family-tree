"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useFamilyTree } from "@/components/family-tree-viewer/hooks";
import { Header } from "@/components/family-tree-viewer/Header";
import { TreeCanvas } from "@/components/family-tree-viewer/TreeCanvas";
import { AddEditMemberModal } from "@/components/family-tree-viewer/AddEditMemberModal";
import { Button } from "@/components/ui/button";
import { Loader, PageLoader } from "@/components/ui/loader";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { Download, Share2, Copy } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExportPoster from "@/components/family-tree/ExportPoster";
import { useAuth } from "@/lib/auth/auth-context";
import { Icons } from "@/components/icons";
import QR from "qr.js";

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
  const { t } = useTranslation("common");
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
                <span className="font-semibold">
                  {t("familyTreeViewer.memberDetail.bio")}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {member.bio || t("familyTreeViewer.memberDetail.noBio")}
                </p>
              </div>
              <div className="mb-2">
                <span className="font-semibold">
                  {t("familyTreeViewer.memberDetail.parents")}
                </span>
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
                    <span className="text-gray-400 text-xs ml-2">
                      {t("familyTreeViewer.memberDetail.none")}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">
                  {t("familyTreeViewer.memberDetail.children")}
                </span>
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
                    <span className="text-gray-400 text-xs ml-2">
                      {t("familyTreeViewer.memberDetail.none")}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">
                  {t("familyTreeViewer.memberDetail.spouse")}
                </span>
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
                        <span className="text-gray-400 text-xs ml-2">
                          {t("familyTreeViewer.memberDetail.none")}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="text-gray-400 text-xs ml-2">
                      {t("familyTreeViewer.memberDetail.none")}
                    </span>
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
              {t("familyTreeViewer.memberDetail.editMember")}
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              {t("familyTreeViewer.memberDetail.deleteMember")}
            </Button>
          </div>
          <SheetClose asChild>
            <Button className="mt-6 w-full">
              {t("familyTreeViewer.memberDetail.close")}
            </Button>
          </SheetClose>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("familyTreeViewer.memberDetail.deleteDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("familyTreeViewer.memberDetail.deleteDialog.description", {
                  firstName: member.firstName,
                  lastName: member.lastName,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("familyTreeViewer.memberDetail.deleteDialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(member.id);
                  setShowDeleteDialog(false);
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("familyTreeViewer.memberDetail.deleteDialog.confirm")}
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
  const { t } = useTranslation("common");
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
    saveCustomPositions,
    resetToAutoLayout,
    isUsingCustomPositions,
    savingPositions,
  } = useFamilyTree(treeId);

  const reactFlowRef = useRef<HTMLDivElement>(null);
  const { setViewport, fitView } = useReactFlow();
  const [showInfo, setShowInfo] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMember, setSheetMember] = useState<any>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  // Compute share URL for public tree view
  let shareUrl = url;
  if (url && /\/trees\/[\w-]+(?!\/public$)/.test(url)) {
    // If on a /trees/[id] page but not already /public, append /public
    if (!url.endsWith("/public")) {
      shareUrl = url.replace(/(\/trees\/[\w-]+)(\/public)?$/, "$1/public");
    }
  }

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
        const token = await user?.getIdToken();
        const res = await fetch(`/api/family-trees/${treeId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
  const exportAsPoster = () => {
    setShowPoster(true);
    setExporting(true);
  };

  useEffect(() => {
    if (showPoster && posterRef.current) {
      const exportPoster = async () => {
        try {
          // Wait for images to load, replace broken images with a placeholder
          const images = posterRef.current?.querySelectorAll("img") || [];
          await Promise.all(
            Array.from(images).map((img) =>
              img.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = () => {
                      img.src = "/placeholder.svg";
                      resolve();
                    };
                  })
            )
          );
          const htmlToImage = await import("html-to-image");
          const dataUrl = await htmlToImage.toPng(posterRef.current!, {
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
        } catch (err) {
          alert(t("familyTreeViewer.export.failed"));
          console.error(err);
        } finally {
          setShowPoster(false);
          setExporting(false);
        }
      };
      exportPoster();
    }
  }, [showPoster]);

  // Show page loader while initial loading
  if (loading && members.length === 0) {
    return <PageLoader text={t("familyTreeViewer.loading")} />;
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
            {t("familyTreeViewer.error.title")}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {t("familyTreeViewer.error.tryAgain")}
          </Button>
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
          <>
            {/* Share Button - Icon only on desktop */}
            <Button
              onClick={() => setShareOpen(true)}
              variant="outline"
              size="icon"
              className="h-10 w-10 min-w-[44px] min-h-[44px] hidden md:flex"
              title={t("familyTreeViewer.actions.share")}
            >
              <Share2 className="h-5 w-5" />
            </Button>

            {/* Share Button - With text on mobile */}
            <Button
              onClick={() => setShareOpen(true)}
              variant="outline"
              size="sm"
              className="md:hidden"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t("familyTreeViewer.actions.share")}
            </Button>

            {/* Export Button - Icon only on desktop */}
            <Button
              onClick={exportAsPoster}
              variant="outline"
              size="icon"
              className="h-10 w-10 min-w-[44px] min-h-[44px] hidden md:flex"
              title={t("familyTreeViewer.export.title")}
              disabled={exporting}
            >
              <Download className="h-5 w-5" />
            </Button>

            {/* Export Button - With text on mobile */}
            <Button
              onClick={exportAsPoster}
              variant="outline"
              size="sm"
              className="md:hidden"
              disabled={exporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("familyTreeViewer.export.title")}
            </Button>
          </>
        }
        viewOnly={false}
        onShareOpen={() => {}}
        onSaveLayout={saveCustomPositions}
        onResetLayout={resetToAutoLayout}
        isUsingCustomPositions={isUsingCustomPositions}
        savingPositions={savingPositions}
        members={members}
        edges={edges}
        selectedMember={selectedMember}
        onAddMember={() => setIsAddModalOpen(true)}
        onEditMember={openEditModal}
        onDeleteMember={deleteMember}
      />

      <TreeCanvas
        nodes={nodesWithHandler}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        reactFlowRef={reactFlowRef}
        showInfo={showInfo}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      />

      {/* Loading overlay for operations */}
      {loading && members.length > 0 && (
        <Loader
          variant="overlay"
          text={t("familyTreeViewer.export.processing")}
        />
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

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-sm w-full p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-green-600" />{" "}
              {t("familyTreeViewer.share.title")}
            </DialogTitle>
          </DialogHeader>
          <ShareDialogContent url={shareUrl} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Share Dialog Content Component
const ShareDialogContent = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation("common");
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
          {copied
            ? t("familyTreeViewer.share.copied")
            : t("familyTreeViewer.share.copyLink")}
        </Button>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 my-2 w-full" />
      <div className="px-4 flex flex-col items-center gap-1 w-full">
        <span className="text-xs text-gray-500">
          {t("familyTreeViewer.share.shareVia")}
        </span>
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
        {t("familyTreeViewer.share.anyoneWithLink")}
      </div>
    </div>
  );
};

export function PointerEventsCleanup() {
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

export default function DemotreePage() {
  return (
    <ReactFlowProvider>
      <PointerEventsCleanup />
      <DemotreeContent />
    </ReactFlowProvider>
  );
}
