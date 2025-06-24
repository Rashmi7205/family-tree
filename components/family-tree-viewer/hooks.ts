import { useState, useCallback, useMemo, useEffect } from "react";
import { Edge, Node, useNodesState, useEdgesState } from "reactflow";
import { FamilyMember, FamilyMemberNode } from "./types";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";

export const useFamilyTree = (treeId: string) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState<
    Omit<FamilyMember, "id" | "familyTreeId">
  >({
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    parents: [],
    bio: "",
    children: [],
    spouseId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch members from API
  const refreshMembers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/family-trees/${treeId}/members`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [treeId, user]);

  useEffect(() => {
    if (treeId && user) {
      refreshMembers();
    }
  }, [treeId, user, refreshMembers]);

  // Add member
  const addMember = useCallback(
    async (formData: FormData) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const headers = new Headers();
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }

        const res = await fetch(`/api/family-trees/${treeId}/members`, {
          method: "POST",
          headers,
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to add member");
        }
        await refreshMembers();
        setIsAddModalOpen(false);
        setNewMember({
          firstName: "",
          lastName: "",
          gender: "male",
          birthDate: "",
          parents: [],
          children: [],
          spouseId: null,
          bio: "",
        });
        toast({
          title: "Success",
          description: "Family member added successfully.",
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast({
          title: "Error adding member",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [treeId, user, refreshMembers, toast]
  );

  // Edit member
  const editMember = useCallback(
    async (memberId: string, formData: FormData) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const headers = new Headers();
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }
        const res = await fetch(
          `/api/family-trees/${treeId}/members/${memberId}`,
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update member");
        }
        await refreshMembers();
        setIsEditModalOpen(false);
        setEditingMember(null);
        toast({
          title: "Success",
          description: "Family member updated successfully.",
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast({
          title: "Error updating member",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [treeId, user, refreshMembers, toast]
  );

  // Delete member
  const deleteMember = useCallback(
    async (memberId: string) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `/api/family-trees/${treeId}/members/${memberId}`,
          {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to delete member");
        }
        await refreshMembers();
        setSelectedNodeId(null);
        toast({
          title: "Success",
          description: "Family member deleted successfully.",
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast({
          title: "Error deleting member",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [treeId, user, refreshMembers, toast]
  );

  const openEditModal = useCallback((member: FamilyMember) => {
    setEditingMember({ ...member });
    setIsEditModalOpen(true);
  }, []);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    },
    [selectedNodeId]
  );

  const graphData = useMemo(() => {
    // --- CONFIGURABLE SPACING ---
    const spacingX = 520; // Horizontal space between couples
    const spacingY = 320; // Vertical space between generations
    const spouseOffset = 280; // Space between spouses in a couple

    // --- 1. Build Couple Groups ---
    // Each couple is a unique node for layout purposes
    // coupleId: sorted concatenation of both member ids (or just member id if single)
    const couples = new Map<
      string,
      { members: string[]; generation: number }
    >();
    const memberToCouple = new Map<string, string>();
    const memberMap = new Map(members.map((m) => [m.id, m]));

    // Helper: get couple id for a member
    function getCoupleId(member: FamilyMember) {
      return member.spouseId
        ? [member.id, member.spouseId].sort().join("-")
        : member.id;
    }

    // Helper: find generation for a member recursively
    function findGeneration(
      memberId: string,
      visited = new Set<string>()
    ): number {
      if (visited.has(memberId)) return 0;
      visited.add(memberId);
      const member = memberMap.get(memberId);
      if (!member || !member.parents.length) return 0;
      const parentLevels = member.parents.map((pid) =>
        findGeneration(pid, visited)
      );
      return Math.max(...parentLevels) + 1;
    }

    // Build couples and assign generation
    members.forEach((member) => {
      const coupleId = getCoupleId(member);
      memberToCouple.set(member.id, coupleId);
      if (!couples.has(coupleId)) {
        couples.set(coupleId, {
          members: [],
          generation: findGeneration(member.id),
        });
      }
      couples.get(coupleId)!.members.push(member.id);
    });

    // --- 2. Group Couples by Generation ---
    const generationCouples = new Map<number, string[]>();
    couples.forEach((couple, coupleId) => {
      if (!generationCouples.has(couple.generation)) {
        generationCouples.set(couple.generation, []);
      }
      generationCouples.get(couple.generation)!.push(coupleId);
    });

    // --- 3. Assign Positions to Couples ---
    // couplePositions: coupleId -> { x, y }
    const couplePositions = new Map<string, { x: number; y: number }>();
    const memberPositions = new Map<string, { x: number; y: number }>();

    // Place root generation (generation 0) couples horizontally
    const rootCouples = generationCouples.get(0) || [];
    rootCouples.forEach((coupleId, i) => {
      couplePositions.set(coupleId, { x: i * spacingX, y: 0 });
    });

    // Place subsequent generations with minimum spacing
    const maxGeneration = Math.max(...Array.from(generationCouples.keys()));
    for (let gen = 1; gen <= maxGeneration; gen++) {
      const couplesInGen = generationCouples.get(gen) || [];
      // 1. Calculate desired x for each couple (centered under parents)
      const desiredXs: { coupleId: string; x: number }[] = couplesInGen.map(
        (coupleId) => {
          const couple = couples.get(coupleId)!;
          let parentCoupleCenters: number[] = [];
          couple.members.forEach((mid) => {
            const member = memberMap.get(mid);
            if (member && member.parents.length) {
              member.parents.forEach((pid) => {
                const parentCoupleId = memberToCouple.get(pid);
                const parentPos = parentCoupleId
                  ? couplePositions.get(parentCoupleId)
                  : undefined;
                if (parentPos) parentCoupleCenters.push(parentPos.x);
              });
            }
          });
          let x = 0;
          if (parentCoupleCenters.length) {
            x =
              parentCoupleCenters.reduce((a, b) => a + b, 0) /
              parentCoupleCenters.length;
          }
          return { coupleId, x };
        }
      );

      // 2. Sort by desired x
      desiredXs.sort((a, b) => a.x - b.x);

      // 3. Adjust to maintain minimum spacingX and optionally center the generation
      let xs: number[] = [];
      let lastX: number | null = null;
      desiredXs.forEach((item, i) => {
        let x = item.x;
        if (lastX !== null && x < lastX + spacingX) {
          x = lastX + spacingX;
        }
        xs.push(x);
        couplePositions.set(item.coupleId, { x, y: gen * spacingY });
        lastX = x;
      });

      // Optionally center the generation horizontally
      if (xs.length > 0) {
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const centerOffset = (minX + maxX) / 2;
        const desiredCenter = 0; // Change this to your canvas center if needed
        const shift = desiredCenter - centerOffset;
        // Shift all couples in this generation
        desiredXs.forEach((item) => {
          const pos = couplePositions.get(item.coupleId);
          if (pos) {
            couplePositions.set(item.coupleId, { x: pos.x + shift, y: pos.y });
          }
        });
      }
    }

    // --- 4. Assign Positions to Members (within their couple) ---
    couples.forEach((couple, coupleId) => {
      const base = couplePositions.get(coupleId)!;
      if (couple.members.length === 1) {
        // Single member (no spouse)
        memberPositions.set(couple.members[0], { x: base.x, y: base.y });
      } else {
        // Two spouses: offset left/right
        memberPositions.set(couple.members[0], {
          x: base.x - spouseOffset / 2,
          y: base.y,
        });
        memberPositions.set(couple.members[1], {
          x: base.x + spouseOffset / 2,
          y: base.y,
        });
      }
    });

    // --- 5. Build Nodes ---
    const newNodes: Node[] = [];
    members.forEach((member) => {
      const pos = memberPositions.get(member.id);
      if (!pos) return;
      newNodes.push({
        id: member.id,
        position: pos,
        data: { ...member, isSelected: false },
        type: "familyMember",
      });
    });

    // --- 6. Build Edges ---
    const newEdges: Edge[] = [];
    // Parent-child edges
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
    // Spouse edges
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
  }, [members]);

  useEffect(() => {
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
  }, [graphData, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, isSelected: node.id === selectedNodeId },
      }))
    );
  }, [selectedNodeId, setNodes]);

  const selectedMember = selectedNodeId
    ? members.find((m) => m.id === selectedNodeId)
    : null;

  const memberInModal = isEditModalOpen ? editingMember : newMember;

  // Validation for relationship selection
  const isValidParent = useCallback(
    (parentId: string) => {
      if (!memberInModal) return false;
      if (isEditModalOpen && parentId === editingMember?.id) return false;
      // A parent cannot already be a child or the spouse
      if (memberInModal.children.includes(parentId)) return false;
      if (memberInModal.spouseId === parentId) return false;
      // Sibling check: parent cannot be a sibling
      const parentMember = members.find((m) => m.id === parentId);
      if (parentMember && memberInModal.parents.length > 0) {
        const sharedParents = memberInModal.parents.filter((p) =>
          parentMember.parents.includes(p)
        );
        if (sharedParents.length > 0) return false;
      }
      // A parent cannot be a child
      if (memberInModal.parents.includes(parentId)) return false;
      return true;
    },
    [memberInModal, isEditModalOpen, editingMember, members]
  );
  const isValidChild = useCallback(
    (childId: string) => {
      if (!memberInModal) return false;
      if (isEditModalOpen && childId === editingMember?.id) return false;
      // A child cannot already be a parent or the spouse
      if (memberInModal.parents.includes(childId)) return false;
      if (memberInModal.spouseId === childId) return false;
      // Sibling check: child cannot be a sibling
      const childMember = members.find((m) => m.id === childId);
      if (childMember && memberInModal.parents.length > 0) {
        const sharedParents = memberInModal.parents.filter((p) =>
          childMember.parents.includes(p)
        );
        if (sharedParents.length > 0) return false;
      }
      // A child cannot be a parent
      if (memberInModal.children.includes(childId)) return false;
      return true;
    },
    [memberInModal, isEditModalOpen, editingMember, members]
  );
  const isValidSpouse = useCallback(
    (spouseId: string) => {
      if (!memberInModal) return true;
      if (isEditModalOpen && spouseId === editingMember?.id) return false;
      // A spouse cannot be a parent or child
      if (
        memberInModal.parents.includes(spouseId) ||
        memberInModal.children.includes(spouseId)
      )
        return false;
      // Sibling check: spouse cannot be a sibling
      const potentialSpouse = members.find((m) => m.id === spouseId);
      if (potentialSpouse && memberInModal.parents.length > 0) {
        const sharedParents = memberInModal.parents.filter((p) =>
          potentialSpouse.parents.includes(p)
        );
        if (sharedParents.length > 0) return false;
      }
      // A spouse cannot be a sibling (if they share at least one parent)
      if (
        potentialSpouse &&
        potentialSpouse.parents.length > 0 &&
        memberInModal.parents.length > 0
      ) {
        const sharedParents = potentialSpouse.parents.filter((p) =>
          memberInModal.parents.includes(p)
        );
        if (sharedParents.length > 0) return false;
      }
      // A spouse cannot be a spouse already
      if (memberInModal.spouseId === spouseId) return false;
      return true;
    },
    [memberInModal, members, isEditModalOpen, editingMember]
  );

  return {
    members,
    nodes,
    edges,
    selectedNodeId,
    selectedMember,
    isAddModalOpen,
    isEditModalOpen,
    editingMember,
    newMember,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    setMembers,
    setNewMember,
    setEditingMember,
    setIsAddModalOpen,
    setIsEditModalOpen,
    addMember,
    editMember,
    deleteMember,
    openEditModal,
    setSelectedNodeId,
    refreshMembers,
    loading,
    error,
    validation: { isValidParent, isValidChild, isValidSpouse },
  };
};
