"use client";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  Panel,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import domtoimage from "dom-to-image-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StyledCardNode from "@/components/family-tree-viewer/StyledCardNode";
import {
  Users,
  GitBranch,
  Network,
  RotateCcw,
  Info,
  Eye,
  EyeOff,
  Download,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Header } from "@/components/family-tree-viewer/Header";
import { Sidebar } from "@/components/family-tree-viewer/Sidebar";
import { TreeCanvas } from "@/components/family-tree-viewer/TreeCanvas";
import ExportPoster from "@/components/family-tree/ExportPoster";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { FamilyMember } from "@/components/family-tree-viewer/types";
import { Loader, PageLoader } from "@/components/ui/loader";

const nodeTypes = {
  familyMember: StyledCardNode,
};

function MemberDetailSheetViewOnly({
  open,
  member,
  onClose,
}: {
  open: boolean;
  member:
    | (FamilyMember & { allMembers?: FamilyMember[]; profileImageUrl?: string })
    | null;
  onClose: () => void;
}) {
  if (!member) return null;
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
            <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-gray-200">
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-500">
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
                        (m: FamilyMember) => m.id === pid
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
                        (m: FamilyMember) => m.id === cid
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
                        (m: FamilyMember) => m.id === member.spouseId
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
          <SheetClose asChild>
            <Button className="mt-6 w-full">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PublicTreeViewer({ treeId }: { treeId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const { setViewport } = useReactFlow();
  const { user } = useAuth();
  const [showPoster, setShowPoster] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMember, setSheetMember] = useState<any>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/family-trees/${treeId}/public`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tree data");
        }
        const data = await res.json();
        setTreeData(data);
        setMembers(data.members || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (treeId) {
      fetchTree();
    }
  }, [treeId]);

  const graphData = useMemo(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const couples = new Map<string, string>();
    const coupleMembers = new Map<string, string[]>();

    members.forEach((member) => {
      const coupleId = member.spouseId
        ? [member.id, member.spouseId].sort().join("-")
        : member.id;
      couples.set(member.id, coupleId);
      if (!coupleMembers.has(coupleId)) {
        coupleMembers.set(coupleId, []);
      }
      coupleMembers.get(coupleId)!.push(member.id);
    });

    const generationMap = new Map<string, number>();
    const findGeneration = (
      memberId: string,
      visited = new Set<string>()
    ): number => {
      if (visited.has(memberId)) return 0;
      visited.add(memberId);
      const member = members.find((m) => m.id === memberId);
      if (!member || !member.parents.length) return 0;
      const parentLevels = member.parents.map((pid) =>
        findGeneration(pid, visited)
      );
      return Math.max(...parentLevels) + 1;
    };

    coupleMembers.forEach((membersInCouple, coupleId) => {
      const generation = Math.min(
        ...membersInCouple.map((mid) => findGeneration(mid))
      );
      generationMap.set(coupleId, generation);
    });

    const generationGroups = new Map<number, string[]>();
    generationMap.forEach((gen, coupleId) => {
      if (!generationGroups.has(gen)) {
        generationGroups.set(gen, []);
      }
      generationGroups.get(gen)!.push(coupleId);
    });

    const spacingY = 320;
    const spacingX = 500;
    const spouseOffset = 540;

    Array.from(generationGroups.entries())
      .sort(([genA], [genB]) => genA - genB)
      .forEach(([generation, coupleIds]) => {
        const y = generation * spacingY;
        coupleIds.forEach((cid, index) => {
          const couple = coupleMembers.get(cid)!;
          const totalWidth = (couple.length - 1) * spouseOffset;

          couple.forEach((mid, spouseIndex) => {
            const x =
              index * spacingX + spouseIndex * spouseOffset - totalWidth / 2;
            const currentMember = members.find((m) => m.id === mid)!;
            newNodes.push({
              id: mid,
              position: { x, y },
              data: {
                ...currentMember,
                isSelected: false,
                onShowDetails: () =>
                  setSelectedNode(selectedNode === mid ? null : mid),
              },
              type: "familyMember",
            });
          });
        });
      });

    members.forEach((member) => {
      member.parents.forEach((parentId) => {
        newEdges.push({
          id: `parent-${parentId}-${member.id}`,
          source: parentId,
          target: member.id,
          type: "smoothstep",
          style: { stroke: "#3b82f6", strokeWidth: 2 },
        });
      });
    });

    const spouseEdges = new Set<string>();
    members.forEach((member) => {
      if (
        member.spouseId &&
        !spouseEdges.has(`${member.id}-${member.spouseId}`)
      ) {
        newEdges.push({
          id: `spouse-${member.id}-${member.spouseId}`,
          source: member.id,
          target: member.spouseId,
          type: "straight",
          style: { stroke: "#ec4899", strokeWidth: 2, strokeDasharray: "5,5" },
        });
        spouseEdges.add(`${member.id}-${member.spouseId}`);
        spouseEdges.add(`${member.spouseId}-${member.id}`);
      }
    });

    return { nodes: newNodes, edges: newEdges };
  }, [members, selectedNode]);

  useEffect(() => {
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
  }, [graphData, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.id === selectedNode,
        },
      }))
    );
  }, [selectedNode, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: "smoothstep" as const,
          style: {
            stroke: "#3b82f6",
            strokeWidth: 2,
          },
          animated: false,
        };

        setEdges((eds) => addEdge(newEdge, eds));
        console.log("New connection created:", params);
      }
    },
    [setEdges]
  );

  const resetView = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 500 });
    setSelectedNode(null);
  }, [setViewport]);

  const selectedMember = selectedNode
    ? members.find((m) => m.id === selectedNode)
    : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showExportMenu &&
        !(event.target as Element).closest(".export-menu")
      ) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

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

  if (loading && members.length === 0) {
    return <PageLoader text="Loading family tree..." />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <Header
        onResetView={resetView}
        treeName={treeData?.name}
        createdDate={treeData?.createdAt}
        extraActions={
          <>
            <Button onClick={exportAsPoster} variant="outline" size="sm">
              Export as Poster
            </Button>
            {!user && (
              <Button
                variant="default"
                size="sm"
                className="ml-2"
                onClick={() => (window.location.href = "/auth/signin")}
              >
                Sign in to create your tree
              </Button>
            )}
          </>
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
        {isSidebarCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
      </Button>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        members={members}
        selectedMember={sheetMember}
        onAddMember={() => {}}
        onEditMember={() => {}}
        onDeleteMember={() => {}}
        edges={edges}
        viewOnly={true}
      />
      <TreeCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onNodeClick={handleNodeClick}
        reactFlowRef={reactFlowRef}
        showInfo={showInfo}
      />
      <MemberDetailSheetViewOnly
        open={sheetOpen}
        member={sheetMember}
        onClose={() => setSheetOpen(false)}
      />
      {showPoster && (
        <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1 }}>
          <ExportPoster
            nodes={nodes}
            edges={edges}
            treeName={treeData?.name || "Family Tree"}
            updatedDate={treeData?.updatedAt || new Date().toISOString()}
            ref={posterRef}
          />
        </div>
      )}
    </div>
  );
}

export default function PublicTreePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  return (
    <ReactFlowProvider>
      <PublicTreeViewer treeId={id} />
    </ReactFlowProvider>
  );
}
