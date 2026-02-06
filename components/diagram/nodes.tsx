"use client";

import React, { useMemo, useState } from "react";
import { Handle, Position, useReactFlow, NodeProps, NodeResizer } from "reactflow";

type ShapeData = {
  label?: string;
  fill?: string;
  border?: string; 
};

function getColors(data?: ShapeData) {
  return {
    fill: data?.fill ?? "#ffffff",
    border: data?.border ?? "#cbd5e1",
  };
}

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
          className="w-full bg-white/80 text-black rounded-md px-2 py-1 text-xs outline-none border border-slate-200 focus:ring-2 focus:ring-primary/30"
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
  const { fill, border } = getColors(data);
  return (
    <div 
      // className="relative overflow-visible min-w-[160px] rounded-xl border-2 border-slate-300 bg-white shadow-sm px-3 py-3"
      className="relative overflow-visible min-w-40 rounded-xl border-2 shadow-sm px-3 py-3"
      style={{ backgroundColor: fill, borderColor: border }}
    >
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
// Working Version
// export function DbNode({ id, data, selected }: NodeProps<ShapeData>) {
//   const label = data?.label || "";
//   return (
//     <div className="relative overflow-visible min-w-[150px]">
//       <NodeResizer
//         isVisible={!!selected}
//         minWidth={180}
//         minHeight={90}
//         handleClassName="bg-white border border-slate-400"
//       />
//       <CommonHandles />
//       <div className="relative rounded-xl border border-slate-300 bg-white shadow-sm px-3 py-3">
//         <div className="pointer-events-none absolute left-0 right-0 -top-[10px] mx-auto h-[18px] w-[calc(100%-18px)] rounded-full border border-slate-300 bg-white" />
//         <div className="pointer-events-none absolute left-0 right-0 -bottom-[10px] mx-auto h-[18px] w-[calc(100%-18px)] rounded-full border border-slate-300 bg-white" />
//         <div className="pt-2 pb-2">
//           <LabelEditor id={id} label={label} />
//         </div>
//       </div>
//     </div>
//   );
// }
export function DbNode({ id, data, selected }: NodeProps<ShapeData>) {
  const rf = useReactFlow();
  const label = data?.label || "";
  const { fill, border } = getColors(data);

  const { w, h } = getNodeSize(rf as any, id, 200, 120);

  // SVG geometry
  const rx = 14;
  const topH = Math.max(18, Math.min(28, h * 0.22)); // ellipse height scales
  const bottomY = h - topH / 2;

  return (
    <div className="relative overflow-visible  border-2" style={{ width: w, height: h }}>
      <NodeResizer
        isVisible={!!selected}
        minWidth={180}
        minHeight={100}
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

      <svg className="pointer-events-none absolute inset-0" width={w} height={h}>
        {/* Body */}
        <rect
          x={8}
          y={topH / 2}
          width={w - 16}
          height={h - topH}
          rx={rx}
          fill={fill}
          stroke={border}
          strokeWidth={2}
        />

        {/* Top ellipse */}
        <ellipse
          cx={w / 2}
          cy={topH / 2}
          rx={(w - 16) / 2}
          ry={topH / 2}
          fill={fill}
          stroke={border}
          strokeWidth={2}
        />

        {/* Bottom ellipse (dashed back curve + front curve) */}
        {/* Back curve */}
        <path
          d={`M ${8} ${bottomY} A ${(w - 16) / 2} ${topH / 2} 0 0 0 ${w - 8} ${bottomY}`}
          fill="none"
          stroke={border}
          strokeWidth={2}
          strokeDasharray="6 6"
          opacity={0.7}
        />
        {/* Front curve */}
        <path
          d={`M ${8} ${bottomY} A ${(w - 16) / 2} ${topH / 2} 0 0 1 ${w - 8} ${bottomY}`}
          fill="none"
          stroke={border}
          strokeWidth={2}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center px-3">
        <LabelEditor id={id} label={label} />
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
  const { fill, border } = getColors(data);
  const { w, h } = getNodeSize(rf as any, id, 140, 140);
  const size = Math.min(w, h);

  return (
    <div className="relative overflow-visible border-2" style={{ width: size, height: size, }}>
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
      <div 
        className="pointer-events-none absolute inset-0 rotate-45 rounded-xl border border-slate-300 bg-white shadow-sm" 
        //  backgroundColor: fill, borderColor: border
        style={{ backgroundColor: fill, borderColor: border }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div className="w-full">
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
  const { fill, border } = getColors(data);
  const { w, h } = getNodeSize(rf as any, id, 140, 140);
  const size = Math.min(w, h);

  return (
    <div className="relative overflow-visible border-2" style={{ width: size, height: size,  }}>
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

      <div 
        className="pointer-events-none absolute inset-0 rounded-full border border-slate-300 bg-white shadow-sm" 
        style={{ backgroundColor: fill, borderColor: border }}
      />
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
  const { fill, border } = getColors(data);
  const { w, h } = getNodeSize(rf as any, id, 170, 150);

  return (
    <div 
      className="relative overflow-visible" style={{ width: w, height: h, }}
    >
      <NodeResizer
        isVisible={!!selected}
        minWidth={140}
        minHeight={120}
        handleStyle={{
          width: 16,
          height: 16,
          borderRadius: 6,
          border: "0.5px solid #64748b",
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
          // fill="white"
          // stroke="#cbd5e1"
          fill={fill}
          stroke={border}
          strokeWidth="2"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center px-4 pt-4 font-black">
        <LabelEditor id={id} label={label} />
      </div>
    </div>
  );
}

/** Text-only */
export function TextNode({ id, data, selected }: NodeProps<ShapeData>) {
  const label = data?.label || "";
  const { fill, border } = getColors(data);
  //V2
  return (
    <div 
      className="relative overflow-visible min-w-[140px] max-w-[280px] px-5 py-5"
      style={{ backgroundColor: fill, borderColor: border }}  
    >
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

// Cloud node
export function CloudNode({ id, data, selected }: NodeProps<ShapeData>) {
  const rf = useReactFlow();
  const label = data?.label || "";
  const { fill, border } = getColors(data);

  const { w, h } = getNodeSize(rf as any, id, 200, 130);

  return (
    <div className="relative overflow-visible" style={{ width: w, height: h }}>
      <NodeResizer
        isVisible={!!selected}
        minWidth={170}
        minHeight={110}
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

      <svg className="pointer-events-none absolute inset-0" viewBox="0 0 200 130" preserveAspectRatio="none">
        <path
          d="
            M 55 95
            C 35 95, 20 82, 20 65
            C 20 50, 30 38, 44 36
            C 48 22, 62 12, 78 12
            C 90 12, 101 18, 108 28
            C 114 22, 123 18, 134 18
            C 154 18, 170 32, 172 52
            C 184 55, 192 66, 192 80
            C 192 98, 178 110, 160 110
            L 60 110
            C 57 110, 55 107, 55 104
            Z
          "
          fill={fill}
          stroke={border}
          strokeWidth="3"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center px-3">
        <LabelEditor id={id} label={label} />
      </div>
    </div>
  );
}