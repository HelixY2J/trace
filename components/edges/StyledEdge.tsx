import { BaseEdge, getBezierPath, type EdgeProps, useReactFlow } from "@xyflow/react";

/**
 * Custom edge that colors based on the source node type:
 * - text -> magenta
 * - image/llm -> green
 * Solid smooth bezier for clarity.
 */
export default function StyledEdge(props: EdgeProps) {
  const { id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  const rf = useReactFlow();
  const sourceNode = source ? rf.getNode(source) : undefined;
  const targetNode = target ? rf.getNode(target) : undefined;
  const sourceType = sourceNode?.type;
  const targetType = targetNode?.type;
  const edge = id ? rf.getEdge(id) as any : undefined;
  const sourceHandle = edge?.sourceHandle as string | undefined;
  const targetHandle = edge?.targetHandle as string | undefined;

  const baseColor =
    sourceType === "text" ? "#d946ef" : sourceType === "image" || sourceType === "llm" ? "#22c55e" : "#94a3b8";
  const byHandles =
    (sourceHandle === "out:text" && targetHandle === "in:text") ? "#d946ef" :
    (sourceHandle === "out:image" && targetHandle === "in:image") ? "#22c55e" :
    undefined;
  const byTypes =
    sourceType === "llm" && targetType === "text" ? "#d946ef" : undefined;
  const color = byHandles ?? byTypes ?? baseColor;

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


