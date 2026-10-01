"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { CharacterGender, useFlightExperienceStore } from "@/lib/flight-experience-store";
import { soundManager } from "@/lib/sound";

interface CharacterSelectModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const { character, setCharacter, soundEnabled } = useFlightExperienceStore();

  const handleSelect = (gender: CharacterGender) => {
    if (soundEnabled) soundManager.playPop();
    setCharacter(gender);
  };

  const handleStart = () => {
    if (soundEnabled) soundManager.playGlide();
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-neutral-950/90 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.12)] text-white text-center space-y-6"
        >
          {/* Header Tag */}
          <div className="flex flex-col items-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>伴随式空间模拟 · 角色同行系统</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              选择本次旅程的<span className="font-normal text-sky-300">同行角色</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md">
              选定角色后，3D 建模将以人机工程第一视角与你并肩而行，一步步穿越航站楼全流程。
            </p>
          </div>

          {/* Character Choices Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* 1. Male Character: Alex */}
            <div
              onClick={() => handleSelect("male")}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                character === "male"
                  ? "bg-sky-500/15 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] ring-1 ring-sky-400"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10"
              }`}
            >
              {character === "male" && (
                <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">男士旅客 · Alex</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      沉稳笃定
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    身穿航空深蓝夹克与双肩背包，步伐踏实。擅长在大屏前核验航显，从容排队。
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-400 font-mono">
                <span>3D 随行动线就绪</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 2. Female Character: Emma */}
            <div
              onClick={() => handleSelect("female")}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                character === "female"
                  ? "bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10"
              }`}
            >
              {character === "female" && (
                <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">女士旅客 · Emma</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      从容敏锐
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    身穿暖调风衣与斜挎包，步调轻盈。在安检托盘微交互与廊桥登机时提供细腻指引。
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-400 font-mono">
                <span>3D 随行动线就绪</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>一步换景 · 真实人机视角陪护</span>
            </div>

            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:shadow-[0_0_35px_rgba(14,165,233,0.8)] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>确认角色并启程</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
