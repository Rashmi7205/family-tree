import { FC, RefObject } from "react";
import ReactFlow, {
  Background,
  Controls,
  OnNodesChange,
  OnEdgesChange,
  Node,
  Edge,
  ReactFlowProvider,
  NodeTypes,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import StyledCardNode from "./StyledCardNode";
import { useTheme } from "next-themes";

const nodeTypes: NodeTypes = {
  familyMember: StyledCardNode,
};

interface TreeCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick: (event: any, node: Node) => void;
  reactFlowRef: RefObject<HTMLDivElement>;
  showInfo: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
}

export const TreeCanvas: FC<TreeCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  reactFlowRef,
  showInfo,
  nodesDraggable = false,
  nodesConnectable = false,
  elementsSelectable = false,
}) => {
  const { resolvedTheme } = useTheme();
  // Use resolvedTheme to ensure correct color
  const parentEdgeColor = resolvedTheme === "light" ? "#2563eb" : "#FFFFFF"; // blue-600 for parent-child
  // Map edges to override parent-child color
  const displayEdges = edges.map((edge) => {
    if (edge.id.startsWith("parent-")) {
      return {
        ...edge,
        style: {
          ...(edge.style || {}),
          stroke: parentEdgeColor,
          strokeWidth: 2,
        },
      };
    }
    return edge;
  });
  return (
    <div className="w-full h-full" ref={reactFlowRef}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          nodesDraggable={nodesDraggable}
          nodesConnectable={nodesConnectable}
          elementsSelectable={elementsSelectable}
          fitView
          fitViewOptions={{ padding: 0.4, minZoom: 0.2, maxZoom: 1 }}
          minZoom={0.1}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: parentEdgeColor, strokeWidth: 2 },
          }}
        >
          <Background color="#3405a3" gap={16} />
          <Controls />
          {showInfo && (
            <Panel
              position="bottom-right"
              className="hidden md:block bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs"
            >
              <h3 className="font-semibold text-sm mb-2">Graph Legend</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-600"></div>
                  <span>Parent → Child</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-pink-500 border-dashed border-white"></div>
                  <span>Spouse</span>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
