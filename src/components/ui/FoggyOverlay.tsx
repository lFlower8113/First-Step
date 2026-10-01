"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperienceStore } from "@/lib/experience-store";
import { ambientAudio } from "@/lib/ambient-sound";
import { soundManager } from "@/lib/sound";
import { Compass, Volume2, VolumeX, Sparkles, ArrowRight, Check } from "lucide-react";

import { AppExperienceMode } from "./Navbar";

interface FoggyOverlayProps {
  appMode?: AppExperienceMode;
  onModeChange?: (mode: AppExperienceMode) => void;
}

const FEAR_ITEMS = [
  {
    fear: "医院：不知道科室位置",
    reframed: "应对：门诊大厅有导医台与志愿者随时指引",
  },
  {
    fear: "咖啡厅：担心点单被追问",
    reframed: "应对：直接点招牌常规款，或手机提前下单",
  },
  {
    fear: "机场：担心行李不合规",
    reframed: "应对：充电宝随身带，大件与液体提前托运",
  },
];

export const FoggyOverlay: React.FC<FoggyOverlayProps> = ({ appMode = "fog", onModeChange }) => {
  const {
    stage,
    startExperience,
    soundEnabled,
    toggleSound,
    resetExperience,
  } = useExperienceStore();

  const [resolvedFears, setResolvedFears] = useState<number[]>([]);

  const handleToggleFear = (index: number) => {
    if (soundEnabled) soundManager.playPop();
    setResolvedFears((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleEnter = () => {
    if (soundEnabled) {
      ambientAudio.startDrone();
      soundManager.playPop();
    }
    startExperience();
  };

  return (
    <>
      {/* Floating Reset Button on Top Left when in observe/reveal */}
      {stage !== "intro" && (
        <div className="fixed top-20 left-4 sm:left-6 z-40 pointer-events-auto">
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playPop();
              resetExperience();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-purple-400/50 backdrop-blur-2xl text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            title="返回首页"
          >
            <span>← 返回首页</span>
          </button>
        </div>
      )}

      {/* STAGE: INTRO */}
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center bg-black/70 backdrop-blur-md pointer-events-auto"
          >
            <div className="max-w-xl space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-purple-500/15 border border-purple-400/30 text-xs font-medium text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>3D 空间脱敏演练 • 消除未知焦虑</span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
              >
                未至之处，皆有迹可循
                <span className="block mt-2 text-xl sm:text-2xl font-normal text-purple-200">
                  在虚拟三维空间中，提前走好第一步
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-md mx-auto"
              >
                对陌生公共环境产生犹豫十分普遍。通过 3D 实景提前预演，带你快速熟悉动线与应对方式。
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="pt-2 flex items-center justify-center gap-3"
              >
                <button
                  onClick={handleEnter}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all hover:scale-105 active:scale-95"
                >
                  <span>进入空间</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE: OBSERVE */}
      <AnimatePresence>
        {stage === "observe" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="fixed bottom-8 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-auto px-4 space-y-3"
          >
            {/* Fear Reframing Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {FEAR_ITEMS.map((item, fIdx) => {
                const isResolved = resolvedFears.includes(fIdx);
                return (
                  <button
                    key={fIdx}
                    onClick={() => handleToggleFear(fIdx)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-xl transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
                      isResolved
                        ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-black/60 border border-purple-500/30 text-purple-200 hover:border-purple-400/50"
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{item.reframed}</span>
                      </>
                    ) : (
                      <>
                        <span>{item.fear}</span>
                        <span className="text-[10px] text-purple-400/70 ml-0.5">(点击查看对策)</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Step Action Card */}
            <div className="backdrop-blur-2xl bg-black/75 border border-purple-500/30 rounded-3xl p-4 sm:p-5 max-w-md w-full shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>前方为象征未知的巨石光门</span>
              </div>

              <button
                onClick={() => {
                  if (soundEnabled) ambientAudio.playPortalSwell();
                  useExperienceStore.getState().triggerFirstStep();
                }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 hover:from-purple-400 hover:to-sky-400 text-white font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>向前跨出一步 · 穿过光门</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-neutral-500">
                点击按钮或直接点击 3D 场景中的光门均可通行
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE: REVEAL */}
      <AnimatePresence>
        {stage === "reveal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-30 flex items-center justify-center text-center px-6 pointer-events-none"
          >
            <div className="max-w-md space-y-3 p-6 sm:p-8 rounded-3xl bg-black/75 border border-purple-400/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.3)]">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                演练完成
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-light">
                所有陌生的环境，在实际走过一次后都会变得清晰从容。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
