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
  const [customPositions, setCustomPositions] = useState<
    Array<{ memberId: string; x: number; y: number }>
  >([]);
  const [isUsingCustomPositions, setIsUsingCustomPositions] = useState(false);
  const [savingPositions, setSavingPositions] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load custom positions from tree data
  const loadCustomPositions = useCallback((treeData: any) => {
    if (treeData.nodePositions && treeData.nodePositions.length > 0) {
      setCustomPositions(treeData.nodePositions);
      setIsUsingCustomPositions(true);
    } else {
      setCustomPositions([]);
      setIsUsingCustomPositions(false);
    }
  }, []);

  // Fetch members from API
  const refreshMembers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();

      // Fetch family tree data (includes nodePositions)
      const treeRes = await fetch(`/api/family-trees/${treeId}`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!treeRes.ok) throw new Error("Failed to fetch family tree");
      const treeData = await treeRes.json();

      // Load custom positions if they exist
      loadCustomPositions(treeData);

      // Fetch members
      const membersRes = await fetch(`/api/family-trees/${treeId}/members`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!membersRes.ok) throw new Error("Failed to fetch members");
      const membersData = await membersRes.json();
      setMembers(membersData);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [treeId, user, loadCustomPositions]);

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

  // Track node position changes and log them
  const onNodesChangeWithLogging = useCallback(
    (changes: any) => {
      onNodesChange(changes);

      // After applying changes, log all current node positions
      setTimeout(() => {
        const currentNodes = nodes.map((node) => ({
          id: node.id,
          position: node.position,
          data: node.data,
        }));

      }, 0);
    },
    [onNodesChange, nodes]
  );

  // Utility function to manually log current positions (can be called from console)
  const logCurrentPositions = useCallback(() => {

    // Also log as JSON for easy copying
    const positions = nodes.map((node) => ({
      id: node.id,
      name: `${node.data.firstName} ${node.data.lastName}`,
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
    }));
  }, [nodes]);


  const graphData = useMemo(() => {
    // If using custom positions, use them directly
    if (isUsingCustomPositions && customPositions.length > 0) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // Build nodes with custom positions
      members.forEach((member) => {
        const customPos = customPositions.find(
          (pos) => pos.memberId === member.id
        );
        if (customPos) {
          // Use custom position
          newNodes.push({
            id: member.id,
            type: "familyMember",
            data: { ...member, isSelected: false },
            position: { x: customPos.x, y: customPos.y },
            draggable: true,
          });
        } else {
          // Fallback: use auto-layout for members without custom positions
          // This ensures all members are positioned even if some don't have custom positions
          const fallbackX = newNodes.length * 300; // Simple fallback positioning
          const fallbackY = 0;
          newNodes.push({
            id: member.id,
            type: "familyMember",
            data: { ...member, isSelected: false },
            position: { x: fallbackX, y: fallbackY },
            draggable: true,
          });
        }
      });

      // Build edges
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
            style: {
              stroke: "#ec4899",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            },
          });
          spouseEdges.add(`${member.id}-${member.spouseId}`);
          spouseEdges.add(`${member.spouseId}-${member.id}`);
        }
      });

      return { nodes: newNodes, edges: newEdges };
    }


    // --- CONFIGURABLE SPACING ---
    const spacingX = 520;
    const spacingY = 320;
    const coupleSpacing = 280;
    const canvasCenter = 0;

    // --- 1. Build member and couple maps ---
    const memberMap = new Map(members.map((m) => [m.id, m]));
    const coupleMap = new Map<string, string>(); // memberId -> spouseId
    members.forEach((member) => {
      if (member.spouseId) {
        coupleMap.set(member.id, member.spouseId);
        coupleMap.set(member.spouseId, member.id);
      }
    });
    function getCoupleKey(id: string) {
      const spouseId = coupleMap.get(id);
      return spouseId ? [id, spouseId].sort().join("-") : id;
    }

    // --- 2. Assign Generations (bottom-up, leaves at Y=0) ---
    const generationMap = new Map<string, number>();
    function assignGeneration(id: string, visited = new Set<string>()): number {
      if (visited.has(id)) return 0;
      visited.add(id);
      const member = memberMap.get(id);
      // If no children, generation is 0
      const children = members.filter(
        (m) => m.parents && m.parents.includes(id)
      );
      let maxGen = 0;
      for (const child of children) {
        const childGen = assignGeneration(child.id, visited);
        if (childGen + 1 > maxGen) maxGen = childGen + 1;
      }
      generationMap.set(id, maxGen);
      const spouseId = coupleMap.get(id);
      if (spouseId) generationMap.set(spouseId, maxGen);
      return maxGen;
    }
    // Assign generations for all members
    members.forEach((m) => assignGeneration(m.id));

    // --- 3. Build sibling groups for each generation ---
    const siblingsByGen = new Map<number, string[][]>();
    for (const [id, gen] of generationMap.entries()) {
      if (!siblingsByGen.has(gen)) siblingsByGen.set(gen, []);
    }
    // Group siblings (including spouse's siblings) for each generation
    const handled = new Set<string>();
    for (const [id, gen] of generationMap.entries()) {
      if (handled.has(id)) continue;
      const member = memberMap.get(id);
      if (!member) continue; // Skip if member not found

      // Sibling group: all members with the same parents and generation
      let siblings = members
        .filter((m) => {
          if (!m.parents || !member.parents) return false;
          if (m.parents.length !== member.parents.length) return false;
          if (!m.parents.every((p) => member.parents.includes(p))) return false;
          return generationMap.get(m.id) === gen;
        })
        .map((m) => m.id);
      // If in a couple, add spouse and their siblings
      const spouseId = coupleMap.get(id);
      if (spouseId) {
        const spouse = memberMap.get(spouseId);
        if (spouse) {
          const spouseSiblings = members
            .filter(
              (m) =>
                m.parents &&
                spouse.parents &&
                m.parents.length === spouse.parents.length &&
                m.parents.every((p) => spouse.parents.includes(p)) &&
                generationMap.get(m.id) === gen
            )
            .map((m) => m.id);
          siblings = Array.from(
            new Set([...siblings, ...spouseSiblings, spouseId])
          );
        }
      }
      siblings.forEach((sid) => handled.add(sid));
      siblingsByGen.get(gen)!.push(siblings);
    }

    // --- 4. Recursive X-positioning ---
    const nodePositions = new Map<string, { x: number; y: number }>();
    const maxGen = Math.max(...Array.from(generationMap.values()));
    function layoutGroup(
      siblingGroup: string[],
      gen: number,
      xStart: number
    ): number {
      let xCursor = xStart;
      const units: string[][] = [];
      const handled = new Set<string>();
      siblingGroup.forEach((id) => {
        if (handled.has(id)) return;
        const spouseId = coupleMap.get(id);
        if (
          spouseId &&
          siblingGroup.includes(spouseId) &&
          !handled.has(spouseId)
        ) {
          units.push([id, spouseId]);
          handled.add(id);
          handled.add(spouseId);
        } else {
          units.push([id]);
          handled.add(id);
        }
      });
      // For each unit, recursively layout their children (if any)
      const childCenters: number[] = [];
      units.forEach((unit) => {
        // Find all children of this unit (as a couple)
        let children: string[] = [];
        unit.forEach((id) => {
          children.push(
            ...members
              .filter((m) => m.parents && m.parents.includes(id))
              .map((m) => m.id)
          );
        });
        children = Array.from(new Set(children));
        // If children exist, layout their sibling group recursively
        let centerX = xCursor;
        if (children.length > 0) {
          // Find the sibling group for these children
          const childGen = gen - 1;
          const childGroups = siblingsByGen.get(childGen) || [];
          const group = childGroups.find((g) =>
            children.some((c) => g.includes(c))
          );
          if (group) {
            centerX = layoutGroup(group, childGen, xCursor);
          }
        }
        // Place the unit at centerX
        const y = (maxGen - gen) * spacingY;
        if (unit.length === 2) {
          nodePositions.set(unit[0], {
            x: centerX - coupleSpacing / 2,
            y,
          });
          nodePositions.set(unit[1], {
            x: centerX + coupleSpacing / 2,
            y,
          });
        } else {
          nodePositions.set(unit[0], { x: centerX, y });
        }
        childCenters.push(centerX);
        xCursor = centerX + spacingX;
      });
      // Center the group horizontally
      if (childCenters.length > 0) {
        const minX = Math.min(...childCenters);
        const maxX = Math.max(...childCenters);
        const groupCenter = (minX + maxX) / 2;
        const shift = canvasCenter - groupCenter;
        siblingGroup.forEach((id) => {
          const pos = nodePositions.get(id);
          if (pos) nodePositions.set(id, { x: pos.x + shift, y: pos.y });
          const spouseId = coupleMap.get(id);
          if (spouseId) {
            const spos = nodePositions.get(spouseId);
            if (spos)
              nodePositions.set(spouseId, { x: spos.x + shift, y: spos.y });
          }
        });
      }
      // Return the center X of this group
      return childCenters.length > 0
        ? (Math.min(...childCenters) + Math.max(...childCenters)) / 2
        : xCursor;
    }
    // Start layout from the topmost generation
    const topGen = Math.max(...Array.from(generationMap.values()));
    const topGroups = siblingsByGen.get(topGen) || [];
    let xStart = 0;
    topGroups.forEach((group) => {
      xStart = layoutGroup(group, topGen, xStart);
      xStart += spacingX;
    });

    // --- 5. Ensure all members are positioned (fix missing nodes like 'rohit') ---
    // For each generation, find unpositioned members and place them at the next available X
    const positionedIds = new Set(Array.from(nodePositions.keys()));
    for (const [id, gen] of generationMap.entries()) {
      if (!positionedIds.has(id)) {
        // Find the next available X in this generation
        const others = Array.from(nodePositions.entries())
          .filter(([_, pos]) => pos.y === (maxGen - gen) * spacingY)
          .map(([_, pos]) => pos.x);
        let x = 0;
        if (others.length > 0) {
          x = Math.max(...others) + spacingX;
        }
        nodePositions.set(id, { x, y: (maxGen - gen) * spacingY });
      }
    }

    // --- 6. Build Nodes ---
    const newNodes: Node[] = [];
    members.forEach((member) => {
      const pos = nodePositions.get(member.id);
      if (!pos) return;
      newNodes.push({
        id: member.id,
        type: "familyMember",
        data: { ...member, isSelected: false },
        position: pos,
        draggable: true,
      });
    });

    // --- 7. Build Edges ---
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
  }, [members, isUsingCustomPositions, customPositions]);

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
      // A spouse cannot be a spouse already
      if (memberInModal.spouseId === spouseId) return false;
      return true;
    },
    [memberInModal, members, isEditModalOpen, editingMember]
  );

  // Save custom node positions
  const saveCustomPositions = useCallback(async () => {
    if (!user) return;
    setSavingPositions(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const positions = nodes.map((node) => ({
        memberId: node.id,
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      }));

      const res = await fetch(`/api/family-trees/${treeId}/save-positions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nodePositions: positions }),
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "Failed to save positions");
      }

      setCustomPositions(positions);
      setIsUsingCustomPositions(true);
      toast({
        title: "Success",
        description: "Custom layout saved successfully.",
      });
    } catch (err: any) {
      console.error("Error in saveCustomPositions:", err);
      setError(err.message || "Unknown error");
      toast({
        title: "Error saving layout",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingPositions(false);
    }
  }, [treeId, user, nodes, toast]);

  // Reset to auto layout
  const resetToAutoLayout = useCallback(() => {
    setIsUsingCustomPositions(false);
    setCustomPositions([]);
    toast({
      title: "Layout Reset",
      description: "Tree layout has been reset to automatic positioning.",
    });
  }, [toast]);

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
    onNodesChange: onNodesChangeWithLogging,
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
    customPositions,
    isUsingCustomPositions,
    setCustomPositions,
    setIsUsingCustomPositions,
    savingPositions,
    setSavingPositions,
    saveCustomPositions,
    loadCustomPositions,
    resetToAutoLayout,
  };
};

export const usePublicFamilyTree = (treeId: string) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customPositions, setCustomPositions] = useState<
    Array<{ memberId: string; x: number; y: number }>
  >([]);
  const [isUsingCustomPositions, setIsUsingCustomPositions] = useState(false);

  // Load custom positions from tree data
  const loadCustomPositions = useCallback((treeData: any) => {
    if (treeData.nodePositions && treeData.nodePositions.length > 0) {
      setCustomPositions(treeData.nodePositions);
      setIsUsingCustomPositions(true);
    } else {
      setCustomPositions([]);
      setIsUsingCustomPositions(false);
    }
  }, []);

  // Fetch public tree data
  const refreshMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch public family tree data
      const treeRes = await fetch(`/api/family-trees/${treeId}/public`);

      if (!treeRes.ok) {
        const errorData = await treeRes.json();
        console.error("usePublicFamilyTree: API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch family tree");
      }

      const treeData = await treeRes.json();


      // Load custom positions if they exist
      loadCustomPositions(treeData);

      // Set members from the public API response
      const membersData = treeData.members || [];
      setMembers(membersData);
    } catch (err: any) {
      console.error("usePublicFamilyTree: Error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [treeId, loadCustomPositions]);

  useEffect(() => {
    if (treeId) {
      refreshMembers();
    }
  }, [treeId, refreshMembers]);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    },
    [selectedNodeId]
  );

  // Track node position changes and log them
  const onNodesChangeWithLogging = useCallback(
    (changes: any) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Generate nodes and edges from members
  useEffect(() => {
    if (members.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Create a map for quick member lookup
    const memberMap = new Map(members.map((m) => [m.id, m]));

    // Clear existing nodes and edges
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // If using custom positions, create nodes directly from saved positions
    if (isUsingCustomPositions && customPositions.length > 0) {
      // Create nodes from custom positions
      customPositions.forEach((pos) => {
        const member = memberMap.get(pos.memberId);
        if (member) {
          newNodes.push({
            id: pos.memberId,
            type: "familyMember",
            position: { x: pos.x, y: pos.y },
            data: { member },
          });
        }
      });

      // Add any members that don't have custom positions (fallback to auto-layout)
      const membersWithCustomPos = new Set(
        customPositions.map((pos) => pos.memberId)
      );
      const membersWithoutCustomPos = members.filter(
        (member) => !membersWithCustomPos.has(member.id)
      );

      if (membersWithoutCustomPos.length > 0) {

        // Use auto-layout for members without custom positions
        // Helper function to assign generation
        function assignGeneration(
          id: string,
          visited = new Set<string>()
        ): number {
          if (visited.has(id)) return 0;
          visited.add(id);

          const member = memberMap.get(id);
          if (!member) return 0;

          // If member has parents, get generation from parent + 1
          if (member.parents && member.parents.length > 0) {
            const parentGenerations = member.parents.map((parentId) =>
              assignGeneration(parentId, visited)
            );
            return Math.max(...parentGenerations) + 1;
          }

          // If member has children, get generation from child - 1
          if (member.children && member.children.length > 0) {
            const childGenerations = member.children.map((childId) =>
              assignGeneration(childId, visited)
            );
            return Math.min(...childGenerations) - 1;
          }

          // Default generation
          return 0;
        }

        // Assign generations to members without custom positions
        const generations = new Map<string, number>();
        membersWithoutCustomPos.forEach((member) => {
          generations.set(member.id, assignGeneration(member.id));
        });

        // Group members by generation
        const generationGroups = new Map<number, string[]>();
        membersWithoutCustomPos.forEach((member) => {
          const gen = generations.get(member.id) || 0;
          if (!generationGroups.has(gen)) {
            generationGroups.set(gen, []);
          }
          generationGroups.get(gen)!.push(member.id);
        });

        // Sort generations
        const sortedGenerations = Array.from(generationGroups.keys()).sort(
          (a, b) => a - b
        );

        // Layout function for a group of siblings
        function layoutGroup(
          siblingGroup: string[],
          gen: number,
          xStart: number,
          newNodes: Node[]
        ): number {
          const groupWidth =
            siblingGroup.length * 200 + (siblingGroup.length - 1) * 50;
          let currentX = xStart - groupWidth / 2;

          siblingGroup.forEach((memberId, index) => {
            const member = memberMap.get(memberId);
            if (!member) return;

            // Auto-layout
            const y = gen * 250;
            newNodes.push({
              id: memberId,
              type: "familyMember",
              position: { x: currentX, y },
              data: { member },
            });

            currentX += 250; // Space between siblings
          });

          return xStart + groupWidth / 2;
        }

        // Layout each generation for members without custom positions
        let currentX = 0;
        sortedGenerations.forEach((gen) => {
          const generationMembers = generationGroups.get(gen) || [];

          // Group siblings together
          const siblingGroups: string[][] = [];
          const processed = new Set<string>();

          generationMembers.forEach((memberId) => {
            if (processed.has(memberId)) return;

            const member = memberMap.get(memberId);
            if (!member) return;

            // Find all siblings (members with same parents)
            const siblings = generationMembers.filter((siblingId) => {
              const sibling = memberMap.get(siblingId);
              if (!sibling) return false;

              // Check if they have the same parents
              const memberParents = member.parents || [];
              const siblingParents = sibling.parents || [];

              if (memberParents.length === 0 && siblingParents.length === 0)
                return false;

              return memberParents.some((p) => siblingParents.includes(p));
            });

            siblingGroups.push(siblings);
            siblings.forEach((s) => processed.add(s));
          });

          // Handle members that weren't processed (no siblings or orphaned)
          const unprocessedMembers = generationMembers.filter(
            (memberId) => !processed.has(memberId)
          );
          if (unprocessedMembers.length > 0) {
            unprocessedMembers.forEach((memberId) => {
              const member = memberMap.get(memberId);
              if (member) {
                // Create individual node for unprocessed member
                const y = gen * 250;
                newNodes.push({
                  id: memberId,
                  type: "familyMember",
                  position: { x: currentX, y },
                  data: { member },
                });
                currentX += 250;
              }
            });
          }

          // Layout each sibling group
          siblingGroups.forEach((siblingGroup) => {
            currentX = layoutGroup(siblingGroup, gen, currentX, newNodes);
            currentX += 100; // Space between sibling groups
          });
        });
      }
    } else {
      // Use auto-layout when no custom positions are available

      // Helper function to get couple key
      function getCoupleKey(id: string) {
        const member = memberMap.get(id);
        if (!member) return null;
        if (member.spouseId) {
          const sortedIds = [id, member.spouseId].sort();
          return `couple-${sortedIds[0]}-${sortedIds[1]}`;
        }
        return `single-${id}`;
      }

      // Helper function to assign generation
      function assignGeneration(
        id: string,
        visited = new Set<string>()
      ): number {
        if (visited.has(id)) return 0;
        visited.add(id);

        const member = memberMap.get(id);
        if (!member) return 0;

        // If member has parents, get generation from parent + 1
        if (member.parents && member.parents.length > 0) {
          const parentGenerations = member.parents.map((parentId) =>
            assignGeneration(parentId, visited)
          );
          return Math.max(...parentGenerations) + 1;
        }

        // If member has children, get generation from child - 1
        if (member.children && member.children.length > 0) {
          const childGenerations = member.children.map((childId) =>
            assignGeneration(childId, visited)
          );
          return Math.min(...childGenerations) - 1;
        }

        // Default generation
        return 0;
      }

      // Assign generations to all members
      const generations = new Map<string, number>();
      members.forEach((member) => {
        generations.set(member.id, assignGeneration(member.id));
      });



      // Group members by generation
      const generationGroups = new Map<number, string[]>();
      members.forEach((member) => {
        const gen = generations.get(member.id) || 0;
        if (!generationGroups.has(gen)) {
          generationGroups.set(gen, []);
        }
        generationGroups.get(gen)!.push(member.id);
      });

      // Sort generations
      const sortedGenerations = Array.from(generationGroups.keys()).sort(
        (a, b) => a - b
      );

      // Layout function for a group of siblings
      function layoutGroup(
        siblingGroup: string[],
        gen: number,
        xStart: number,
        newNodes: Node[]
      ): number {
        const groupWidth =
          siblingGroup.length * 200 + (siblingGroup.length - 1) * 50;
        let currentX = xStart - groupWidth / 2;

        siblingGroup.forEach((memberId, index) => {
          const member = memberMap.get(memberId);
          if (!member) return;

          // Auto-layout
          const y = gen * 250;
          newNodes.push({
            id: memberId,
            type: "familyMember",
            position: { x: currentX, y },
            data: { member },
          });

          currentX += 250; // Space between siblings
        });

        return xStart + groupWidth / 2;
      }

      // Layout each generation
      let currentX = 0;
      sortedGenerations.forEach((gen) => {
        const generationMembers = generationGroups.get(gen) || [];

        // Group siblings together
        const siblingGroups: string[][] = [];
        const processed = new Set<string>();

        generationMembers.forEach((memberId) => {
          if (processed.has(memberId)) return;

          const member = memberMap.get(memberId);
          if (!member) return;

          // Find all siblings (members with same parents)
          const siblings = generationMembers.filter((siblingId) => {
            const sibling = memberMap.get(siblingId);
            if (!sibling) return false;

            // Check if they have the same parents
            const memberParents = member.parents || [];
            const siblingParents = sibling.parents || [];

            if (memberParents.length === 0 && siblingParents.length === 0)
              return false;

            return memberParents.some((p) => siblingParents.includes(p));
          });


          siblingGroups.push(siblings);
          siblings.forEach((s) => processed.add(s));
        });

        // Handle members that weren't processed (no siblings or orphaned)
        const unprocessedMembers = generationMembers.filter(
          (memberId) => !processed.has(memberId)
        );
        if (unprocessedMembers.length > 0) {
          unprocessedMembers.forEach((memberId) => {
            const member = memberMap.get(memberId);
            if (member) {
              // Create individual node for unprocessed member
              const y = gen * 250;
              newNodes.push({
                id: memberId,
                type: "familyMember",
                position: { x: currentX, y },
                data: { member },
              });
              currentX += 250;
            }
          });
        }

        // Layout each sibling group
        siblingGroups.forEach((siblingGroup) => {
          currentX = layoutGroup(siblingGroup, gen, currentX, newNodes);
          currentX += 100; // Space between sibling groups
        });
      });
    }

    // Create edges for parent-child relationships
    members.forEach((member) => {
      if (member.parents && member.parents.length > 0) {
        member.parents.forEach((parentId) => {
          const parent = memberMap.get(parentId);
          if (parent) {
            newEdges.push({
              id: `parent-${parentId}-${member.id}`,
              source: parentId,
              target: member.id,
              type: "smoothstep",
              style: { stroke: "#FFFFFF", strokeWidth: 2 },
            });
          }
        });
      }
    });

    // Create edges for spouse relationships
    const spouseEdges = new Set<string>();
    members.forEach((member) => {
      if (member.spouseId) {
        const spouse = memberMap.get(member.spouseId);
        if (spouse) {
          const edgeId = [member.id, member.spouseId].sort().join("-");
          if (!spouseEdges.has(edgeId)) {
            spouseEdges.add(edgeId);
            newEdges.push({
              id: `spouse-${edgeId}`,
              source: member.id,
              target: member.spouseId,
              type: "smoothstep",
              style: {
                stroke: "#FF69B4",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
            });
          }
        }
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [members, customPositions, isUsingCustomPositions, setNodes, setEdges]);

  const selectedMember = members.find((m) => m.id === selectedNodeId);

  return {
    members,
    nodes,
    edges,
    selectedMember,
    onNodesChange: onNodesChangeWithLogging,
    onEdgesChange,
    onNodeClick,
    loading,
    error,
    refreshMembers,
    isUsingCustomPositions,
  };
};
