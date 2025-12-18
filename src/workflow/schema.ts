import { z } from "zod";

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const MeasuredSchema = z
  .object({
    width: z.number(),
    height: z.number(),
  })
  .partial()
  .optional();

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: PositionSchema,
  data: z.record(z.string(), z.any()).default({}),
  measured: MeasuredSchema,
});

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const WorkflowSchema = z.object({
  version: z.number(),
  exportedAt: z.string().refine(
    (s) => !Number.isNaN(Date.parse(s)),
    { message: "exportedAt must be an ISO date string" }
  ),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowNode = z.infer<typeof NodeSchema>;
export type WorkflowEdge = z.infer<typeof EdgeSchema>;


