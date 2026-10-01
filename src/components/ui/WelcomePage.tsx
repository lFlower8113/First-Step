"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface WelcomePageProps {
  onEnter: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    soundManager.playGlide();
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 flex flex-col justify-between items-center bg-[#05070c]/95 backdrop-blur-xl text-white overflow-hidden select-none p-8 sm:p-14"
    >
        {/* Subtle, Slow Breathing Ambient Light Aura in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.28, 0.15],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-sky-500/20 via-blue-600/10 to-amber-400/15 blur-[160px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,12,0.85)_80%)]" />
        </div>

        {/* Top Brand Bar */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-2.5 text-neutral-400">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-xs tracking-[0.28em] uppercase font-light text-neutral-300">
              FIRST STEP · 第一次
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500/80 tracking-widest hidden sm:inline">
            3D SPATIAL ACCLIMATIZATION
          </span>
        </motion.div>

        {/* Center: Poetic, Pure Typography & Interactive "迈出第一步" */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-12">
          {/* Headline - Just two poignant, artistic sentences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-100 leading-[1.25]">
              所有浩瀚的未知，
              <br />
              <span className="font-light bg-gradient-to-r from-neutral-100 via-sky-200 to-amber-100 bg-clip-text text-transparent">
                都始于脚下笃定的一步。
              </span>
            </h1>

            <p className="text-xs sm:text-sm font-light text-neutral-400/90 tracking-widest max-w-md mx-auto pt-2 leading-relaxed">
              拆解庞杂公共空间，把每一次不知所措，化为安稳前行的从容。
            </p>
          </motion.div>

          {/* Central Interactive Artifact CTA Buttons: "迈出第一步" & "答辩演示 PPT" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            {/* Primary Action Button: 迈出第一步 */}
            <div className="relative flex items-center justify-center">
              {/* Outer Subtle Breathing Halo Ring */}
              <motion.div
                animate={{
                  scale: isHovered ? [1.1, 1.25, 1.1] : [1, 1.18, 1],
                  opacity: isHovered ? [0.4, 0.7, 0.4] : [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: isHovered ? 2.0 : 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-44 h-14 rounded-full bg-sky-400/30 blur-xl pointer-events-none"
              />

              <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-9 py-4 rounded-full bg-white/[0.07] hover:bg-white/[0.14] active:scale-95 border border-white/20 hover:border-white/40 backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 cursor-pointer"
              >
                {/* Subtle inner linear highlight */}
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Glowing Pulse Dot */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
                </span>

                <span className="text-sm sm:text-base font-light tracking-[0.2em] text-white">
                  迈出第一步
                </span>

                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Minimal Bottom Subtle Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="relative z-10 flex items-center justify-between w-full text-[11px] font-mono text-neutral-500/80 tracking-wider"
        >
          <span>SPATIAL COGNITIVE MATRIX</span>
          <span className="text-neutral-500/60 font-mono">EMBODIED DESENSITIZATION SANDBOX</span>
          <span className="hidden sm:inline">2026 EDITION</span>
        </motion.div>
      </motion.div>
  );
};
