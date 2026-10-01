"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Plane,
  Compass,
  Layers,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Activity,
  X,
} from "lucide-react";
import { soundManager } from "@/lib/sound";
import { useAppStore } from "@/lib/store";
import { useFlightExperienceStore } from "@/lib/flight-experience-store";
import { TiltCard } from "./TiltCard";
import { AppExperienceMode } from "./Navbar";

interface PresentationDeckProps {
  initialSlide?: number;
  onJumpToFeature: (mode: AppExperienceMode, returnSlideIndex: number) => void;
  onClose?: () => void;
}

const CHAPTERS = [
  { id: 0, num: "01", title: "使命定位" },
  { id: 1, num: "02", title: "痛点解法" },
  { id: 2, num: "03", title: "旗舰 MVP" },
  { id: 3, num: "04", title: "实景向导" },
  { id: 4, num: "05", title: "雾中之门" },
  { id: 5, num: "06", title: "技术价值" },
];

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  initialSlide = 0,
  onJumpToFeature,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { soundEnabled, selectScenario } = useAppStore();

  const totalSlides = CHAPTERS.length;

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      if (soundEnabled) soundManager.playPop();
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      if (soundEnabled) soundManager.playPop();
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const jumpToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    if (soundEnabled) soundManager.playGlide();
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#07090e] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      {/* Top Deck Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between pt-12 sm:pt-14 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-amber-300">
              FIRST STEP · 项目答辩汇报
            </span>
          </div>
          <span className="text-xs text-neutral-400 hidden lg:inline">
            边缘黑客松 2026
          </span>
        </div>

        {/* Chapter Pills */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
          {CHAPTERS.map((ch) => {
            const isActive = currentSlide === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => jumpToSlide(ch.id)}
                className={`relative px-3 py-1 rounded-full text-xs transition-colors ${
                  isActive ? "text-white font-semibold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDeckTab"
                    className="absolute inset-0 rounded-full bg-white/20 border border-white/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono ${isActive ? "text-amber-300 font-bold" : "text-neutral-500"}`}>
                    {ch.num}
                  </span>
                  <span>{ch.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Slide Counter, Fullscreen & Close */}
        <div className="flex items-center gap-2.5">
          <div className="text-xs font-mono font-medium text-neutral-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span>{currentSlide + 1} / {totalSlides}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            title="全屏演示"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={() => {
                if (soundEnabled) soundManager.playPop();
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-neutral-200 hover:text-white transition-all group"
              title="退出演示返回主场景"
            >
              <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              <span>退出放映</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto py-6">
        <AnimatePresence mode="wait">
          {/* ================= SLIDE 1: 使命定位 ================= */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Web 3D 空间认知向导与心理减压平台</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                为未知，铺就<span className="bg-gradient-to-r from-sky-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent font-normal">前行的第一步</span>。
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl leading-relaxed">
                面向社会性新手与认知负担群体。不强求一次记住所有规矩，
                把未知复杂的公共空间，拆解为**“每次只专注走好下一步”**的安心微体验。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
                <TiltCard glowColor="rgba(56, 189, 248, 0.3)" className="p-5 text-left space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">0 门槛原生 WebGL</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    扫码即开免安装，纯程序化几何体构图，多端秒级流畅渲染。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(245, 158, 11, 0.3)" className="p-5 text-left space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">认知降噪与减压</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    单点视线聚焦，高亮唯一目标，有效平抑心率，抚平空间焦虑。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(16, 185, 129, 0.3)" className="p-5 text-left space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">真实人机工程视角</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    标准站姿平视动线，伴随 3D 角色随行，告别眩晕感与穿模。
                  </p>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 2: 痛点解法 ================= */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto space-y-5 text-left"
            >
              <div>
                <span className="text-xs font-mono text-amber-400 tracking-wider">PAIN POINTS & SOLUTIONS</span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">破解公共空间三大核心焦虑</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <TiltCard glowColor="rgba(239, 68, 68, 0.25)" className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full inline-block">
                    痛点 01 · 信息超载
                  </div>
                  <h3 className="text-sm font-bold text-white">航显大屏与密集标牌</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    成百上千行文字滚动跳动，引发认知瞬间超载与方向迷失。
                  </p>
                  <div className="pt-2 border-t border-white/10 text-xs text-sky-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>解法：单点视线聚焦，提取唯一所乘航班</span>
                  </div>
                </TiltCard>

                <TiltCard glowColor="rgba(245, 158, 11, 0.25)" className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                    痛点 02 · 害怕犯错
                  </div>
                  <h3 className="text-sm font-bold text-white">安检排队手忙脚乱</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    不清楚充电宝、笔记本、外套何时脱下，害怕耽误身后队伍。
                  </p>
                  <div className="pt-2 border-t border-white/10 text-xs text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>解法：托盘微交互试错，提前建立肌肉记忆</span>
                  </div>
                </TiltCard>

                <TiltCard glowColor="rgba(168, 85, 247, 0.25)" className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full inline-block">
                    痛点 03 · 开口羞耻
                  </div>
                  <h3 className="text-sm font-bold text-white">害怕向工作人员提问</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    面对专业术语（如杯型、烘焙度、科室代码）担心显得不体面。
                  </p>
                  <div className="pt-2 border-t border-white/10 text-xs text-purple-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>解法：保姆级沟通小抄，照着念直接搞定</span>
                  </div>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 3: 旗舰 MVP (第一次坐飞机) ================= */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto space-y-5 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-sky-400 tracking-wider">FEATURE 01 · FLAGSHIP MVP</span>
                  <h2 className="text-2xl sm:text-3xl font-light text-white">
                    旗舰体验：<span className="text-sky-300 font-normal">「第一次坐飞机」</span>沉浸式流程预演
                  </h2>
                </div>

                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    useFlightExperienceStore.getState().setStage("intro");
                    onJumpToFeature("flight", 2);
                  }}
                  className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>立即跳转体验</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {[
                  {
                    step: "STEP 01",
                    title: "查验航显大屏",
                    desc: "F 岛大屏正对视野，单行提取 FS001，核对柜台。",
                    stage: "guide_find_flight",
                  },
                  {
                    step: "STEP 02",
                    title: "地面光带导向",
                    desc: "沿智能箭头流线前进，无需抬头寻找复杂路标。",
                    stage: "guide_path",
                  },
                  {
                    step: "STEP 03",
                    title: "安检托盘微交互",
                    desc: "亲手放入手机、背包与外套，传送带平稳过机。",
                    stage: "guide_security",
                  },
                  {
                    step: "STEP 04",
                    title: "28号登机口到达",
                    desc: "速通门闸机核验，登机廊桥通道指引清晰达成。",
                    stage: "boarding_gate",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (soundEnabled) soundManager.playGlide();
                      useFlightExperienceStore.getState().setStage(item.stage as any);
                      onJumpToFeature("flight", 2);
                    }}
                    className="cursor-pointer"
                  >
                    <TiltCard glowColor="rgba(56, 189, 248, 0.3)" className="p-4 h-full flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/20">
                          {item.step}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-sky-400 flex items-center justify-between">
                        <span>点击实景体验</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 4: 实景向导 ================= */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto space-y-5 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-emerald-400 tracking-wider">FEATURE 02 · 3D WAYFINDING</span>
                  <h2 className="text-2xl sm:text-3xl font-light text-white">
                    实战向导：<span className="text-emerald-300 font-normal">三大公共空间漫游</span>
                  </h2>
                </div>

                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    onJumpToFeature("guides", 3);
                  }}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>立即跳转体验实景向导</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    selectScenario("hospital-first-visit");
                    onJumpToFeature("guides", 3);
                  }}
                  className="cursor-pointer"
                >
                  <TiltCard glowColor="rgba(14, 165, 233, 0.3)" className="p-5 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-sky-300">
                        <Activity className="w-4 h-4" />
                        <span>三甲医院就医动线</span>
                      </div>
                      <h4 className="text-base font-bold text-white">自助挂号 · 诊室报到 · 缴费取药</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        刷医保卡取号、护士台报到避坑、线上缴费与发药窗口。
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/10 text-xs text-sky-400 flex items-center justify-between">
                      <span>进入 3D 医院空间</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </TiltCard>
                </div>

                <div
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    selectScenario("starbucks-first-order");
                    onJumpToFeature("guides", 3);
                  }}
                  className="cursor-pointer"
                >
                  <TiltCard glowColor="rgba(16, 185, 129, 0.3)" className="p-5 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                        <Coffee className="w-4 h-4" />
                        <span>星巴克标准门店</span>
                      </div>
                      <h4 className="text-base font-bold text-white">杯型避坑 · 取餐核验 · 调味吧台</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        中杯大杯容量对比、奶类选项、调味吧台纸巾吸管自取。
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/10 text-xs text-emerald-400 flex items-center justify-between">
                      <span>进入 3D 门店空间</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </TiltCard>
                </div>

                <div
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    selectScenario("airport-first-flight");
                    onJumpToFeature("guides", 3);
                  }}
                  className="cursor-pointer"
                >
                  <TiltCard glowColor="rgba(99, 102, 241, 0.3)" className="p-5 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                        <Plane className="w-4 h-4" />
                        <span>机场航站楼全景</span>
                      </div>
                      <h4 className="text-base font-bold text-white">提前2小时 · 充电宝随身 · 登机口</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        自由旋转俯仰视角，点击发光锚点，查看专业出行规范。
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/10 text-xs text-indigo-400 flex items-center justify-between">
                      <span>进入 3D 机场全景</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </TiltCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 5: 雾中之门 ================= */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto space-y-5 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-purple-400 tracking-wider">FEATURE 03 · EMOTIONAL SAFE HARBOR</span>
                  <h2 className="text-2xl sm:text-3xl font-light text-white">
                    心理脱敏演练：<span className="text-purple-300 font-normal">「雾中之门」</span>
                  </h2>
                </div>

                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playPop();
                    onJumpToFeature("fog", 4);
                  }}
                  className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>立即跳转体验雾中之门</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <TiltCard glowColor="rgba(168, 85, 247, 0.3)" className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                    01 · 情绪外显
                  </span>
                  <h3 className="text-sm font-bold text-white">迷雾粒子消散模拟</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    将内心恐惧具象化为包裹的浓雾，随深呼吸与迈步逐渐消散。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(99, 102, 241, 0.3)" className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                    02 · 对策支持
                  </span>
                  <h3 className="text-sm font-bold text-white">实景顾虑与对策梳理</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    针对走错科室、被连环提问等尴尬状况，提供温和实用的应对小抄。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(245, 158, 11, 0.3)" className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    03 · 勇气见证
                  </span>
                  <h3 className="text-sm font-bold text-white">专属通关数据报告</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    记录首次操作用时、视角调整与通关状态，沉淀客观的三维演练数据。
                  </p>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 6: 架构与价值 ================= */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-4xl mx-auto space-y-5 text-left"
            >
              <div>
                <span className="text-xs font-mono text-amber-400 tracking-wider">TECH STACK & IMPACT</span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">技术架构与社会包容创新价值</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <TiltCard glowColor="rgba(56, 189, 248, 0.25)" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Cpu className="w-4 h-4" />
                    <span>纯浏览器端轻量化渲染</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    基于 Next.js 14 + React Three Fiber 构建，程序化几何构图与 PBR 材质，首屏毫秒级加载。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(16, 185, 129, 0.25)" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Layers className="w-4 h-4" />
                    <span>电影级第一人称视角</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    CameraControls 配合精确站姿 1.72m 高度平视解算，杜绝穿模与闪烁，毫无眩晕感。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(245, 158, 11, 0.25)" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>端侧计算与隐私零采集</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    所有 3D 渲染与交互均在用户本地完成，离线安全，保障新手与特殊群体的心理安全感。
                  </p>
                </TiltCard>

                <TiltCard glowColor="rgba(168, 85, 247, 0.25)" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <HeartHandshake className="w-4 h-4" />
                    <span>消除“数字鸿沟”与空间壁垒</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    让第一次进高铁站、第一次坐飞机、第一次就医的普通人拥有底气，科技向善的生动实践。
                  </p>
                </TiltCard>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => jumpToSlide(0)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新放映</span>
                </button>
                <span className="text-xs text-neutral-400 font-light">
                  感谢观看 · FirstStep 第一次
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Paging Controller */}
      <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-3">
        <button
          onClick={goToPrev}
          disabled={currentSlide === 0}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
            currentSlide === 0
              ? "opacity-30 cursor-not-allowed border-white/10 text-neutral-500"
              : "bg-white/5 hover:bg-white/15 border-white/15 text-white active:scale-95"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>上一页</span>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? "w-7 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentSlide === totalSlides - 1}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
            currentSlide === totalSlides - 1
              ? "opacity-30 cursor-not-allowed border-white/10 text-neutral-500"
              : "bg-white/5 hover:bg-white/15 border-white/15 text-white active:scale-95"
          }`}
        >
          <span>下一页</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
