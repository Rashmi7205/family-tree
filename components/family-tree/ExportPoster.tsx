import React from "react";
import { Node, Edge } from "reactflow";

interface ExportPosterProps {
  nodes: Node[];
  edges: Edge[];
  treeName: string;
  updatedDate: string;
}

const genderBg: Record<string, string> = {
  male: "bg-blue-100 border-blue-200",
  female: "bg-pink-100 border-pink-200",
  other: "bg-purple-100 border-purple-200",
};

const genderText: Record<string, string> = {
  male: "text-blue-900",
  female: "text-pink-900",
  other: "text-purple-900",
};

const CARD_WIDTH = 224; // w-56
const CARD_HEIGHT = 176; // h-44

function formatDate(date: string | undefined) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim().charAt(0).toUpperCase() || "";
  const last = lastName?.trim().charAt(0).toUpperCase() || "";

  if (first && last) {
    return `${first}${last}`;
  } else if (first) {
    return first;
  } else if (last) {
    return last;
  }
  return "?";
}

const MemberCard = ({
  node,
  offset,
}: {
  node: Node;
  offset: { x: number; y: number };
}) => {
  const member = node.data.member || node.data;
  return (
    <div
      key={member.id}
      className={`flex flex-col items-center justify-center w-56 h-44 rounded-2xl border-2 ${
        genderBg[member.gender] || genderBg.other
      } shadow-md p-2 z-10`}
      style={{
        position: "absolute",
        left: node.position.x - offset.x,
        top: node.position.y - offset.y,
      }}
    >
      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-2 overflow-hidden">
        {member.profileImageUrl ? (
          <img
            src={member.profileImageUrl}
            alt={member.firstName}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-600 bg-gray-200 w-full h-full flex items-center justify-center rounded-xl">
            {getInitials(member.firstName, member.lastName)}
          </span>
        )}
      </div>
      <div className="text-center">
        <div
          className={`text-lg font-semibold ${
            genderText[member.gender] || genderText.other
          }`}
        >
          {member.firstName} {member.lastName}
        </div>
        <div className="text-sm text-gray-500 capitalize">{member.gender}</div>
        <div className="text-sm text-gray-500 mt-1">
          {formatDate(member.birthDate)}
        </div>
      </div>
    </div>
  );
};

export const ExportPoster = React.forwardRef<HTMLDivElement, ExportPosterProps>(
  ({ nodes, edges, treeName, updatedDate }, ref) => {
    if (nodes.length === 0) {
      return (
        <div ref={ref} className="p-10">
          No data to display.
        </div>
      );
    }

    let minX = Infinity,
      maxX = 0,
      minY = Infinity,
      maxY = 0;
    nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      maxX = Math.max(maxX, node.position.x + (node.width || CARD_WIDTH));
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + (node.height || CARD_HEIGHT));
    });

    const layoutWidth = maxX - minX;
    const layoutHeight = maxY - minY;
    const offset = { x: minX, y: minY };

    const PADDING = 80;

    return (
      <div
        ref={ref}
        className="w-auto inline-block flex-col items-center justify-start bg-gradient-to-br from-[#e0e7ff] via-[#fce7f3] to-[#fff] rounded-[48px] shadow-2xl p-12 font-sans"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-6xl font-extrabold text-[#162936] mb-2">
            {treeName}
          </h1>
        </div>

        <div className="bg-white/80 rounded-3xl p-4 shadow-xl flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: `${layoutWidth + PADDING}px`,
              height: `${layoutHeight + PADDING}px`,
            }}
          >
            {/* Render Edges */}
            <svg
              className="absolute top-0 left-0"
              width={layoutWidth + PADDING}
              height={layoutHeight + PADDING}
              style={{ zIndex: 1 }}
            >
              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                if (edge.type === "straight") {
                  // Spouse connection
                  const sourceRight =
                    sourceNode.position.x > targetNode.position.x;
                  const sx =
                    sourceNode.position.x -
                    offset.x +
                    (sourceRight ? 0 : CARD_WIDTH);
                  const sy = sourceNode.position.y - offset.y + CARD_HEIGHT / 2;
                  const tx =
                    targetNode.position.x -
                    offset.x +
                    (sourceRight ? CARD_WIDTH : 0);
                  const ty = targetNode.position.y - offset.y + CARD_HEIGHT / 2;
                  return (
                    <path
                      key={edge.id}
                      d={`M ${sx} ${sy} L ${tx} ${ty}`}
                      stroke="#ec4899"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  );
                }

                // Parent-child connection
                const sx = sourceNode.position.x - offset.x + CARD_WIDTH / 2;
                const sy = sourceNode.position.y - offset.y + CARD_HEIGHT;
                const tx = targetNode.position.x - offset.x + CARD_WIDTH / 2;
                const ty = targetNode.position.y - offset.y;
                const d = `M ${sx},${sy} C ${sx},${sy + 60} ${tx},${
                  ty - 60
                } ${tx},${ty}`;

                return (
                  <path
                    key={edge.id}
                    d={d}
                    stroke="#9ca3af"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              })}
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => (
              <MemberCard key={node.id} node={node} offset={offset} />
            ))}
          </div>
        </div>
        <div className="mt-8 bg-white/90 rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-8 h-8 bg-[#8CC92D] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              🌳
            </span>
            <span className="text-2xl font-bold text-[#162936]">
              {treeName}
            </span>
          </div>
          <div className="text-lg text-[#162936]/70">
            Updated: {formatDate(updatedDate)}
          </div>
        </div>
      </div>
    );
  }
);

ExportPoster.displayName = "ExportPoster";

export default ExportPoster;
