"use client";

import React, { useMemo, useState } from "react";
import { Handle, Position, useReactFlow, NodeProps, NodeResizer } from "reactflow";

type ShapeData = {
  label?: string;
};

function useUpdateLabel(id: string) {
  const { setNodes } = useReactFlow();
  return (next: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...(n.data as any), label: next } } : n))
    );
  };
}

function LabelEditor({ id, label }: { id: string; label: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label || "");
  const update = useUpdateLabel(id);

  return (
    <div
      onDoubleClick={() => {
        setEditing(true);
        setValue(label || "");
      }}
      className="w-full"
      title="Double click to edit"
    >
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            setEditing(false);
            update(value.trim());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              setEditing(false);
              setValue(label || "");
            }
          }}
          className="w-full bg-white/80 rounded-md px-2 py-1 text-xs outline-none border border-slate-200 focus:ring-2 focus:ring-primary/30"
        />
      ) : (
        <div className="text-xs font-semibold text-slate-800 text-center px-1 break-words">
          {label?.trim() ? label : "Double click to edit"}
        </div>
      )}
    </div>
  );
}

//V5
function CommonHandles({ gap = 8 }: { gap?: number }) {
  const base = "w-2.5 h-2.5 bg-white border border-slate-500 rounded-full";

  return (
    <>
      {/* TOP */}
      <Handle type="target" id="t-top" position={Position.Top} className={base} style={{ top: -gap, zIndex: 50 }} />
      <Handle type="source" id="s-top" position={Position.Top} className={base} style={{ top: gap, zIndex: 50 }} />

      {/* RIGHT */}
      <Handle type="target" id="t-right" position={Position.Right} className={base} style={{ right: -gap, zIndex: 50 }} />
      <Handle type="source" id="s-right" position={Position.Right} className={base} style={{ right: gap, zIndex: 50 }} />

      {/* BOTTOM */}
      <Handle type="target" id="t-bottom" position={Position.Bottom} className={base} style={{ bottom: -gap, zIndex: 50 }} />
      <Handle type="source" id="s-bottom" position={Position.Bottom} className={base} style={{ bottom: gap, zIndex: 50 }} />

      {/* LEFT */}
      <Handle type="target" id="t-left" position={Position.Left} className={base} style={{ left: -gap, zIndex: 50 }} />
      <Handle type="source" id="s-left" position={Position.Left} className={base} style={{ left: gap, zIndex: 50 }} />
    </>
  );
}

function useNodeSize(id: string, fallbackW: number, fallbackH: number) {
  const rf = useReactFlow();
  const [size, setSize] = useState({ w: fallbackW, h: fallbackH });

  useEffect(() => {
    const update = () => {
      const n = rf.getNode(id);
      const w =
        (n?.width as number) ??
        ((n as any)?.style?.width as number) ??
        ((n as any)?.measured?.width as number) ??
        fallbackW;

      const h =
        (n?.height as number) ??
        ((n as any)?.style?.height as number) ??
        ((n as any)?.measured?.height as number) ??
        fallbackH;

      setSize({ w, h });
    };

    update();

    // update size after any change
    const unsub = rf.onNodesChange?.(() => update());
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [id]);

  return size;
}

// function getNodeSize(rf: any, id: string, fallbackW: number, fallbackH: number) {
//   const n = rf.getNode(id);
//   const w =
//     n?.width ??
//     n?.style?.width ??
//     n?.measured?.width ??
//     fallbackW;

//   const h =
//     n?.height ??
//     n?.style?.height ??
//     n?.measured?.height ??
//     fallbackH;

//   return { w: Number(w), h: Number(h) };
// }
function getNodeSize(rf: any, id: string, fallbackW: number, fallbackH: number) {
  const n = rf.getNode(id);

  const w =
    n?.width ??
    n?.style?.width ??
    n?.measured?.width ??
    fallbackW;

  const h =
    n?.height ??
    n?.style?.height ??
    n?.measured?.height ??
    fallbackH;

  return { w: Number(w), h: Number(h) };
}

/** Rectangle */
export function RectNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  return (
    <div className="relative overflow-visible min-w-[160px] rounded-xl border border-slate-300 bg-white shadow-sm px-3 py-3">
      <NodeResizer
        isVisible={!!selected}
        minWidth={160}
        minHeight={64}
        handleClassName="bg-white border border-slate-400"
      />
      <CommonHandles />
      <LabelEditor id={id} label={label} />
    </div>
  );
}

/** Database (Cylinder) */
export function DbNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  return (
    <div className="relative overflow-visible min-w-[150px]">
      <NodeResizer
        isVisible={!!selected}
        minWidth={180}
        minHeight={90}
        handleClassName="bg-white border border-slate-400"
      />
      <CommonHandles />
      <div className="relative rounded-xl border border-slate-300 bg-white shadow-sm px-3 py-3">
        <div className="pointer-events-none absolute left-0 right-0 -top-[10px] mx-auto h-[18px] w-[calc(100%-18px)] rounded-full border border-slate-300 bg-white" />
        <div className="pointer-events-none absolute left-0 right-0 -bottom-[10px] mx-auto h-[18px] w-[calc(100%-18px)] rounded-full border border-slate-300 bg-white" />
        <div className="pt-2 pb-2">
          <LabelEditor id={id} label={label} />
        </div>
      </div>
    </div>
  );
}

/** Diamond (Decision) */
// export function DiamondNode({ id, data, selected, height, width , style }: NodeProps<ShapeData>) {
//   const label = data?.label || "";

//   const w = (width ?? (style?.width as number) ?? 140) as number;
//   const h = (height ?? (style?.height as number) ?? 140) as number;
//   const size = Math.min(w, h); // keep it square so diamond looks correct

//   return (
//     <div
//       className="relative overflow-visible"
//       style={{ width: size, height: size }}
//     >
//       <NodeResizer
//         isVisible={!!selected}
//         minWidth={120}
//         minHeight={120}
//         keepAspectRatio
//         handleClassName="bg-white border border-slate-400"
//       />

//       <CommonHandles />

//       <div className="pointer-events-none absolute inset-0 rotate-45 rounded-xl border border-slate-300 bg-white shadow-sm" />
//       <div className="absolute inset-0 flex items-center justify-center px-3">
//         <div className="-rotate-45 w-full">
//           <LabelEditor id={id} label={label} />
//         </div>
//       </div>
//     </div>
//   );
// }
export function DiamondNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  const rf = useReactFlow();

  const { w, h } = getNodeSize(rf as any, id, 140, 140);
  const size = Math.min(w, h);

  return (
    <div className="relative overflow-visible" style={{ width: size, height: size }}>
      <NodeResizer
        isVisible={!!selected}
        keepAspectRatio
        minWidth={120}
        minHeight={120}
        handleStyle={{
          width: 16,
          height: 16,
          borderRadius: 6,
          border: "2px solid #64748b",
          background: "#fff",
          zIndex: 9999,
        }}
        lineStyle={{ border: "1px solid #94a3b8", zIndex: 9999 }}
      />

      <CommonHandles />

      {/* true diamond from square */}
      <div className="pointer-events-none absolute inset-0 rotate-45 rounded-xl border border-slate-300 bg-white shadow-sm" />

      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div className=" w-full">
          <LabelEditor id={id} label={label} />
        </div>
      </div>
    </div>
  );
}

/* Circle */
// export function CircleNode({ id, data, selected, width, height, style }: NodeProps<ShapeData>) {
//   const label = data?.label || "";

//   // const w = (style?.width as number) ?? 140;
//   // const h = (style?.height as number) ?? 140;
//   const w = (width ?? (style?.width as number) ?? 140) as number;
//   const h = (height ?? (style?.height as number) ?? 140) as number;
//   const size = Math.min(w, h); // keep it a perfect circle

//   return (
//     // <div
//     //   className="relative overflow-visible"
//     //   style={{ width: size, height: size }}
//     // >
//     //   <NodeResizer
//     //     isVisible={!!selected}
//     //     minWidth={120}
//     //     minHeight={120}
//     //     keepAspectRatio
//     //     handleClassName="bg-white border border-slate-400"
//     //   />

//     //   <CommonHandles />

//     //   <div className="pointer-events-none absolute inset-0 rounded-full border border-slate-300 bg-white shadow-sm" />
//     //   <div className="absolute inset-0 flex items-center justify-center px-3">
//     //     <LabelEditor id={id} label={label} />
//     //   </div>
//     // </div>
//     <div className="relative overflow-visible" style={{ width: w, height: h }}>
//       <NodeResizer
//         isVisible={!!selected}
//         keepAspectRatio
//         minWidth={120}
//         minHeight={120}
//         // make handles MUCH easier to grab
//         handleStyle={{
//           width: 16,
//           height: 16,
//           borderRadius: 6,
//           border: "2px solid #64748b",
//           background: "#fff",
//           zIndex: 9999,
//         }}
//         lineStyle={{ border: "1px solid #94a3b8", zIndex: 9999 }}
//       />

//       <CommonHandles />

//       <div className="pointer-events-none absolute inset-0 rounded-full border border-slate-300 bg-white shadow-sm" />
//       <div className="absolute inset-0 flex items-center justify-center px-3">
//         <LabelEditor id={id} label={label} />
//       </div>
//     </div>
//   );
// }
export function CircleNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  const rf = useReactFlow();

  const { w, h } = getNodeSize(rf as any, id, 140, 140);
  const size = Math.min(w, h);

  return (
    <div className="relative overflow-visible" style={{ width: size, height: size }}>
      <NodeResizer
        isVisible={!!selected}
        keepAspectRatio
        minWidth={120}
        minHeight={120}
        handleStyle={{
          width: 16,
          height: 16,
          borderRadius: 6,
          border: "2px solid #64748b",
          background: "#fff",
          zIndex: 9999,
        }}
        lineStyle={{ border: "1px solid #94a3b8", zIndex: 9999 }}
      />

      <CommonHandles />

      <div className="pointer-events-none absolute inset-0 rounded-full border border-slate-300 bg-white shadow-sm" />
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <LabelEditor id={id} label={label} />
      </div>
    </div>
  );
}

/** Triangle */
// export function TriangleNode({ id, data, selected, width, height, style }: NodeProps<ShapeData>) {
//   const label = data?.label || "";

//   const w = (width ?? (style?.width as number) ?? 140) as number;
//   const h = (height ?? (style?.height as number) ?? 140) as number;

//   return (
//     <div className="relative overflow-visible" style={{ width: w, height: h }}>
//       <NodeResizer
//         isVisible={!!selected}
//         minWidth={140}
//         minHeight={120}
//         handleClassName="bg-white border border-slate-400"
//       />

//       <CommonHandles />

//       <svg
//         className="pointer-events-none absolute inset-0"
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//       >
//         {/* Border */}
//         <polygon points="50,5 95,95 5,95" fill="white" stroke="#cbd5e1" strokeWidth="2" />
//       </svg>

//       <div className="absolute inset-0 flex items-center justify-center px-4 pt-4">
//         <LabelEditor id={id} label={label} />
//       </div>
//     </div>
//   );
// }
export function TriangleNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  const rf = useReactFlow();

  const { w, h } = getNodeSize(rf as any, id, 170, 150);

  return (
    <div className="relative overflow-visible" style={{ width: w, height: h }}>
      <NodeResizer
        isVisible={!!selected}
        minWidth={140}
        minHeight={120}
        handleStyle={{
          width: 16,
          height: 16,
          borderRadius: 6,
          border: "2px solid #64748b",
          background: "#fff",
          zIndex: 9999,
        }}
        lineStyle={{ border: "1px solid #94a3b8", zIndex: 9999 }}
      />

      <CommonHandles />

      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="50,5 95,95 5,95"
          fill="white"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center px-4 pt-4">
        <LabelEditor id={id} label={label} />
      </div>
    </div>
  );
}

/** Text-only */
export function TextNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";

  //V2
  return (
    <div className="relative overflow-visible min-w-[140px] max-w-[280px] px-5 py-5">
      <NodeResizer
        isVisible={!!selected}
        minWidth={180}
        minHeight={64}
        handleClassName="bg-white border border-slate-400"
      />
      <CommonHandles gap={9} />
      <div className="relative z-10 bg-transparent">
        <LabelEditor id={id} label={label} />
      </div>
    </div>
  );
}