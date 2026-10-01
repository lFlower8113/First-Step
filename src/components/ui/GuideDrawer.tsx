"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { SCENARIOS } from "@/lib/scenarios";
import { soundManager } from "@/lib/sound";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Footprints,
  RotateCcw,
  Wrench,
} from "lucide-react";

export const GuideDrawer: React.FC = () => {
  const {
    currentScenarioId,
    selectedAnchorId,
    selectAnchor,
    isDrawerOpen,
    setDrawerOpen,
    soundEnabled,
    resetView,
  } = useAppStore();

  const scenario = SCENARIOS.find((s) => s.id === currentScenarioId) || SCENARIOS[0];
  const anchors = scenario.anchors;

  const currentAnchorIndex = anchors.findIndex((a) => a.id === selectedAnchorId);
  const currentAnchor = currentAnchorIndex !== -1 ? anchors[currentAnchorIndex] : null;

  const handleNext = () => {
    if (currentAnchorIndex < anchors.length - 1) {
      if (soundEnabled) soundManager.playGlide();
      selectAnchor(anchors[currentAnchorIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentAnchorIndex > 0) {
      if (soundEnabled) soundManager.playGlide();
      selectAnchor(anchors[currentAnchorIndex - 1].id);
    }
  };

  const handleClose = () => {
    if (soundEnabled) soundManager.playPop();
    setDrawerOpen(false);
  };

  if (!currentAnchor) return null;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          key="guide-drawer"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="fixed top-20 right-4 sm:right-6 bottom-6 z-50 w-[92vw] sm:w-[460px] max-w-lg flex flex-col pointer-events-auto"
        >
          {/* Glass Card Container */}
          <div className="relative h-full flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl bg-neutral-900/90 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white">
            {/* Top Atmospheric Highlight Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-90" />

            {/* Header: Step Indicator & Close */}
            <div className="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center">
                  {currentAnchor.guideContent.stepIndex}
                </span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  节点 {currentAnchor.guideContent.stepIndex} / {anchors.length}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-xs text-emerald-400 font-semibold">{currentAnchor.title}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    resetView();
                  }}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="退回全景"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="收起抽屉"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
              {/* Step Headline */}
              <div>
                <h3 className="text-lg font-bold text-white leading-snug tracking-tight">
                  {currentAnchor.guideContent.headline}
                </h3>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>核心实操动线：</span>
                </div>
                <div className="space-y-2.5">
                  {currentAnchor.guideContent.actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-start gap-3 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Troubleshooting Section */}
              <div className="p-4 rounded-2xl bg-neutral-800/60 border border-white/10 text-neutral-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span>现场突发状况避坑指南：</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {currentAnchor.guideContent.emergencyHelp}
                </p>
              </div>
            </div>

            {/* Bottom Footer Navigation */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentAnchorIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>

              {/* Step Dots */}
              <div className="flex items-center gap-1.5">
                {anchors.map((anchor, idx) => (
                  <button
                    key={anchor.id}
                    onClick={() => {
                      if (soundEnabled) soundManager.playGlide();
                      selectAnchor(anchor.id);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentAnchorIndex
                        ? "w-6 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentAnchorIndex === anchors.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500/20 transition-colors"
              >
                <span>下一步</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
