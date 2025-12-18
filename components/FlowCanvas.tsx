"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CanvasControls from "./CanvasControls";
import StyledEdge from "./edges/StyledEdge";
import TextNode from "./nodes/TextNode";
import ImageNode from "./nodes/ImageNode";
import LLMNode from "./nodes/LLMNode";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { DEFAULT_WORKFLOW } from "../src/workflow/defaultWorkflow";

/**
 * Full-viewport React Flow canvas.
 * Keeps nodes/edges local for now; provides grid, pan/zoom, minimap, controls.
 */
export type NodeKind = "text" | "image" | "llm";
export type FlowCanvasHandle = {
  addNode: (kind: NodeKind, position?: { x: number; y: number }) => void;
  exportWorkflow: () => void;
  importWorkflow: (payload: unknown) => { ok: boolean; error?: string };
  serializeWorkflow: () => { version: number; exportedAt: string; nodes: Node[]; edges: Edge[] };
};

function FlowCanvasInner(_props: unknown, ref: React.Ref<FlowCanvasHandle>) {
  const nodeTypes: NodeTypes = {
    text: TextNode as any,
    image: ImageNode as any,
    llm: LLMNode as any,
  };
  const edgeTypes = { styled: StyledEdge as any };
  const rf = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sanitize and preload workflow from src/workflow/defaultWorkflow.ts
  const initialGraph = useMemo(() => {
    const nodes: Node[] = (DEFAULT_WORKFLOW?.nodes ?? []).map((n: any) => {
      const { measured, selected, ...rest } = n || {};
      return {
        id: String(rest.id ?? crypto.randomUUID()),
        position: rest.position ?? { x: 0, y: 0 },
        type: rest.type as any,
        data: rest.data ?? {},
      } as Node;
    });
    const edges: Edge[] = (DEFAULT_WORKFLOW?.edges ?? []).map((e: any) => {
      const { selected, ...rest } = e || {};
      return {
        id: String(rest.id ?? `${rest.source}-${rest.target}`),
        source: String(rest.source),
        target: String(rest.target),
      } as Edge;
    });
    return { nodes, edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);
  const [locked, setLocked] = useState(true);
  const [panMode, setPanMode] = useState(false);
  const [zoomPct, setZoomPct] = useState(100);
  // Keep stable refs for latest nodes/edges to avoid changing hook deps
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  //  history for undo/redo
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const pushHistory = (snapshot: { nodes: Node[]; edges: Edge[] }) => {
    // Drop redo branch
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    historyIndexRef.current = historyIndexRef.current + 1;
  };
  // Seed initial history
  useEffect(() => {
    pushHistory({ nodes: initialGraph.nodes, edges: initialGraph.edges });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = (connection: Connection) => {
    setEdges((prev) => addEdge({ ...connection, type: "styled" }, prev));
  };

  // Wrap node/edge changes to capture history
  const handleNodesChange = (changes: Parameters<typeof onNodesChange>[0]) => {
    onNodesChange(changes);
    // Push snapshot after microtask to read latest state
    queueMicrotask(() => pushHistory({ nodes: [...nodes], edges: [...edges] }));
  };
  const handleEdgesChange = (changes: Parameters<typeof onEdgesChange>[0]) => {
    onEdgesChange(changes);
    queueMicrotask(() => pushHistory({ nodes: [...nodes], edges: [...edges] }));
  };

  // Delete selected nodes/edges
  const deleteSelection = () => {
    const selectedNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    const nextNodes = nodes.filter((n) => !selectedNodeIds.has(n.id));
    const nextEdges = edges.filter((e) => !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target) && !e.selected);
    setNodes(nextNodes);
    setEdges(nextEdges);
    pushHistory({ nodes: nextNodes, edges: nextEdges });
  };

  // Undo / Redo
  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const snap = historyRef.current[historyIndexRef.current];
    setNodes(snap.nodes);
    setEdges(snap.edges);
  };
  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snap = historyRef.current[historyIndexRef.current];
    setNodes(snap.nodes);
    setEdges(snap.edges);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || "").toLowerCase();
      const isEditable =
        (tag === "input" || tag === "textarea") ||
        (target?.getAttribute?.("contenteditable") === "true");
      // Canvas zoom shortcuts
      if (isMod && (e.key === "=" || e.key === "+" || e.key === "-")) {
        e.preventDefault();
        const vp = rf.getViewport();
        const current = vp.zoom ?? 1;
        const delta = e.key === "-" ? -0.1 : 0.1;
        const next = Math.min(2, Math.max(0.2, current + delta));
        rf.setViewport({ ...vp, zoom: next });
        setZoomPct(Math.round(next * 100));
        return;
      }
      // Reset zoom 
      if (isMod && e.key === "0") {
        e.preventDefault();
        const vp = rf.getViewport();
        rf.setViewport({ ...vp, zoom: 1 });
        setZoomPct(100);
        return;
      }
      // Delete selected node
      if (e.key === "Delete" && !isMod && !isEditable) {
        e.preventDefault();
        deleteSelection();
        return;
      }
      if (isMod && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if (isMod && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redo();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // Ensure default zoom is applied after mount (avoids any layout-induced overrides)
  useEffect(() => {
    const vp = rf.getViewport();
    rf.setViewport({ ...vp, zoom: 1 });
    setZoomPct(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive starting id from preloaded workflow
  const startId = useMemo(() => {
    const maxId = initialGraph.nodes.reduce((max, n) => {
      const num = Number(n.id);
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 0);
    return maxId + 1;
  }, [initialGraph.nodes]);
  const nextIdRef = useRef<number>(startId);
  const addNode = (kind: NodeKind, position?: { x: number; y: number }) => {
    const id = String(nextIdRef.current++);
    const index = nodes.length;
    const fallbackPos = { x: 120 + index * 40, y: 120 + index * 30 };

    const textNode: Node = {
      id,
      position: position ?? fallbackPos,
      type: "text",
      data: { kind: "Text", text: "" },
    };
    const imageNode: Node = {
      id,
      position: position ?? fallbackPos,
      type: "image",
      data: { kind: "Image" },
    };
    const llmNode: Node = {
      id,
      position: position ?? fallbackPos,
      type: "llm",
      data: { kind: "LLM", model: "Imagen 4" },
    };

    const newNode = kind === "text" ? textNode : kind === "image" ? imageNode : llmNode;

    setNodes((prev) => [
      ...prev,
      newNode,
    ]);
  };

  useImperativeHandle(ref, () => ({ addNode, exportWorkflow, importWorkflow, serializeWorkflow }), []);

  // Export current graph as a sanitized workflow.json
  const exportWorkflow = () => {
    // Remove runtime-only fields and large payloads
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;

    const sanitizedNodes = currentNodes.map((n) => {
      const base = { ...n };
      // Avoid retaining selection flags in export
      delete (base as any).selected;

      const d = (n.data as any) || {};
      if (n.type === "text") {
        base.data = {
          kind: "Text",
          text: typeof d.text === "string" ? d.text : "",
        };
      } else if (n.type === "image") {
        base.data = {
          kind: "Image",
          // Keep only a lightweight name reference if present; drop base64
          ...(d.name ? { name: d.name } : {}),
        };
      } else if (n.type === "llm") {
        base.data = {
          kind: "LLM",
          model: typeof d.model === "string" ? d.model : "",
          prompt: typeof d.prompt === "string" ? d.prompt : "",
        };
      } else {
        // Default: keep as-is but without unknown heavy fields
        base.data = d;
      }
      return base;
    });

    const sanitizedEdges = currentEdges.map((e) => {
      const base = { ...e };
      delete (base as any).selected;
      return base;
    });

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const serializeWorkflow = () => {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const sanitizedNodes = currentNodes.map((n) => {
      const base = { ...n };
      delete (base as any).selected;
      const d = (n.data as any) || {};
      if (n.type === "text") {
        base.data = { kind: "Text", text: typeof d.text === "string" ? d.text : "" };
      } else if (n.type === "image") {
        base.data = { kind: "Image", ...(d.name ? { name: d.name } : {}) };
      } else if (n.type === "llm") {
        base.data = {
          kind: "LLM",
          model: typeof d.model === "string" ? d.model : "",
          prompt: typeof d.prompt === "string" ? d.prompt : "",
        };
      } else {
        base.data = d;
      }
      return base;
    });
    const sanitizedEdges = currentEdges.map((e) => {
      const base = { ...e };
      delete (base as any).selected;
      return base;
    });
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
    };
  };
  // Import workflow: validate/sanitize and replace current state
  const importWorkflow = (payload: unknown) => {
    try {
      // Client-side: avoid Zod here to prevent runtime mismatches; do structural check.
      const raw = payload as any;
      if (!raw || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) {
        return { ok: false, error: "Invalid workflow format" };
      }
      const wf = {
        version: Number(raw.version ?? 1),
        exportedAt:
          typeof raw.exportedAt === "string" && !Number.isNaN(Date.parse(raw.exportedAt))
            ? raw.exportedAt
            : new Date().toISOString(),
        nodes: raw.nodes,
        edges: raw.edges,
      };

      const nextNodes: Node[] = wf.nodes.map((n: any) => {
        const { measured, ...rest } = n || {};
        return {
          id: String(rest.id ?? crypto.randomUUID()),
          position: rest.position ?? { x: 0, y: 0 },
          type: rest.type as any,
          data: rest.data ?? {},
        } as Node;
      });
      const nextEdges: Edge[] = wf.edges.map((e: any) => {
        const { ...rest } = e || {};
        return {
          id: String(rest.id ?? `${rest.source}-${rest.target}`),
          source: String(rest.source),
          target: String(rest.target),
        } as Edge;
      });

      setNodes(nextNodes);
      setEdges(nextEdges);
      // update refs immediately
      nodesRef.current = nextNodes;
      edgesRef.current = nextEdges;
      pushHistory({ nodes: nextNodes, edges: nextEdges });
      // Update next id seed
      const maxId = nextNodes.reduce((max, n) => {
        const num = Number(n.id);
        return Number.isFinite(num) ? Math.max(max, num) : max;
      }, 0);
      nextIdRef.current = Math.max(maxId + 1, nextIdRef.current);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to import workflow";
      return { ok: false, error: msg };
    }
  };
  return (
    <div className="h-full w-full bg-background">
      <div
        ref={wrapperRef}
        className="relative h-full w-full"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const kind = e.dataTransfer.getData("application/reactflow") as NodeKind | "";
          if (!kind) return;

          const rect = wrapperRef.current?.getBoundingClientRect();
          const pos = rect
            ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
            : { x: e.clientX, y: e.clientY };

          // Project screen to flow coords
          let flowPos = pos as { x: number; y: number };
          const maybeScreenToFlow = (rf as any).screenToFlowPosition;
          if (typeof maybeScreenToFlow === "function") {
            flowPos = maybeScreenToFlow({ x: e.clientX, y: e.clientY });
          } else if (typeof (rf as any).project === "function") {
            flowPos = (rf as any).project(pos);
          }

          addNode(kind, flowPos);
        }}
      >
        <ReactFlow
          className="h-full w-full"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          /* Always allow node/edge interactions; lock only affects canvas panning */
          nodesConnectable
          nodesDraggable
          elementsSelectable
          selectionOnDrag
          /* Pan is enabled only when move mode is on and not locked */
          panOnDrag={!locked && panMode}
          /* Zoom always enabled (lock does not affect zoom) */
          zoomOnScroll
          zoomOnPinch
            /* Default zoom 100% */
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          defaultEdgeOptions={{
            type: "styled",
          }}
          connectionLineStyle={{ stroke: "#94a3b8", strokeWidth: 1.5 }}
          onMove={(_, vp) => setZoomPct(Math.max(10, Math.round((vp?.zoom ?? 1) * 100)))}
          onPaneClick={() => {
            setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
            setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
          }}
        >
          {/* Subtle dotted grid for spatial orientation */}
          <Background variant={BackgroundVariant.Dots} size={1} gap={24} color="#e5e7eb" />
        </ReactFlow>
        {/* Custom control bar */}
        <CanvasControls
          locked={locked}
          setLocked={setLocked}
          panMode={panMode}
          setPanMode={setPanMode}
          zoomPercent={zoomPct}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndexRef.current > 0}
          canRedo={historyRef.current.length > 0 && historyIndexRef.current < historyRef.current.length - 1}
        />
      </div>
    </div>
  );
}

const FlowCanvasInnerWithRef = forwardRef<FlowCanvasHandle, unknown>(FlowCanvasInner);

const FlowCanvas = forwardRef<FlowCanvasHandle, unknown>(function FlowCanvas(_props, ref) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInnerWithRef
        ref={ref}
      />
    </ReactFlowProvider>
  );
});
export default FlowCanvas;

