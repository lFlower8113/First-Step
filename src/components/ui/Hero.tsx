"use client";

import React, { useState, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { SCENARIOS } from "@/lib/scenarios";
import { TiltCard } from "./TiltCard";
import { Spotlight } from "./Spotlight";
import { soundManager } from "@/lib/sound";
import {
  Compass,
  Coffee,
  Activity,
  Plane,
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers,
} from "lucide-react";

export const Hero: React.FC = () => {
  const { selectScenario, soundEnabled } = useAppStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax gravity balance board tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Coffee":
        return <Coffee className="w-5 h-5 text-emerald-400" />;
      case "Activity":
        return <Activity className="w-5 h-5 text-sky-400" />;
      case "Plane":
        return <Plane className="w-5 h-5 text-indigo-400" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white flex flex-col justify-between selection:bg-emerald-500/30"
    >
      {/* Dynamic Aceternity Style Background Lighting */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00754A" />
      <Spotlight className="top-1/3 -right-20 md:right-10" fill="#0284c7" />

      {/* Subtle Mesh Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,117,74,0.18),rgba(255,255,255,0))]" />

      {/* Floating Parallax Fragments (Scattering & Hovering Gravity Balance) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {[
          { icon: "☕", x: "12%", y: "22%", speed: 30, size: "text-2xl" },
          { icon: "✈️", x: "85%", y: "18%", speed: -40, size: "text-2xl" },
          { icon: "🎫", x: "78%", y: "65%", speed: 25, size: "text-xl" },
          { icon: "🏥", x: "8%", y: "70%", speed: -35, size: "text-2xl" },
          { icon: "📍", x: "90%", y: "82%", speed: 50, size: "text-xl" },
          { icon: "🧭", x: "20%", y: "85%", speed: -20, size: "text-xl" },
        ].map((frag, idx) => (
          <div
            key={idx}
            className={`absolute ${frag.size} opacity-40 select-none transition-transform duration-700 ease-out`}
            style={{
              left: frag.x,
              top: frag.y,
              transform: `translate(${mousePos.x * frag.speed}px, ${mousePos.y * frag.speed}px) rotate(${mousePos.x * 20}deg)`,
            }}
          >
            {frag.icon}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 flex flex-col justify-center">
        {/* Top Badges & Main Title with Parallax Tilt Board */}
        <div
          className="text-center max-w-3xl mx-auto space-y-6 transition-transform duration-500 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg)`,
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-xs sm:text-sm font-medium text-emerald-300 shadow-[0_4px_20px_rgba(0,117,74,0.25)]">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>公共空间新手 3D 交互向导</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-white">First Step</span>
            <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              迈出从容的第一步
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            通过高精度 3D 空间交互与关键环节拆解，带你提前熟悉机场、医院、咖啡厅真实动线与实操流程。
          </p>

          {/* Core Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 三维场景实景还原
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 关键动线节点指引
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 现场实操避坑小抄
            </span>
          </div>
        </div>

        {/* 3D Liquid Glass Parallax Scenario Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SCENARIOS.map((scenario) => {
            const isStarbucks = scenario.id === "starbucks-first-order";
            return (
              <div
                key={scenario.id}
                onClick={() => {
                  if (soundEnabled) soundManager.playGlide();
                  selectScenario(scenario.id);
                }}
              >
                <TiltCard
                  maxTilt={10}
                  scale={1.03}
                  glowColor={
                    isStarbucks
                      ? "rgba(0, 117, 74, 0.4)"
                      : scenario.id === "hospital-first-visit"
                      ? "rgba(14, 165, 233, 0.35)"
                      : "rgba(99, 102, 241, 0.35)"
                  }
                  className="h-full group p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category & Step Count */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-neutral-200">
                        {getIcon(scenario.iconName)}
                        <span>{scenario.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>{scenario.anchors.length} 个空间节点</span>
                      </div>
                    </div>

                    {/* Scenario Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                      <span>{scenario.name}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
                    </h3>

                    {/* Scenario Subtitle */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                      {scenario.subtitle}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {scenario.tags?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{scenario.stats?.avgTime}</span>
                    </span>
                    <span className="font-semibold text-emerald-400 group-hover:underline flex items-center gap-1">
                      进入 3D 空间 &rarr;
                    </span>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Quote */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-neutral-500 border-t border-white/5 backdrop-blur-sm">
        “Every journey begins with the first step. 凡未至之处，皆有迹可循。” &copy; First Step 2026
      </footer>
    </div>
  );
};
