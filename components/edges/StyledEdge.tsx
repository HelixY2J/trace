import { BaseEdge, getBezierPath, type EdgeProps, useReactFlow } from "@xyflow/react";

/**
 * Custom edge that colors based on the source node type:
 * - text -> magenta
 * - image/llm -> green
 * Solid smooth bezier for clarity.
 */
export default function StyledEdge(props: EdgeProps) {
  const { id, source, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  const rf = useReactFlow();
  const sourceNode = source ? rf.getNode(source) : undefined;
  const sourceType = sourceNode?.type;

  const color =
    sourceType === "text" ? "#d946ef" : sourceType === "image" || sourceType === "llm" ? "#22c55e" : "#94a3b8";

  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{
        stroke: color,
        strokeWidth: 1.75,
        strokeLinecap: "round",
      }}
    />
  );
}


