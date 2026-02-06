// "use client";

// import { useCallback, useEffect, useState, useMemo } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   addEdge,
//   applyEdgeChanges,
//   applyNodeChanges,
//   Connection,
//   Edge,
//   Node,
//   NodeChange,
//   EdgeChange,
//   Viewport,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { useAuth } from "@clerk/nextjs";
// import { apiFetch } from "@/lib/api";

// export function ArchitectureDiagramPanel({ appId }: { appId: string }) {
//   const { getToken } = useAuth();

//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [edges, setEdges] = useState<Edge[]>([]);
//   const [viewport, setViewport] = useState<Viewport | undefined>(undefined);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const nodeTypes = useMemo(
//     () => ({
//       rect: RectNode,
//       db: DbNode,
//       diamond: DiamondNode,
//       circle: CircleNode,
//       triangle: TriangleNode,
//       text: TextNode,
//     }),
//     []
//   );

//   /** Load diagram */
//   useEffect(() => {
//     async function load() {
//       try {
//         const token = await getToken();
//         if (!token) return;

//         const data = await apiFetch(`/apps/${appId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         const d = (data as any).app?.architectureDiagram;
//         if (d) {
//           setNodes(d.nodes || []);
//           setEdges(d.edges || []);
//           setViewport(d.viewport);
//         }
//       } catch (e: any) {
//         setError(e.message || "Failed to load diagram");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [appId]);

//   /** React Flow handlers */
//   const onNodesChange = useCallback(
//     (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     []
//   );

//   const onEdgesChange = useCallback(
//     (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     []
//   );

//   const onConnect = useCallback(
//     (connection: Connection) =>
//       setEdges((eds) => addEdge({ ...connection, animated: false }, eds)),
//     []
//   );

//   /** Add node */
//   function addNode() {
//     const id = crypto.randomUUID();
//     setNodes((nds) => [
//       ...nds,
//       {
//         id,
//         position: { x: 100, y: 100 },
//         data: { label: "New Node" },
//         type: 'default',
//       },
//     ]);
//   }

//   /** Save diagram */
//   async function saveDiagram() {
//     try {
//       setSaving(true);
//       const token = await getToken();
//       if (!token) return;

//       await apiFetch(`/apps/${appId}/architecture-diagram`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           nodes,
//           edges,
//           viewport,
//         }),
//       });

//       alert("Architecture diagram saved");
//     } catch (e: any) {
//       setError(e.message || "Failed to save diagram");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <p>Loading diagram...</p>;

//   return (
//     <section style={{ marginTop: 16 }}>
//       <div className="border-2 border-dashed border-slate-200 rounded-xl p-3">
//         <div className="flex items-center gap-3 mb-3">
//           <button
//             onClick={addNode}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//           >
//             + Add Node
//           </button>

//           <button
//             onClick={saveDiagram}
//             disabled={saving}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//           >
//             {saving ? "Saving..." : "Save diagram"}
//           </button>

//           {error && <span className="text-sm text-red-600">{error}</span>}
//         </div>

//         <div style={{ height: 500 }} className="rounded-lg overflow-hidden">
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             onMoveEnd={(_, vp) => setViewport(vp)}
//             fitView
//           >
//             <Background />
//             <Controls />
//             <MiniMap />
//           </ReactFlow>
//         </div>
//       </div>
//     </section>
//   );
// }

//Iteration 2
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   addEdge,
//   applyEdgeChanges,
//   applyNodeChanges,
//   Connection,
//   Edge,
//   Node,
//   NodeChange,
//   EdgeChange,
//   Viewport,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { useAuth } from "@clerk/nextjs";
// import { apiFetch } from "@/lib/api";
// import { RectNode, DbNode, DiamondNode, CircleNode, TriangleNode, TextNode } from "@/components/diagram/nodes";
// import { toPng } from "html-to-image";

// type NodeTypeKey = "rect" | "db" | "diamond" | "circle" | "triangle" | "text";

// export function ArchitectureDiagramPanel({ appId }: { appId: string }) {
//   const { getToken } = useAuth();

//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [edges, setEdges] = useState<Edge[]>([]);
//   const [viewport, setViewport] = useState<Viewport | undefined>(undefined);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const nodeTypes = useMemo(
//     () => ({
//       rect: RectNode,
//       db: DbNode,
//       diamond: DiamondNode,
//       circle: CircleNode,
//       triangle: TriangleNode,
//       text: TextNode,
//     }),
//     []
//   );

//   useEffect(() => {
//     async function load() {
//       try {
//         const token = await getToken();
//         if (!token) return;

//         const data = await apiFetch(`/apps/${appId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         const d = (data as any).app?.architectureDiagram;
//         if (d) {
//           setNodes(d.nodes || []);
//           setEdges(d.edges || []);
//           setViewport(d.viewport);
//         }
//       } catch (e: any) {
//         setError(e.message || "Failed to load diagram");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [appId]);

//   const onNodesChange = useCallback(
//     (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     []
//   );

//   const onEdgesChange = useCallback(
//     (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     []
//   );

//   const onConnect = useCallback(
//     (connection: Connection) =>
//       setEdges((eds) => addEdge({ ...connection, animated: false }, eds)),
//     []
//   );

//   function addNode(type: NodeTypeKey) {
//     const id = crypto.randomUUID();
//     setNodes((nds) => [
//       ...nds,
//       {
//         id,
//         type, // IMPORTANT: reactflow nodeTypes key
//         position: { x: 120 + nds.length * 10, y: 120 + nds.length * 10 },
//         data: { label: "" },
//       },
//     ]);
//   }

//   async function saveDiagram() {
//     try {
//       setSaving(true);
//       const token = await getToken();
//       if (!token) return;

//       await apiFetch(`/apps/${appId}/architecture-diagram`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           nodes,
//           edges,
//           viewport,
//         }),
//       });

//       alert("Architecture diagram saved");
//     } catch (e: any) {
//       setError(e.message || "Failed to save diagram");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function exportPngAndUpload() {
//     try {
//       setError("");

//       const token = await getToken();
//       if (!token) return;

//       // ReactFlow renders inside this viewport element
//       const viewportEl = document.querySelector(".react-flow__viewport") as HTMLElement | null;
//       if (!viewportEl) throw new Error("Diagram viewport not found");

//       // Make a PNG of current viewport
//       const dataUrl = await toPng(viewportEl, {
//         cacheBust: true,
//         backgroundColor: "#ffffff",
//         pixelRatio: 2,
//       });

//       // Convert dataUrl → Blob → File
//       const blob = await (await fetch(dataUrl)).blob();
//       const file = new File([blob], `architecture-${appId}.png`, { type: "image/png" });

//       // Cloudinary signature
//       const sig = await apiFetch("/uploads/cloudinary-signature", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const form = new FormData();
//       form.append("file", file);
//       form.append("api_key", (sig as any).apiKey);
//       form.append("timestamp", String((sig as any).timestamp));
//       form.append("signature", (sig as any).signature);
//       form.append("folder", (sig as any).folder);

//       const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//       if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing");

//       const uploadRes = await (await import("axios")).default.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         form
//       );

//       const imageUrl = uploadRes.data.secure_url;

//       // Save image url in DB
//       await apiFetch(`/apps/${appId}/architecture-diagram/image`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ imageUrl }),
//       });

//       alert("Exported & saved PNG!");
//     } catch (e: any) {
//       setError(e.message || "Failed to export PNG");
//     }
//   }

//   if (loading) return <p>Loading diagram...</p>;

//   return (
//     <section style={{ marginTop: 16 }}>
//       <div className="border-2 border-dashed border-slate-200 rounded-xl p-3">
//         <div className="flex flex-wrap items-center gap-2 mb-3">
//           <button onClick={() => addNode("rect")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Rectangle
//           </button>
//           <button onClick={() => addNode("db")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Database
//           </button>
//           <button onClick={() => addNode("diamond")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Decision
//           </button>
//           <button onClick={() => addNode("circle")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Circle
//           </button>
//           <button onClick={() => addNode("triangle")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Triangle
//           </button>
//           <button onClick={() => addNode("text")} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
//             Text
//           </button>

//           <div className="w-4" />

//           <button
//             onClick={saveDiagram}
//             disabled={saving}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//           >
//             {saving ? "Saving..." : "Save diagram"}
//           </button>

//           <button
//             onClick={exportPngAndUpload}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//           >
//             Export PNG
//           </button>

//           {error && <span className="text-sm text-red-600">{error}</span>}
//         </div>

//         <div style={{ height: 520 }} className="rounded-lg overflow-hidden">
//           <ReactFlow
//             nodeTypes={nodeTypes}
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             onMoveEnd={(_, vp) => setViewport(vp)}
//             fitView
//           >
//             <Background />
//             <Controls />
//             <MiniMap />
//           </ReactFlow>
//         </div>

//         <p className="mt-2 text-xs text-slate-500">
//           Tip: Double-click any node text to edit.
//         </p>
//       </div>
//     </section>
//   );
// }

// Iteration 3
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/components/diagram/nodes";
import { toPng } from "html-to-image";
import { AlignCenter, AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignHorizontalDistributeCenter, AlignLeft, AlignRight, AlignStartHorizontal, AlignStartVertical, AlignVerticalDistributeCenter, Circle, Database, Diamond, RectangleHorizontal, Redo, Triangle, Type, Undo } from 'lucide-react';

type NodeTypeKey = "rect" | "db" | "diamond" | "circle" | "triangle" | "text";

export function ArchitectureDiagramPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);

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
          setViewport(d.viewport);
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

  //Recent working version
  // const onConnect = useCallback((connection: Connection) => {
  //   setEdges((eds) =>
  //     addEdge(
  //       {
  //         ...connection,
  //         type: "smoothstep",
  //         markerEnd: { type: MarkerType.ArrowClosed },
  //         animated: false,
  //       },
  //       eds
  //     )
  //   );
  // }, []);
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

  function addNode(type: NodeTypeKey) {
    const id = crypto.randomUUID();
    

    // const styleByType: Record<NodeTypeKey, any> = {
    const styleByType: Partial<Record<NodeTypeKey, any>> = {
      rect: { width: 180 },
      db: { width: 200 },
      text: { width: 220 },
      circle: { width: 140, height: 140 },
      diamond: { width: 140, height: 140 },
      triangle: { width: 170, height: 150 },
    };

    if (type === "circle") {
      style: { width: 140; height: 140 }
    }

    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position: { x: 120 + nds.length * 10, y: 120 + nds.length * 10 },
        data: { label: "" },
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

  // async function exportPngAndUpload() {
  //   try {
  //     setError("");
  //     setExporting(true);

  //     const token = await getToken();
  //     if (!token) return;

  //     // Capture the whole react-flow root (includes edges + markers reliably)
  //     const root = document.querySelector(".react-flow") as HTMLElement | null;
  //     if (!root) throw new Error("Diagram root not found");

  //     const dataUrl = await toPng(root, {
  //       cacheBust: true,
  //       backgroundColor: "#ffffff",
  //       pixelRatio: 2,
  //       filter: (node) => {
  //         const el = node as HTMLElement;
  //         const cls = el.classList;
  //         // exclude UI overlays
  //         if (cls?.contains("react-flow__controls")) return false;
  //         if (cls?.contains("react-flow__minimap")) return false;
  //         return true;
  //       },
  //     });

  //     const blob = await (await fetch(dataUrl)).blob();
  //     const file = new File([blob], `architecture-${appId}.png`, { type: "image/png" });

  //     const sig = await apiFetch("/uploads/cloudinary-signature", {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const form = new FormData();
  //     form.append("file", file);
  //     form.append("api_key", (sig as any).apiKey);
  //     form.append("timestamp", String((sig as any).timestamp));
  //     form.append("signature", (sig as any).signature);
  //     form.append("folder", (sig as any).folder);

  //     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  //     if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing");

  //     const uploadRes = await (await import("axios")).default.post(
  //       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  //       form
  //     );

  //     const imageUrl = uploadRes.data.secure_url;

  //     await apiFetch(`/apps/${appId}/architecture-diagram/image`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ imageUrl }),
  //     });

  //     alert("Exported & saved PNG!");
  //   } catch (e: any) {
  //     setError(e.message || "Failed to export PNG");
  //   } finally {
  //     setExporting(false);
  //   }
  // }

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
        setViewport(prev.viewport);
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
        setViewport(next.viewport);
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
            title="Database" 
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
              setViewport(prev.viewport);
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
              setViewport(next.viewport);
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
            onMoveEnd={(_, vp) => setViewport(vp)}
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