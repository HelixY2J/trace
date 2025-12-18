"use client";
import { showToast } from "../../lib/toast";
import { useRef } from "react";
import FlowCanvas, { type FlowCanvasHandle, type NodeKind } from "../../components/FlowCanvas";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

export default function CanvasPage() {
  const canvasRef = useRef<FlowCanvasHandle>(null);

  const handleAdd = (kind: NodeKind) => {
    canvasRef.current?.addNode(kind);
  };
  const handleExport = () => {
    canvasRef.current?.exportWorkflow();
  };
  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = canvasRef.current?.importWorkflow(json);
      if (res && !res.ok) {
        console.error("Import failed:", res.error);
      }
    } catch {
      // ignore; sidebar can add visuals later
    }
  };
  const handleSaveDb = async () => {
    try {
      const wf = canvasRef.current?.serializeWorkflow();
      if (!wf) return;
      // Debug: quick client-side counts
      console.log("[save] nodes:", wf.nodes.length, "edges:", wf.edges.length, "version:", wf.version);
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wf),
      });
      if (!res.ok) {
        let errMsg = res.statusText;
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const err = await res.json();
            errMsg = err?.error?.message || errMsg;
          } else {
            const txt = await res.text();
            errMsg = txt || errMsg;
          }
        } catch {}
        console.error("Save failed:", errMsg);
        showToast("Unsuccessful save", errMsg, "error");
        return;
      }
      const data = await res.json();
      console.log("Saved workflow id:", data.id);
      showToast("Saved successfully", "Workflow saved to DB", "success");
    } catch (e) {
      console.error("Save failed:", e);
      showToast("Unsuccessful save", "Unexpected error during save", "error");
    }
  };
  const handleLoadDb = async () => {
    try {
      const res = await fetch("/api/workflow", { method: "GET" });
      if (!res.ok) {
        let errMsg = res.statusText;
        try {
          const err = await res.json();
          errMsg = err?.error?.message || errMsg;
        } catch {}
        console.error("Load failed:", errMsg);
        showToast("Load failed", errMsg, "error");
        return;
      }
      const data = (await res.json()) as { workflow: unknown } | any;
      if (!data?.workflow) {
        console.log("No workflow found in DB.");
        showToast("Load info", "No workflow found in DB", "info");
        return;
      }
      const result = canvasRef.current?.importWorkflow(data.workflow);
      if (result && !result.ok) {
        console.error("Import failed:", result.error);
        showToast("Import failed", result.error || "Invalid workflow format", "error");
        return;
      }
      showToast("Loaded successfully", "Workflow loaded from DB", "success");
    } catch (e) {
      console.error("Load failed:", e);
      showToast("Load failed", "Unexpected error during load", "error");
    }
  };

  return (
    <SidebarProvider className="relative overflow-x-hidden">
      <AppSidebar
        onAdd={handleAdd}
        onExport={handleExport}
        onImport={handleImport}
        onSaveDb={handleSaveDb}
        onLoadDb={handleLoadDb}
      />
      <SidebarInset className="p-0 overflow-x-hidden">
        <div className="h-screen w-full">
          <FlowCanvas ref={canvasRef} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

