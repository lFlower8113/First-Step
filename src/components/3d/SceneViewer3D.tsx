"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  ContactShadows,
} from "@react-three/drei";
import { useAppStore } from "@/lib/store";
import { SCENARIOS } from "@/lib/scenarios";
import { GuideAnchor } from "@/lib/types";
import { SpatialAnchor } from "./SpatialAnchor";
import { CoffeeShopModel } from "./CoffeeShopModel";
import { HospitalModel } from "./HospitalModel";
import { AirportModel } from "./AirportModel";
import { soundManager } from "@/lib/sound";
import {
  RotateCcw,
  Camera,
  MapPin,
  Compass,
} from "lucide-react";

// Internal Scene Content containing 3D models and controls
const SceneContent: React.FC = () => {
  const cameraControlRef = useRef<CameraControls>(null);
  const {
    currentScenarioId,
    selectedAnchorId,
    selectAnchor,
    setCameraMoving,
  } = useAppStore();

  const scenario = SCENARIOS.find((s) => s.id === currentScenarioId) || SCENARIOS[0];
  const selectedAnchor = scenario.anchors.find((a) => a.id === selectedAnchorId);

  const isInitializedRef = useRef(false);
  const prevScenarioRef = useRef<string>(currentScenarioId);
  const prevAnchorRef = useRef<string | null>(selectedAnchorId);

  useFrame(() => {
    if (!cameraControlRef.current) return;
    const { position, target } = scenario.initialCamera;

    // 1. Initial Entry Fly-In Push-In Animation (from Scenario Hall into 3D view)
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      prevScenarioRef.current = currentScenarioId;
      prevAnchorRef.current = selectedAnchorId;

      cameraControlRef.current.setLookAt(
        position[0] * 0.4,
        position[1] + 6.0,
        position[2] + 7.0,
        target[0],
        target[1],
        target[2],
        false // instant initial camera placement
      );

      cameraControlRef.current.smoothTime = 1.35;
      cameraControlRef.current.setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        true // animated entry push-in!
      );
      return;
    }

    // 2. Scenario Changed while already in 3D
    if (prevScenarioRef.current !== currentScenarioId) {
      prevScenarioRef.current = currentScenarioId;
      prevAnchorRef.current = selectedAnchorId;
      setCameraMoving(true);
      cameraControlRef.current.smoothTime = 1.1;
      cameraControlRef.current.setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        true
      );
      setTimeout(() => setCameraMoving(false), 950);
      return;
    }

    // 3. Anchor selection changed
    if (prevAnchorRef.current !== selectedAnchorId) {
      prevAnchorRef.current = selectedAnchorId;
      setCameraMoving(true);
      if (selectedAnchor) {
        const { position: anchorPos, lookAt } = selectedAnchor.cameraTarget;
        cameraControlRef.current.smoothTime = 1.1;
        cameraControlRef.current.setLookAt(
          anchorPos[0],
          anchorPos[1],
          anchorPos[2],
          lookAt[0],
          lookAt[1],
          lookAt[2],
          true
        );
      } else {
        cameraControlRef.current.smoothTime = 1.1;
        cameraControlRef.current.setLookAt(
          position[0],
          position[1],
          position[2],
          target[0],
          target[1],
          target[2],
          true
        );
      }
      setTimeout(() => setCameraMoving(false), 950);
    }
  });

  const handleSelectAnchor = (anchor: GuideAnchor) => {
    selectAnchor(anchor.id);
  };

  // Render the appropriate scenario 3D architectural model
  const renderScenarioModel = () => {
    if (scenario.id === "starbucks-first-order") {
      return <CoffeeShopModel />;
    } else if (scenario.id === "hospital-first-visit") {
      return <HospitalModel />;
    } else if (scenario.id === "airport-first-flight") {
      return (
        <AirportModel
          isInteractiveMode={false}
          showGuidePath={true}
        />
      );
    }
    return <CoffeeShopModel />;
  };

  // Adaptive scenic atmospheric lighting based on scenario environment
  const isAirport = scenario.id === "airport-first-flight";
  const isStarbucks = scenario.id === "starbucks-first-order";

  const envConfig = useMemo(() => {
    if (isAirport) {
      return {
        bg: "#dbeafe",
        fog: "#e0f2fe",
        fogNear: 45,
        fogFar: 140,
        ambientColor: "#ffffff",
        ambientIntensity: 1.35,
        sunPos: [15, 24, 12] as [number, number, number],
        sunIntensity: 2.2,
        sunColor: "#fffdfa",
        fillPos: [0, 10, -12] as [number, number, number],
        fillIntensity: 1.35,
        fillColor: "#bae6fd",
        hemi: ["#ffffff", "#f1f5f9", 0.95] as [string, string, number],
      };
    } else if (isStarbucks) {
      return {
        bg: "#1c1917", // Warm architectural cafe mood
        fog: "#1c1917",
        fogNear: 22,
        fogFar: 60,
        ambientColor: "#fed7aa", // Warm amber ambient
        ambientIntensity: 1.35,
        sunPos: [8, 16, 10] as [number, number, number],
        sunIntensity: 2.4,
        sunColor: "#fff7ed",
        fillPos: [-6, 8, -6] as [number, number, number],
        fillIntensity: 1.3,
        fillColor: "#fef08a",
        hemi: ["#fff7ed", "#442b1e", 0.9] as [string, string, number],
      };
    } else {
      return {
        bg: "#f8fafc",
        fog: "#f8fafc",
        fogNear: 35,
        fogFar: 90,
        ambientColor: "#ffffff",
        ambientIntensity: 1.4,
        sunPos: [10, 20, 10] as [number, number, number],
        sunIntensity: 2.0,
        sunColor: "#ffffff",
        fillPos: [-8, 8, -8] as [number, number, number],
        fillIntensity: 1.1,
        fillColor: "#e0f2fe",
        hemi: ["#ffffff", "#e2e8f0", 0.9] as [string, string, number],
      };
    }
  }, [isAirport, isStarbucks]);

  return (
    <>
      {/* High-freedom Camera Controls with snappy response and broad spatial range */}
      <CameraControls
        ref={cameraControlRef}
        makeDefault
        minDistance={0.8}
        maxDistance={45}
        dollySpeed={1.2}
        truckSpeed={1.2}
        smoothTime={0.72}
        draggingSmoothTime={0.06}
        maxPolarAngle={Math.PI / 2 + 0.08}
        minPolarAngle={0.02}
      />

      {/* Atmospheric Sky Background Color - Dynamic Scenario-Specific Atmosphere */}
      <color attach="background" args={[envConfig.bg]} />
      <fog attach="fog" args={[envConfig.fog, envConfig.fogNear, envConfig.fogFar]} />

      {/* Radiant High-Key Ambient & Key Lighting */}
      <ambientLight intensity={envConfig.ambientIntensity} color={envConfig.ambientColor} />
      <directionalLight
        position={envConfig.sunPos}
        intensity={envConfig.sunIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        color={envConfig.sunColor}
      />
      <directionalLight
        position={envConfig.fillPos}
        intensity={envConfig.fillIntensity}
        color={envConfig.fillColor}
      />
      <hemisphereLight args={envConfig.hemi} />

      {/* Realistic Soft Contact Shadows on Ground */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={isAirport ? 0.35 : 0.45}
        scale={isAirport ? 40 : 26}
        blur={2.2}
        far={7}
      />

      {/* 3D Space Model anchored at world origin */}
      <group position={[0, 0, 0]}>
        {renderScenarioModel()}
      </group>

      {/* Spatial 3D Anchors with HTML and Float */}
      {scenario.anchors.map((anchor) => (
        <SpatialAnchor
          key={anchor.id}
          anchor={anchor}
          onSelect={handleSelectAnchor}
        />
      ))}
    </>
  );
};

export const SceneViewer3D: React.FC = () => {
  const {
    currentScenarioId,
    selectedAnchorId,
    selectAnchor,
    resetView,
    setViewMode,
    soundEnabled,
  } = useAppStore();

  const scenario = SCENARIOS.find((s) => s.id === currentScenarioId) || SCENARIOS[0];

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas synced with flagship MVP camera view */}
      <Canvas
        shadows
        camera={{ position: [0, 6.8, 14.5], fov: 45, near: 0.2, far: 120 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
        }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* Bottom Floating Step Navigation Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl pointer-events-auto">
        <div className="backdrop-blur-2xl bg-black/60 border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2">
          {/* Quick Step Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 custom-scrollbar">
            {scenario.anchors.map((anchor) => {
              const isSelected = selectedAnchorId === anchor.id;
              return (
                <button
                  key={anchor.id}
                  onClick={() => {
                    if (soundEnabled) soundManager.playGlide();
                    selectAnchor(anchor.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-105"
                      : "bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-white/10"
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{anchor.title}</span>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {/* Return to Hall Button */}
            <button
              onClick={() => {
                if (soundEnabled) soundManager.playPop();
                setViewMode("hall");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
              title="返回场景选择大厅"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">场景大厅</span>
            </button>

            {/* Reset Overview Camera */}
            <button
              onClick={() => {
                if (soundEnabled) soundManager.playPop();
                resetView();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
              title="恢复全景视角"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">全景</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Instructions Tooltip (Top-Left) */}
      <div className="absolute top-20 left-4 sm:left-6 z-20 pointer-events-none hidden sm:block">
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-neutral-300 shadow-lg space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>3D 电影级运镜漫游</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-tight">
            点击悬浮发光锚点，镜头将自动以舒适景别推进至特写小抄视角
          </p>
          <p className="text-[10px] text-neutral-500">
            按住鼠标左键旋转视角 &bull; 右键平移 &bull; 滚轮缩放
          </p>
        </div>
      </div>
    </div>
  );
};
