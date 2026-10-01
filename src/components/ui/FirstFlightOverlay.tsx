"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlightExperienceStore } from "@/lib/flight-experience-store";
import { soundManager } from "@/lib/sound";
import { ambientSound } from "@/lib/ambient-sound";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Luggage,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

interface FirstFlightOverlayProps {
  onSwitchToGuides?: () => void;
}

export const FirstFlightOverlay: React.FC<FirstFlightOverlayProps> = ({
  onSwitchToGuides,
}) => {
  const {
    stage,
    flightState,
    soundEnabled,
    startExperience,
    confirmPreSafe,
    advanceToFindFlight,
    completeFindFlight,
    completeFollowPath,
    putItemInTray,
    completeSecurityScan,
    completeBoardingGate,
    goToPrevStep,
  } = useFlightExperienceStore();

  const { flightFound, pathFollowed, trayItems, trayScanned } = flightState;
  const [showExtraHint, setShowExtraHint] = useState(false);

  // Sound initialization & stage ambient cues
  useEffect(() => {
    if (stage === "observe") {
      ambientSound.startDrone();
      // Auto advance to find flight after 5.5s observation if user hasn't clicked
      const timer = window.setTimeout(() => {
        advanceToFindFlight();
      }, 5500);
      return () => clearTimeout(timer);
    } else if (stage === "guide_find_flight") {
      // If user pauses for more than 7s, gently lower the difficulty
      const timer = window.setTimeout(() => {
        setShowExtraHint(true);
      }, 7000);
      return () => clearTimeout(timer);
    } else if (stage === "boarding_gate") {
      // Warm chord in boarding gate
      if (soundEnabled) soundManager.playSuccess();
    }
  }, [stage, advanceToFindFlight, soundEnabled]);

  // Handle Tray item clicks
  const handleItemClick = (id: string) => {
    if (soundEnabled) soundManager.playPop();
    putItemInTray(id);
  };

  // Check if all 3 security items placed
  const allItemsInTray = trayItems.length >= 3;
  const isIntroOrSafe = stage === "intro" || stage === "pre_safe";

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 text-white">
      {/* Top Floating "退回上一步" Pill Button (Available across all steps) */}
      {stage !== "intro" && (
        <div className="fixed top-20 left-4 sm:left-6 z-40 pointer-events-auto">
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playPop();
              goToPrevStep();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-sky-400/50 backdrop-blur-2xl text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)] group"
            title="退回上一步"
          >
            <ChevronLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>退回上一步</span>
          </button>
        </div>
      )}

      {/* Top spacer to leave room for the unified root Navbar */}
      <div className="w-full h-12" />

      {/* ================= INTERACTIVE GUIDANCE CARDS ================= */}
      {/* When in intro/pre_safe: center in screen. When in 3D: docked cleanly at BOTTOM to prevent blocking view! */}
      <main
        className={`pointer-events-auto flex flex-col items-center w-full max-w-lg mx-auto text-center transition-all duration-500 ${
          isIntroOrSafe ? "my-auto" : "mt-auto mb-4"
        }`}
      >
        <AnimatePresence mode="wait">
          {/* 1. INTRO STAGE (首页) */}
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg p-7 sm:p-9 rounded-3xl bg-slate-950/85 border border-sky-400/25 backdrop-blur-2xl space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.15)] flex flex-col items-center text-center"
            >
              {/* Minimal Warm Breathing Light Dot */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.9)]"
                />
                <div className="absolute w-8 h-8 rounded-full bg-amber-400/20 blur-md" />
              </div>

              {/* Clean Concise Copy */}
              <div className="space-y-2.5">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-400 font-semibold">
                  首次乘机全流程导引
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  大屏核验 · 路线指引 · 安检 · 登机
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal">
                  4 步即可走完全部流程，一步换景，沉浸式三维第一视角导引。
                </p>
              </div>

              {/* High-Contrast Primary CTA Button */}
              <button
                onClick={() => {
                  if (soundEnabled) soundManager.playPop();
                  startExperience();
                }}
                className="group relative px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(14,165,233,0.45)] hover:shadow-[0_0_35px_rgba(14,165,233,0.7)] flex items-center gap-2 cursor-pointer"
              >
                <span className="tracking-wider">开始体验</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* 2. PRE-SAFE PROMPT (安全前导，消除压力) */}
          {stage === "pre_safe" && (
            <motion.div
              key="pre_safe"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-8 rounded-3xl bg-neutral-950/85 border border-white/15 backdrop-blur-2xl max-w-md space-y-5 shadow-2xl"
            >
              <div className="space-y-2 text-neutral-300 text-sm leading-relaxed font-light">
                <p className="text-white font-medium text-base">模拟演练说明</p>
                <p>无需提前了解机场规则，跟随界面提示即可一步步完成流程。</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    goToPrevStep();
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15 text-xs font-medium transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>首页</span>
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    confirmPreSafe();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                >
                  进入航站楼
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. OBSERVE STAGE (阶段 1：环顾大厅 - 底部轻量胶囊) */}
          {stage === "observe" && (
            <motion.div
              key="observe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="px-5 py-3 rounded-2xl bg-neutral-950/85 border border-white/15 backdrop-blur-2xl max-w-md space-y-2 shadow-2xl"
            >
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1.5">
                <span className="tracking-wide text-sky-400 font-semibold">
                  航站楼全景
                </span>
                <span className="text-[10px] text-neutral-400">可拖拽旋转视角</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                熟悉大厅布局后，点击开始第一步操作。
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    goToPrevStep();
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>上一步</span>
                </button>
                <button
                  onClick={advanceToFindFlight}
                  className="text-[11px] text-sky-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>第一步：核验航班</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. GUIDE FIND FLIGHT (阶段 2：找到航班 FS001 - 底部轻量卡片) */}
          {stage === "guide_find_flight" && (
            <motion.div
              key="find_flight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-neutral-950/85 border border-white/15 backdrop-blur-2xl space-y-3.5 shadow-2xl"
            >
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (soundEnabled) soundManager.playPop();
                      goToPrevStep();
                    }}
                    title="退回上一步"
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-sky-400 font-bold">
                      STEP 01
                    </span>
                    <h3 className="text-sm font-medium text-white">核对航班信息</h3>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 font-light">
                  点击确认航班
                </span>
              </div>

              {/* Clickable Flight Pill Option */}
              <button
                onClick={() => {
                  if (soundEnabled) soundManager.playSuccess();
                  completeFindFlight();
                }}
                className={`w-full p-2.5 sm:p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  flightFound
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200"
                    : "bg-white/[0.06] hover:bg-white/[0.12] border-sky-400/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                    <Compass className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-sky-300 block">
                      FS 001
                    </span>
                    <span className="text-[10px] text-neutral-300">
                      北京大兴 PKX • 14:30 • F 岛值机
                    </span>
                  </div>
                </div>
                {flightFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-400 text-slate-950 font-medium">
                    点击确认
                  </span>
                )}
              </button>

              {/* Reassuring Feedback after finding */}
              {flightFound && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 pt-1"
                >
                  <p className="text-xs text-emerald-300">
                    航班已确认，前往安检通道。
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (soundEnabled) soundManager.playPop();
                        goToPrevStep();
                      }}
                      className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-all flex items-center gap-1 shrink-0"
                      title="退回上一步"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>上一步</span>
                    </button>
                    <button
                      onClick={() => {
                        if (soundEnabled) soundManager.playGlide();
                        useFlightExperienceStore.getState().setStage("guide_path");
                      }}
                      className="flex-1 py-2 rounded-full bg-white text-slate-950 font-medium text-xs tracking-wider hover:bg-neutral-200 transition-all shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <span>前往安检区</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Extra gentle guidance if user pauses */}
              {showExtraHint && !flightFound && (
                <p className="text-[10px] text-neutral-400">
                  点击大屏或上方卡片确认 FS001 航班。
                </p>
              )}
            </motion.div>
          )}

          {/* 5. GUIDE PATH STAGE (阶段 3：跟随路径) */}
          {stage === "guide_path" && (
            <motion.div
              key="guide_path"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-md p-3.5 sm:p-4 rounded-2xl bg-neutral-950/85 border border-sky-400/30 backdrop-blur-2xl space-y-2.5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    STEP 02
                  </span>
                  <h3 className="text-xs sm:text-sm font-medium text-white">
                    沿黄色导引线前行
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-sky-300">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>导向就绪</span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-light">
                跟随地面黄色导流标线，直行前往安全检查区。
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    goToPrevStep();
                  }}
                  className="px-3.5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-all flex items-center gap-1 shrink-0"
                  title="退回上一步"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>上一步</span>
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    completeFollowPath();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2"
                >
                  <span>进入安检区</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. GUIDE SECURITY STAGE (阶段 4：安全检查) */}
          {stage === "guide_security" && (
            <motion.div
              key="guide_security"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-md p-3.5 sm:p-4 rounded-2xl bg-neutral-950/85 border border-white/15 backdrop-blur-2xl space-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (soundEnabled) soundManager.playPop();
                      goToPrevStep();
                    }}
                    title="退回上一步"
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    STEP 03
                  </span>
                  <h3 className="text-xs sm:text-sm font-medium text-white">
                    放置随身物品
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400">
                  {trayItems.length}/3 已放置
                </span>
              </div>

              {/* 3 Interactive Items to Put into Tray */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Phone */}
                <button
                  onClick={() => handleItemClick("phone")}
                  disabled={trayItems.includes("phone")}
                  className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    trayItems.includes("phone")
                      ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 opacity-80"
                      : "bg-white/[0.06] hover:bg-white/[0.14] border-white/15 text-white shadow-sm"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] font-medium">手机</span>
                  <span className="text-[8px] text-neutral-400">
                    {trayItems.includes("phone") ? "已入托盘" : "点击放入"}
                  </span>
                </button>

                {/* 2. Bag */}
                <button
                  onClick={() => handleItemClick("bag")}
                  disabled={trayItems.includes("bag")}
                  className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    trayItems.includes("bag")
                      ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 opacity-80"
                      : "bg-white/[0.06] hover:bg-white/[0.14] border-white/15 text-white shadow-sm"
                  }`}
                >
                  <Luggage className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-medium">随身背包</span>
                  <span className="text-[8px] text-neutral-400">
                    {trayItems.includes("bag") ? "已入托盘" : "点击放入"}
                  </span>
                </button>

                {/* 3. Jacket */}
                <button
                  onClick={() => handleItemClick("jacket")}
                  disabled={trayItems.includes("jacket")}
                  className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    trayItems.includes("jacket")
                      ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 opacity-80"
                      : "bg-white/[0.06] hover:bg-white/[0.14] border-white/15 text-white shadow-sm"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-dashed border-amber-400/70 flex items-center justify-center text-[9px] text-amber-300 font-bold">
                    🧥
                  </div>
                  <span className="text-[10px] font-medium">厚外套</span>
                  <span className="text-[8px] text-neutral-400">
                    {trayItems.includes("jacket") ? "已入托盘" : "点击放入"}
                  </span>
                </button>
              </div>

              {/* Progress & Next Step Trigger */}
              {allItemsInTray && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2 pt-1"
                >
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>物品已放入传送带开始扫描</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-light">
                    请通过金属探测门，前往前方登机口。
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (soundEnabled) soundManager.playPop();
                        goToPrevStep();
                      }}
                      className="px-3.5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-all flex items-center gap-1 shrink-0"
                      title="退回上一步"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>上一步</span>
                    </button>
                    <button
                      onClick={() => {
                        if (soundEnabled) soundManager.playGlide();
                        completeSecurityScan();
                      }}
                      className="flex-1 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-1.5"
                    >
                      <span>前往 28 号登机口</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 7. BOARDING GATE STAGE (阶段 5：登机口到达) */}
          {stage === "boarding_gate" && (
            <motion.div
              key="boarding_gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-neutral-950/85 border border-amber-400/30 backdrop-blur-2xl space-y-3.5 shadow-[0_0_40px_rgba(251,191,36,0.15)] text-center"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>已到达 28 号登机口</span>
              </div>

              {/* Concise Clear Status */}
              <div className="space-y-1">
                <p className="text-base text-white font-medium">
                  首次乘机全流程演练完成
                </p>
                <p className="text-xs text-neutral-300 font-light">
                  大屏核对、地面导向、物品安检与登机通道已全部通关。
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    goToPrevStep();
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all flex items-center justify-center gap-1 shrink-0"
                  title="退回上一步"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>上一步</span>
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playSuccess();
                    completeBoardingGate();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-medium text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center justify-center gap-1.5"
                >
                  <span>查看通关报告</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= BOTTOM STATUS FOOTER ================= */}
      <footer className="pointer-events-auto flex items-center justify-between text-[10px] text-neutral-500 w-full pt-1">
        <div>
          {stage !== "intro" && (
            <span>
              当前流程：
              {stage === "guide_find_flight"
                ? "01 航显屏"
                : stage === "guide_path"
                ? "02 引导路径"
                : stage === "guide_security"
                ? "03 安全检查"
                : stage === "boarding_gate"
                ? "04 登机口"
                : "实景环境"}
            </span>
          )}
        </div>
        <div>
          <span>First Step • 空间新手向导</span>
        </div>
      </footer>
    </div>
  );
};
