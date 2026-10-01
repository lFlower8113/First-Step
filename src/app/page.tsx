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

  // App experience mode: 'flight' | 'guides' | 'fog'
  const [appMode, setAppMode] = useState<AppExperienceMode>("flight");
  const { viewMode } = useAppStore();

  return (
    <main className="relative min-h-screen bg-black overflow-hidden select-none">
      {/* 1. 总欢迎页 (Landing Page with "迈出第一步") */}
      <AnimatePresence>
        {!hasEnteredWelcome && (
          <WelcomePage
            onEnter={() => {
              setHasEnteredWelcome(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. Top Persistent Unified Navbar (Hidden on Welcome Page) */}
      {hasEnteredWelcome && (
        <Navbar
          appMode={appMode}
          onModeChange={(newMode) => {
            setAppMode(newMode);
          }}
        />
      )}

      {/* Dynamic Animated Scene Transition (Cross-Fade + Soft Optical Blur) */}
      {hasEnteredWelcome && (
        <AnimatePresence mode="wait">
          <motion.div
            key={appMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative w-full h-full min-h-screen"
          >
            {/* ================= 模式 1：第一次坐飞机 (Flagship MVP) ================= */}
            {appMode === "flight" && (
              <div className="relative w-full h-screen">
                <FirstFlightExperienceScene />
                <FirstFlightOverlay onSwitchToGuides={() => setAppMode("guides")} />
                <FlightReflectionCard onSwitchToGuides={() => setAppMode("guides")} />
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

            {/* ================= 模式 4：项目答辩演示 (PPT) ================= */}
            {appMode === "deck" && (
              <div className="relative w-full h-screen">
                <iframe
                  src="/presentation.html"
                  className="w-full h-full border-none"
                  title="FirstStep 项目答辩汇报 PPT"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Floating Bottom-Right PPT Launcher Pill (Always Available) */}
      {hasEnteredWelcome && appMode !== "deck" && (
        <button
          onClick={() => setAppMode("deck")}
          title="切换至项目汇报演示 (PPT)"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/85 hover:bg-black text-amber-300 border border-amber-400/50 hover:border-amber-400 shadow-[0_4px_24px_rgba(245,158,11,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold tracking-wide">📽️ 项目答辩 (PPT)</span>
        </button>
      )}
    </main>
  );
}
