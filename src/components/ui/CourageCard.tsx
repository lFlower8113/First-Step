"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperienceStore } from "@/lib/experience-store";
import { generateObserverInsight, AIObserverInsight } from "@/lib/ai-observer";
import { soundManager } from "@/lib/sound";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  Timer,
  Eye,
  Footprints,
  ShieldCheck,
  Plane,
  ArrowRight,
} from "lucide-react";

interface CourageCardProps {
  onStartFlight?: () => void;
  onExploreGuides?: () => void;
}

export const CourageCard: React.FC<CourageCardProps> = ({ onStartFlight, onExploreGuides }) => {
  const { stage, telemetry, resetExperience, soundEnabled } = useExperienceStore();
  const [insight, setInsight] = useState<AIObserverInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (stage === "reflection") {
      setLoading(true);
      generateObserverInsight(telemetry).then((res) => {
        setInsight(res);
        setLoading(false);
      });
    }
  }, [stage, telemetry]);

  const handleCopy = () => {
    if (!insight) return;
    const shareText = `【FirstStep • 勇气的微小见证】\n我在迷雾门前停顿了 ${telemetry.hesitationSeconds} 秒，但最终没有后退。\n“${insight.reflection}”\n—— ${insight.actionQuote}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    if (soundEnabled) soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    if (soundEnabled) soundManager.playPop();
    resetExperience();
  };

  if (stage !== "reflection") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full max-w-xl rounded-3xl overflow-hidden backdrop-blur-3xl bg-neutral-950/85 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-white p-7 sm:p-9"
        >
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />

          {/* Card Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <Compass className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-sky-400">
                  FirstStep • 演练报告
                </h4>
                <p className="text-[11px] text-neutral-400">
                  三维空间脱敏演练数据统计
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>已完成</span>
            </div>
          </div>

          {/* Observable Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Timer className="w-4 h-4 text-sky-400 mb-1" />
              <span className="text-[11px] text-neutral-400">用时</span>
              <span className="text-base font-bold text-white mt-0.5">
                {telemetry.hesitationSeconds}s
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Eye className="w-4 h-4 text-teal-400 mb-1" />
              <span className="text-[11px] text-neutral-400">视角调整</span>
              <span className="text-base font-bold text-white mt-0.5">
                {Math.max(1, telemetry.hoverCount)} 次
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Footprints className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[11px] text-neutral-400">操作节奏</span>
              <span className="text-base font-bold text-white mt-0.5">
                {telemetry.stepSpeed === "swift" ? "利落" : telemetry.stepSpeed === "cautious" ? "稳健" : "从容"}
              </span>
            </div>
          </div>

          {/* Observation Text Body */}
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-400 font-medium">
                正在生成演练总结...
              </p>
            </div>
          ) : (
            insight && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                    顺利完成
                  </span>
                  <span className="text-xs text-neutral-500">|</span>
                  <span className="text-xs text-neutral-400">已消除未知障碍</span>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed font-light bg-black/40 p-4 rounded-2xl border border-white/10">
                  陌生的公共环境只要提前走过一次，流程就会清晰明了。
                </p>

                <p className="text-xs font-medium text-sky-300 pt-1">
                  — 祝你在真实场景中从容顺畅。
                </p>
              </div>
            )
          )}

          {/* Card Footer Actions */}
          <div className="mt-8 pt-5 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                if (soundEnabled) soundManager.playPop();
                if (onStartFlight) onStartFlight();
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Plane className="w-4 h-4 text-slate-950" />
              <span>体验首次乘机流程 (MVP)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>再次演练</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600/80 hover:bg-sky-500 border border-sky-400/30 shadow-[0_0_15px_rgba(2,132,199,0.4)] transition-all hover:scale-105"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>分享记录</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
