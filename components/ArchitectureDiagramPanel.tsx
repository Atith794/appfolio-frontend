"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Viewport,
  MarkerType,
  SelectionMode,
  OnSelectionChangeParams,
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import {
  RectNode,
  DbNode,
  DiamondNode,
  CircleNode,
  TriangleNode,
  TextNode,
  CloudNode
} from "@/components/diagram/nodes";
import { toPng } from "html-to-image";
import { AlignCenter, AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignHorizontalDistributeCenter, AlignLeft, AlignRight, AlignStartHorizontal, AlignStartVertical, AlignVerticalDistributeCenter, Circle, Cloud, Database, Diamond, RectangleHorizontal, Redo, Triangle, Type, Undo } from 'lucide-react';

type NodeTypeKey = "rect" | "db" | "diamond" | "circle" | "triangle" | "text" | "cloud";

const FILL_COLORS = [
  { name: "Default", value: "#ffffff" },
  { name: "Gray", value: "#f1f5f9" },
  { name: "Blue", value: "#dbeafe" },
  { name: "Green", value: "#dcfce7" },
  { name: "Yellow", value: "#fef9c3" },
  { name: "Orange", value: "#ffedd5" },
  { name: "Red", value: "#fee2e2" },
  { name: "Purple", value: "#f3e8ff" },
];

const BORDER_COLORS = [
  { name: "Slate", value: "#cbd5e1" },
  { name: "Gray", value: "#94a3b8" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Green", value: "#4ade80" },
  { name: "Yellow", value: "#facc15" },
  { name: "Orange", value: "#fb923c" },
  { name: "Red", value: "#f87171" },
  { name: "Purple", value: "#a78bfa" },
];

export function ArchitectureDiagramPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewport, setViewports] = useState<Viewport | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  type DiagramSnapshot = { nodes: Node[]; edges: Edge[]; viewport?: Viewport };

  const [past, setPast] = useState<DiagramSnapshot[]>([]);
  const [future, setFuture] = useState<DiagramSnapshot[]>([]);
  const [selected, setSelected] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  // const { fitView, setViewport } = useReactFlow();

  function snapshot(): DiagramSnapshot {
    return {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
      viewport,
    };
  }

  function pushHistory() {
    setPast((p) => [...p.slice(-49), snapshot()]); // keep last 50
    setFuture([]); // clear redo stack
  }

  const nodeTypes = useMemo(
    () => ({
      rect: RectNode,
      db: DbNode,
      diamond: DiamondNode,
      circle: CircleNode,
      triangle: TriangleNode,
      text: TextNode,
      cloud: CloudNode,
    }),
    []
  );

  // Edge defaults: smooth step + arrowheads
  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: false,
    }),
    []
  );

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (!token) return;

        const data = await apiFetch(`/apps/${appId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const d = (data as any).app?.architectureDiagram;
        if (d) {
          setNodes(d.nodes || []);
          setEdges(d.edges || []);
          setViewports(d.viewport);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load diagram");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      pushHistory();

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: false,
          },
          eds
        )
      );
    },
    [pushHistory]
  );

  const DEFAULT_FILL = "#ffffff";
  const DEFAULT_BORDER = "#cbd5e1";

  function addNode(type: NodeTypeKey) {
    const id = crypto.randomUUID();
    

    // const styleByType: Record<NodeTypeKey, any> = {
    const styleByType: Partial<Record<NodeTypeKey, any>> = {
      rect: { width: 180 },
      db: { width: 220, height: 130 },
      text: { width: 220 },
      circle: { width: 140, height: 140 },
      diamond: { width: 140, height: 140 },
      triangle: { width: 170, height: 150 },
      cloud: { width: 220, height: 140 },
    };

    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position: { x: 120 + nds.length * 10, y: 120 + nds.length * 10 },
        data: { label: "", fill: DEFAULT_FILL, border: DEFAULT_BORDER },
        style: styleByType[type],
      },
    ]);
  }

  const onNodeDragStop = useCallback(() => {
    pushHistory();
  }, [nodes, edges, viewport]);

  const onConnectEnd = useCallback(() => {
    // connecting already changes edges, we snapshot after
    pushHistory();
  }, [nodes, edges, viewport]);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelected({
      nodes: params.nodes || [],
      edges: params.edges || [],
    });
  }, []);

  async function saveDiagram() {
    try {
      setSaving(true);
      setError("");

      const token = await getToken();
      if (!token) return;

      await apiFetch(`/apps/${appId}/architecture-diagram`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nodes,
          edges,
          viewport,
        }),
      });

      alert("Architecture diagram saved");
    } catch (e: any) {
      setError(e.message || "Failed to save diagram");
    } finally {
      setSaving(false);
    }
  }

  function setSelectedFill(fill: string) {
    if (selected.nodes.length === 0) return;
    pushHistory();

    const ids = new Set(selected.nodes.map((n) => n.id));
    setNodes((all) =>
      all.map((n) =>
        ids.has(n.id) ? { ...n, data: { ...(n.data as any), fill } } : n
      )
    );
  }

  function setSelectedBorder(border: string) {
    if (selected.nodes.length === 0) return;
    pushHistory();

    const ids = new Set(selected.nodes.map((n) => n.id));
    setNodes((all) =>
      all.map((n) =>
        ids.has(n.id) ? { ...n, data: { ...(n.data as any), border } } : n
      )
    );
  }

  async function exportPngAndUpload() {
    try {
      setError("");
      setExporting(true);

      const token = await getToken();
      if (!token) return;

      // Add class to hide handles/UI & enforce edge stroke in export
      document.documentElement.classList.add("exporting-diagram");

      // Capture renderer (better than root)
      const renderer = document.querySelector(".react-flow__renderer") as HTMLElement | null;
      if (!renderer) throw new Error("Diagram renderer not found");

      const { toBlob } = await import("html-to-image");

      const blob = await toBlob(renderer, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        filter: (node) => {
          const el = node as HTMLElement;
          const cls = el.classList;
          if (cls?.contains("react-flow__controls")) return false;
          if (cls?.contains("react-flow__minimap")) return false;
          return true;
        },
        skipFonts: true,
      });

      if (!blob) throw new Error("Failed to render image");

      const file = new File([blob], `architecture-${appId}.png`, { type: "image/png" });

      const sig = await apiFetch("/uploads/cloudinary-signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", (sig as any).apiKey);
      form.append("timestamp", String((sig as any).timestamp));
      form.append("signature", (sig as any).signature);
      form.append("folder", (sig as any).folder);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing");

      const uploadRes = await (await import("axios")).default.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        form
      );

      const imageUrl = uploadRes.data.secure_url;

      await apiFetch(`/apps/${appId}/architecture-diagram/image`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      alert("Exported & saved PNG!");
    } catch (e: any) {
      setError(e.message || "Failed to export PNG");
    } finally {
      document.documentElement.classList.remove("exporting-diagram");
      setExporting(false);
    }
  }

  useEffect(() => {
    function isTypingTarget(el: EventTarget | null) {
      const t = el as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName?.toLowerCase();
      return tag === "input" || tag === "textarea" || t.isContentEditable;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      const mod = e.metaKey || e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        if (past.length === 0) return;

        const prev = past[past.length - 1];
        setPast((p) => p.slice(0, -1));
        setFuture((f) => [snapshot(), ...f]);

        setNodes(prev.nodes);
        setEdges(prev.edges);
        setViewports(prev.viewport);
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if (mod && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        if (future.length === 0) return;

        const next = future[0];
        setFuture((f) => f.slice(1));
        setPast((p) => [...p, snapshot()]);

        setNodes(next.nodes);
        setEdges(next.edges);
        setViewports(next.viewport);
        return;
      }

      // Delete selected (Backspace/Delete)
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selected.nodes.length === 0 && selected.edges.length === 0) return;
        e.preventDefault();

        pushHistory();

        const selectedNodeIds = new Set(selected.nodes.map((n) => n.id));
        const selectedEdgeIds = new Set(selected.edges.map((ed) => ed.id));

        setNodes((nds) => nds.filter((n) => !selectedNodeIds.has(n.id)));

        setEdges((eds) =>
          eds.filter((ed) => {
            if (selectedEdgeIds.has(ed.id)) return false;
            // also remove edges connected to deleted nodes
            if (selectedNodeIds.has(ed.source) || selectedNodeIds.has(ed.target)) return false;
            return true;
          })
        );
        return;
      }

      // Duplicate selected nodes: Ctrl/Cmd + D
      if (mod && e.key.toLowerCase() === "d") {
        if (selected.nodes.length === 0) return;
        e.preventDefault();

        pushHistory();

        const idMap = new Map<string, string>();
        const newNodes = selected.nodes.map((n) => {
          const newId = crypto.randomUUID();
          idMap.set(n.id, newId);

          return {
            ...n,
            id: newId,
            position: { x: n.position.x + 30, y: n.position.y + 30 },
            selected: true,
          };
        });

        // Optional: duplicate edges only if both endpoints are selected
        const selectedNodeIds = new Set(selected.nodes.map((n) => n.id));
        const newEdges = edges
          .filter((ed) => selectedNodeIds.has(ed.source) && selectedNodeIds.has(ed.target))
          .map((ed) => ({
            ...ed,
            id: crypto.randomUUID(),
            source: idMap.get(ed.source)!,
            target: idMap.get(ed.target)!,
            sourceHandle: ed.sourceHandle,
            targetHandle: ed.targetHandle,
            selected: true,
          }));

        // unselect old nodes
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat(newNodes));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: false })).concat(newEdges));
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [past, future, selected, nodes, edges, viewport]);

  //Node resizing and alignment
  function getSize(n: Node) {
    const w = (n.width ?? (n as any).measured?.width ?? 180) as number;
    const h = (n.height ?? (n as any).measured?.height ?? 80) as number;
    return { w, h };
  }

  function alignSelected(mode: "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom") {
    if (selected.nodes.length < 2) return;

    // snapshot for undo
    pushHistory();

    const ns = selected.nodes;
    const boxes = ns.map((n) => {
      const { w, h } = getSize(n);
      return { n, w, h };
    });

    // compute reference line
    const xs = boxes.map(({ n }) => n.position.x);
    const ys = boxes.map(({ n }) => n.position.y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);

    const right = Math.max(...boxes.map(({ n, w }) => n.position.x + w));
    const bottom = Math.max(...boxes.map(({ n, h }) => n.position.y + h));

    const hcenter = (left + right) / 2;
    const vcenter = (top + bottom) / 2;

    const selectedIds = new Set(ns.map((n) => n.id));

    setNodes((all) =>
      all.map((n) => {
        if (!selectedIds.has(n.id)) return n;

        const { w, h } = getSize(n);
        let x = n.position.x;
        let y = n.position.y;

        if (mode === "left") x = left;
        if (mode === "right") x = right - w;
        if (mode === "hcenter") x = hcenter - w / 2;

        if (mode === "top") y = top;
        if (mode === "bottom") y = bottom - h;
        if (mode === "vcenter") y = vcenter - h / 2;

        return { ...n, position: { x, y } };
      })
    );
  }

  function distributeSelected(axis: "x" | "y") {
    if (selected.nodes.length < 3) return;

    pushHistory();

    const ns = [...selected.nodes];
    const selectedIds = new Set(ns.map((n) => n.id));

    const items = ns
      .map((n) => {
        const { w, h } = getSize(n);
        return { n, w, h };
      })
      .sort((a, b) => (axis === "x" ? a.n.position.x - b.n.position.x : a.n.position.y - b.n.position.y));

    if (axis === "x") {
      const first = items[0];
      const last = items[items.length - 1];

      const start = first.n.position.x;
      const end = last.n.position.x;
      const gaps = items.length - 1;
      const step = (end - start) / gaps;

      setNodes((all) =>
        all.map((n) => {
          if (!selectedIds.has(n.id)) return n;
          const idx = items.findIndex((it) => it.n.id === n.id);
          if (idx === 0 || idx === items.length - 1) return n;
          return { ...n, position: { x: start + step * idx, y: n.position.y } };
        })
      );
    } else {
      const first = items[0];
      const last = items[items.length - 1];

      const start = first.n.position.y;
      const end = last.n.position.y;
      const gaps = items.length - 1;
      const step = (end - start) / gaps;

      setNodes((all) =>
        all.map((n) => {
          if (!selectedIds.has(n.id)) return n;
          const idx = items.findIndex((it) => it.n.id === n.id);
          if (idx === 0 || idx === items.length - 1) return n;
          return { ...n, position: { x: n.position.x, y: start + step * idx } };
        })
      );
    }
  }

  if (loading) return <p>Loading diagram...</p>;

  return (
    <section style={{ marginTop: 16 }}>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            title="Rectangle" 
            onClick={() => addNode("rect")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <RectangleHorizontal />
          </button>
          <button
            title="Cylinder" 
            onClick={() => addNode("db")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Database />
          </button>
          <button
            title="Diamond" 
            onClick={() => addNode("diamond")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Diamond />
          </button>
          <button
            title="Circle" 
            onClick={() => addNode("circle")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Circle />
          </button>
          <button
            title="Triangle"
            onClick={() => addNode("triangle")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Triangle />
          </button>
          <button 
            title="Cloud"
            onClick={() => addNode("cloud")} 
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Cloud />
            {/* Cloud */}
          </button>
          <button
            title="Text Box"
            onClick={() => addNode("text")}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Type />
          </button>

          <div className="w-4" />

          

          <button
            title="Undo"
            onClick={() => {
              // Undo button (same logic as shortcut)
              if (past.length === 0) return;
              const prev = past[past.length - 1];
              setPast((p) => p.slice(0, -1));
              setFuture((f) => [snapshot(), ...f]);
              setNodes(prev.nodes);
              setEdges(prev.edges);
              setViewports(prev.viewport);
            }}
            disabled={past.length === 0}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
          >
            <Undo />
          </button>

          <button
            title="Redo"
            onClick={() => {
              if (future.length === 0) return;
              const next = future[0];
              setFuture((f) => f.slice(1));
              setPast((p) => [...p, snapshot()]);
              setNodes(next.nodes);
              setEdges(next.edges);
              setViewports(next.viewport);
            }}
            disabled={future.length === 0}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
          >
            <Redo />
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button title="Align Left" onClick={() => alignSelected("left")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignStartVertical />
            </button>
            <button title="Align Center" onClick={() => alignSelected("hcenter")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignCenterVertical />
            </button>
            <button title="Align Right" onClick={() => alignSelected("right")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignEndVertical />
            </button>

            <button title="Align to Top" onClick={() => alignSelected("top")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignStartHorizontal />
            </button>
            <button title="Align to Middle" onClick={() => alignSelected("vcenter")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignCenterHorizontal />
            </button>
            <button title="Align to Bottom" onClick={() => alignSelected("bottom")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              <AlignEndHorizontal />
            </button>

            <button title="Distribute H" onClick={() => distributeSelected("x")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              {/* Distribute H */}
              <AlignVerticalDistributeCenter />
            </button>
            <button title="Distribute V" onClick={() => distributeSelected("y")} className="px-3 py-2 rounded-lg text-sm text-primary bg-slate-100 hover:bg-slate-200">
              {/* Distribute V */}
              <AlignHorizontalDistributeCenter />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-serif">Fill</span>
              {FILL_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedFill(c.value)}
                  title={c.name}
                  className="w-6 h-6 rounded-md border border-slate-300"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-serif">Border</span>
              {BORDER_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedBorder(c.value)}
                  title={c.name}
                  className="w-6 h-6 rounded-md border border-slate-300 bg-white"
                >
                  <span className="block w-full h-full rounded-md" style={{ border: `3px solid ${c.value}` }} />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveDiagram}
            disabled={saving}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save diagram"}
          </button>

          <button
            onClick={exportPngAndUpload}
            disabled={exporting}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60"
          >
            {exporting ? "Exporting..." : "Export PNG"}
          </button>

          {error && <span className="text-sm text-red-600">{error}</span>}

        </div>

        <div style={{ height: 520 }} className="rounded-lg overflow-hidden">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType="smoothstep"
            connectionRadius={30}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onMoveEnd={(_, vp) => setViewports(vp)}
            // fitView
            // isValidConnection={isValidConnection}
            onNodeDragStop={onNodeDragStop}
            onSelectionChange={onSelectionChange}
            fitView
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            snapToGrid
            snapGrid={[10, 10]}
            nodesDraggable
            nodeDragThreshold={8}
            onInit={(instance) => {
              rfInstance.current = instance;
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Tip: Double-click any node text to edit.
        </p>
      </div>
    </section>
  );
}