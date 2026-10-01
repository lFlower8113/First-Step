"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { SCENARIOS } from "@/lib/scenarios";
import {
  Compass,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Plane,
  Presentation,
} from "lucide-react";
import { soundManager } from "@/lib/sound";

export type AppExperienceMode = "flight" | "guides" | "fog" | "deck";

interface NavbarProps {
  appMode?: AppExperienceMode;
  onModeChange?: (mode: AppExperienceMode) => void;
}

const MODES: {
  id: AppExperienceMode;
  label: string;
  icon: React.ReactNode;
  activeBg: string;
  activeGlow: string;
}[] = [
  {
    id: "flight",
    label: "第一次坐飞机 (MVP)",
    icon: <Plane className="w-3.5 h-3.5" />,
    activeBg: "bg-sky-500",
    activeGlow: "shadow-[0_0_16px_rgba(14,165,233,0.6)]",
  },
  {
    id: "guides",
    label: "实景空间向导",
    icon: <Compass className="w-3.5 h-3.5" />,
    activeBg: "bg-emerald-600",
    activeGlow: "shadow-[0_0_16px_rgba(16,185,129,0.6)]",
  },
  {
    id: "fog",
    label: "雾中之门",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    activeBg: "bg-purple-600",
    activeGlow: "shadow-[0_0_16px_rgba(168,85,247,0.6)]",
  },
  {
    id: "deck",
    label: "项目演示 (PPT)",
    icon: <Presentation className="w-3.5 h-3.5" />,
    activeBg: "bg-amber-500",
    activeGlow: "shadow-[0_0_16px_rgba(245,158,11,0.6)]",
  },
];

export const Navbar: React.FC<NavbarProps> = ({ appMode = "flight", onModeChange }) => {
  const {
    viewMode,
    setViewMode,
    resetView,
    soundEnabled,
    toggleSound,
  } = useAppStore();

  const handleHomeClick = () => {
    if (soundEnabled) soundManager.playPop();
    setViewMode("hall");
  };

  const handleResetCamera = () => {
    if (soundEnabled) soundManager.playGlide();
    resetView();
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl pointer-events-auto">
      <div className="relative backdrop-blur-2xl bg-black/75 border border-white/20 rounded-full px-4 sm:px-6 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] flex items-center justify-between min-h-[52px]">
        {/* Left: Brand Logo & Title */}
        <div
          onClick={handleHomeClick}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0 z-20"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 p-[1.5px] shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            <div className="w-full h-full rounded-full bg-black/85 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">FirstStep</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 hidden sm:inline">
                第一次
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher Tabs with Smooth Spring Sliding Pill Animation! */}
        {/* Perfectly centered absolutely so switching right buttons never shifts tabs */}
        {onModeChange && (
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-white/[0.06] border border-white/10 p-1 rounded-full gap-1 backdrop-blur-xl z-10 shadow-lg">
            {MODES.map((mode) => {
              const isActive = appMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    onModeChange(mode.id);
                  }}
                  className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 z-10 ${
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {/* Sliding Spring Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-mode-pill"
                      transition={{ type: "spring", damping: 25, stiffness: 350 }}
                      className={`absolute inset-0 rounded-full ${mode.activeBg} ${mode.activeGlow} -z-10`}
                    />
                  )}
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0 z-20">
          {/* In 3D: Return to Hall & Reset Camera */}
          {appMode === "guides" && viewMode === "3d" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleHomeClick}
                title="返回场景选择大厅"
                className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">场景大厅</span>
              </button>
              <button
                onClick={handleResetCamera}
                title="复位视角"
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">复位</span>
              </button>
            </div>
          )}

          {/* PPT Presentation Button */}
          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            title="新标签页全屏放映 PPT"
            className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-400/40 hover:border-amber-400/80 text-xs font-medium text-amber-300 flex items-center gap-1.5 transition-all shadow-[0_0_14px_rgba(245,158,11,0.25)] hover:scale-105 group"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>PPT 演示</span>
          </a>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-neutral-300 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
