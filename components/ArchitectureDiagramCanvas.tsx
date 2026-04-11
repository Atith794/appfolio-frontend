"use client";

import { useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Edge,
  Node,
  Viewport,
  MarkerType,
  SelectionMode,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  RectNode,
  DbNode,
  DiamondNode,
  CircleNode,
  TriangleNode,
  TextNode,
  CloudNode,
} from "@/components/diagram/nodes";

type Props = {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
  height?: number;
  editable?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  showBackground?: boolean;
  className?: string;
};

export default function ArchitectureDiagramCanvas({
  nodes,
  edges,
  viewport,
  height = 520,
  editable = false,
  showControls = true,
  showMiniMap = true,
  showBackground = true,
  className = "",
}: Props) {
  const rfInstance = useRef<ReactFlowInstance | null>(null);

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

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: false,
    }),
    []
  );

  useEffect(() => {
    if (viewport && rfInstance.current) {
      rfInstance.current.setViewport(viewport);
    }
  }, [viewport]);

  return (
    <div
      style={{ height }}
      className={`rounded-lg overflow-hidden border border-slate-200 bg-white ${className}`}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType="smoothstep"
        fitView={!viewport}
        nodesDraggable={editable}
        nodesConnectable={editable}
        elementsSelectable={editable}
        selectionOnDrag={editable}
        selectionMode={SelectionMode.Partial}
        snapToGrid={editable}
        snapGrid={[10, 10]}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        onInit={(instance) => {
          rfInstance.current = instance;
        }}
      >
        {showBackground ? <Background /> : null}
        {showControls ? <Controls /> : null}
        {showMiniMap ? <MiniMap /> : null}
      </ReactFlow>
    </div>
  );
}