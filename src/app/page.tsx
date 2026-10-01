"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, AppExperienceMode } from "@/components/ui/Navbar";
import { WelcomePage } from "@/components/ui/WelcomePage";
import { FirstFlightOverlay } from "@/components/ui/FirstFlightOverlay";
import { FlightReflectionCard } from "@/components/ui/FlightReflectionCard";
import { FoggyOverlay } from "@/components/ui/FoggyOverlay";
import { CourageCard } from "@/components/ui/CourageCard";
import { Hero } from "@/components/ui/Hero";
import { GuideDrawer } from "@/components/ui/GuideDrawer";
import { useAppStore } from "@/lib/store";
import { soundManager } from "@/lib/sound";

// 1. 旗舰 MVP：第一次坐飞机伴随式互动模拟
const FirstFlightExperienceScene = dynamic(
  () =>
    import("@/components/3d/FirstFlightExperienceScene").then(
      (mod) => mod.FirstFlightExperienceScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        <p className="text-xs tracking-wider text-sky-300 font-medium">
          正在加载航站楼三维场景...
        </p>
      </div>
    ),
  }
);

// 2. 实景空间向导三维漫游 (星巴克、三甲医院、机场)
const SceneViewer3D = dynamic(
  () => import("@/components/3d/SceneViewer3D").then((mod) => mod.SceneViewer3D),
  { ssr: false }
);

// 3. 雾中之门哲思模拟
const FoggyDoorScene = dynamic(
  () => import("@/components/3d/FoggyDoorScene").then((mod) => mod.FoggyDoorScene),
  { ssr: false }
);

export default function Home() {
  // General Welcome Page Landing State
  const [hasEnteredWelcome, setHasEnteredWelcome] = useState<boolean>(false);
  // Cinematic Transition State to eliminate black screen
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // App experience mode: 'flight' | 'guides' | 'fog'
  const [appMode, setAppMode] = useState<AppExperienceMode>("flight");
  const { viewMode } = useAppStore();

  const handleEnter = () => {
    setIsTransitioning(true);
    setHasEnteredWelcome(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden select-none">
      {/* 1. Cinematic Portal Transition Overlay (光效过渡，彻底消除黑屏闪烁) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Luminous Light Tunnel Radial Bloom */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.8, 2.5], opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,rgba(14,165,233,0.08)_50%,transparent_70%)] blur-3xl"
            />
            {/* Horizontal Light Ray */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1.4, 1.8], opacity: [0, 0.75, 0] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_30px_rgba(56,189,248,0.9)]"
            />
            {/* Stage Waypoint Micro-toast */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -8], scale: [0.96, 1, 1, 1.02] }}
              transition={{ duration: 1.0, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center space-y-1.5 bg-slate-950/70 backdrop-blur-2xl border border-sky-400/25 px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span className="text-[10px] font-mono tracking-[0.28em] text-sky-300 uppercase">
                  SPATIAL ACCLIMATIZATION MATRIX
                </span>
              </div>
              <div className="text-base font-medium tracking-widest text-white">
                正在进入 · 民航航站楼具身实景
              </div>
              <div className="text-[11px] text-neutral-400 font-light tracking-wider">
                建立肌肉记忆 · 重塑空间掌控感
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 总欢迎页 (Landing Page with "迈出第一步") */}
      <AnimatePresence>
        {!hasEnteredWelcome && (
          <WelcomePage onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {/* 3. Top Persistent Unified Navbar (Hidden on Welcome Page) */}
      {hasEnteredWelcome && (
        <Navbar
          appMode={appMode}
          onModeChange={(newMode) => {
            setAppMode(newMode);
          }}
        />
      )}

      {/* 4. Main Experience Viewport */}
      <div className="relative w-full h-full min-h-screen">
        {/* ================= 模式 1：第一次坐飞机 (Flagship MVP) ================= */}
        {appMode === "flight" && (
          <div className="relative w-full h-screen">
            <FirstFlightExperienceScene />
            {hasEnteredWelcome && (
              <FirstFlightOverlay onSwitchToGuides={() => setAppMode("guides")} />
            )}
            {hasEnteredWelcome && (
              <FlightReflectionCard onSwitchToGuides={() => setAppMode("guides")} />
            )}
          </div>
        )}

        {/* ================= 模式 2：公共空间实景向导 (星巴克、三甲医院、机场) ================= */}
        {appMode === "guides" && (
          <div className="relative w-full min-h-screen">
            <AnimatePresence mode="wait">
              {viewMode === "hall" ? (
                <motion.div
                  key="guides-hall"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full min-h-screen"
                >
                  <Hero />
                </motion.div>
              ) : (
                <motion.div
                  key="guides-3d"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-screen"
                >
                  <SceneViewer3D />
                  <GuideDrawer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================= 模式 3：雾中之门 (哲思空间) ================= */}
        {appMode === "fog" && (
          <div className="relative w-full h-screen">
            <FoggyDoorScene />
            <FoggyOverlay appMode={appMode} onModeChange={setAppMode} />
            <CourageCard
              onStartFlight={() => setAppMode("flight")}
              onExploreGuides={() => setAppMode("guides")}
            />
          </div>
        )}
      </div>
    </main>
  );
}
