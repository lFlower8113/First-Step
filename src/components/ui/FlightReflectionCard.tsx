"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlightExperienceStore, FlightReflectionData } from "@/lib/flight-experience-store";
import { soundManager } from "@/lib/sound";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  Timer,
  Footprints,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

interface FlightReflectionCardProps {
  onSwitchToGuides?: () => void;
}

export const FlightReflectionCard: React.FC<FlightReflectionCardProps> = ({
  onSwitchToGuides,
}) => {
  const { stage, telemetry, resetExperience, goToPrevStep, soundEnabled } = useFlightExperienceStore();
  const [reflection, setReflection] = useState<FlightReflectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (stage === "reflection") {
      setLoading(true);
      fetch("/api/generate-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: "first_flight",
          timeToFirstAction: telemetry.timeToFirstAction,
          hesitationSeconds: telemetry.hesitationSeconds,
          completedSteps: telemetry.completedSteps,
          neededExtraGuidance: telemetry.neededExtraGuidance,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setReflection({
            title: data.title || "首次乘机流程演练完成",
            observation:
              data.observation ||
              `你已依次完成航班大屏核对、地面导流指引、安检放置与登机口到达全部流程。`,
            meaning:
              data.meaning ||
              "实际机场出行流程与此一致，按指示牌与广播办理即可从容出行。",
            closingLine: data.closingLine || "准备就绪，祝你旅途顺利！",
          });
          setLoading(false);
        })
        .catch(() => {
          setReflection({
            title: "首次乘机流程演练完成",
            observation: `你已依次完成航班大屏核对、地面导流指引、安检放置与登机口到达全部流程。`,
            meaning: "实际机场出行流程与此一致，按指示牌与广播办理即可从容出行。",
            closingLine: "准备就绪，祝你旅途顺利！",
          });
          setLoading(false);
        });
    }
  }, [stage, telemetry]);

  const handleCopy = () => {
    if (!reflection) return;
    const shareText = `【FirstStep • 第一次坐飞机】我已完成航站楼 4 大关键流程演练！\n${reflection.observation}\n${reflection.closingLine}`;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full max-w-xl rounded-3xl overflow-hidden backdrop-blur-3xl bg-neutral-950/90 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-white p-7 sm:p-9"
        >
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

          {/* Card Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-amber-400">
                  FIRST STEP • 通关报告
                </h4>
                <p className="text-[11px] text-neutral-400">
                  首次乘机全流程演练数据与总结
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>已通关</span>
            </div>
          </div>

          {/* Objective Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Timer className="w-4 h-4 text-sky-400 mb-1" />
              <span className="text-[11px] text-neutral-400">首次操作耗时</span>
              <span className="text-base font-bold text-white mt-0.5">
                {telemetry.timeToFirstAction || 4.5}s
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Footprints className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[11px] text-neutral-400">流程节点</span>
              <span className="text-base font-bold text-white mt-0.5">
                4 个环节
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center">
              <Sparkles className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[11px] text-neutral-400">完成状态</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5">
                全部完成
              </span>
            </div>
          </div>

          {/* Observation Text Body */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-400 font-medium">
                正在生成通关统计数据...
              </p>
            </div>
          ) : (
            reflection && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 my-2"
              >
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-medium text-white tracking-wide">
                  {reflection.title}
                </h3>

                {/* Body paragraph */}
                <div className="space-y-2 text-sm text-neutral-300 leading-relaxed font-light">
                  <p>{reflection.observation}</p>
                  <p className="text-neutral-400">{reflection.meaning}</p>
                </div>

                {/* Closing quote */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-amber-300">
                  <span className="font-medium">
                    {reflection.closingLine}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    FIRST STEP
                  </span>
                </div>
              </motion.div>
            )
          )}

          {/* Action Buttons Footer */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (soundEnabled) soundManager.playPop();
                  goToPrevStep();
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all flex items-center justify-center gap-1.5"
                title="返回 28 号登机口漫游"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
                <span>返回登机口</span>
              </button>

              <button
                onClick={handleRestart}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span>再次演练</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>分享</span>
                  </>
                )}
              </button>
            </div>

            {onSwitchToGuides && (
              <button
                onClick={onSwitchToGuides}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(14,165,233,0.35)] flex items-center justify-center gap-1.5"
              >
                <span>探索更多场景</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
