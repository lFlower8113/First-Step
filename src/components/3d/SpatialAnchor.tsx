"use client";

import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { GuideAnchor } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { soundManager } from "@/lib/sound";
import { ChevronRight } from "lucide-react";

interface SpatialAnchorProps {
  anchor: GuideAnchor;
  onSelect: (anchor: GuideAnchor) => void;
}

export const SpatialAnchor: React.FC<SpatialAnchorProps> = ({ anchor, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const { selectedAnchorId, isDrawerOpen, soundEnabled } = useAppStore();
  const isSelected = selectedAnchorId === anchor.id;

  // When drawer is open and this anchor is selected, we hide the bulky text pill
  // so it never obstructs the right-hand guide card!
  const hidePill = isSelected && isDrawerOpen;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) soundManager.playGlide();
    onSelect(anchor);
  };

  return (
    <group position={anchor.position}>
      {/* 3D Root Ground Glowing Beacon Ring */}
      <group position={[0, -0.6, 0]}>
        {/* Outer Pulsing Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.24, 32]} />
          <meshBasicMaterial
            color={isSelected ? "#10b981" : "#38bdf8"}
            transparent
            opacity={isSelected ? 0.9 : 0.6}
          />
        </mesh>
        {/* Center Target Dot */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshBasicMaterial color={isSelected ? "#34d399" : "#7dd3fc"} />
        </mesh>
      </group>

      {/* Screen-Space Razor-Sharp Projected HTML Overlay with low zIndex (Never blocks drawer!) */}
      <Html
        position={[0, 0, 0]}
        center
        zIndexRange={[15, 0]}
        style={{
          pointerEvents: hidePill ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: hidePill ? 0 : 1,
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        <div
          onClick={handleClick}
          onMouseEnter={() => {
            setHovered(true);
            if (soundEnabled && !isSelected) soundManager.playPop();
          }}
          onMouseLeave={() => setHovered(false)}
          className="cursor-pointer select-none flex flex-col items-center group -translate-y-4"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          }}
        >
          {/* Razor-sharp Label Pill */}
          <div
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 shadow-xl backdrop-blur-md ${
              isSelected
                ? "bg-emerald-500 text-white font-bold ring-2 ring-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                : hovered
                ? "bg-neutral-900/95 text-emerald-300 border border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "bg-neutral-950/85 text-white border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            }`}
          >
            {/* Blinking Live Indicator Dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isSelected
                  ? "bg-white animate-ping"
                  : "bg-emerald-400 shadow-[0_0_6px_#34d399]"
              }`}
            />

            {/* Crisp Clear Label Text */}
            <span className="text-xs font-semibold tracking-tight whitespace-nowrap leading-none">
              {anchor.title}
            </span>

            <ChevronRight
              className={`w-3 h-3 shrink-0 transition-transform ${
                isSelected || hovered ? "translate-x-0.5 text-white" : "text-neutral-400"
              }`}
            />
          </div>

          {/* Downward Anchor Pin Stem */}
          <div className="flex flex-col items-center">
            <div
              className={`w-0.5 h-3 transition-colors ${
                isSelected ? "bg-emerald-400" : "bg-white/60 group-hover:bg-emerald-400"
              }`}
            />
            <div
              className={`w-1.5 h-1.5 rounded-full border transition-all ${
                isSelected
                  ? "border-emerald-300 bg-emerald-400 scale-125 shadow-[0_0_8px_#10b981]"
                  : "border-white bg-white/40 group-hover:border-emerald-400 group-hover:bg-emerald-400"
              }`}
            />
          </div>
        </div>
      </Html>
    </group>
  );
};
