"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  ContactShadows,
} from "@react-three/drei";
import { AirportModel } from "./AirportModel";
import { useFlightExperienceStore } from "@/lib/flight-experience-store";

// Human eye level camera positions (1.68m ~ 1.75m eye level)
// Provides realistic first/close third person walking perspectives ("一步换景")
const STAGE_CAMERA_CONFIGS: Record<
  string,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  // 1. Entry / Pre-safe: Passenger standing at concourse entrance looking into the grand hall
  intro: { pos: [-0.6, 1.72, 7.8], target: [-0.6, 1.68, 0.5] },
  pre_safe: { pos: [-1.0, 1.72, 6.2], target: [-1.2, 1.68, 1.0] },

  // 2. Observe: Central concourse view, panning naturally across check-in, security & gates
  observe: { pos: [-1.5, 1.72, 5.2], target: [-2.2, 1.68, 0.8] },

  // 3. Step 01: Standing directly in front of Island F, human eye level looking up at the Departures board
  guide_find_flight: { pos: [-4.6, 1.72, 3.8], target: [-4.8, 2.35, 1.0] },

  // 4. Step 02: Moving forward along the illuminated ground guide path towards security
  guide_path: { pos: [-2.8, 1.72, 3.0], target: [-1.2, 1.65, 0.8] },

  // 5. Step 03: Standing at the security inspection conveyor table, eye level looking at the tray
  guide_security: { pos: [-0.35, 1.68, 1.45], target: [0.2, 1.05, 0.0] },

  // 6. Step 04 & 05: Arriving at Gate 28 speed gate and looking out toward the jet bridge
  boarding_gate: { pos: [3.8, 1.72, 2.8], target: [5.0, 1.72, 0.8] },
  reflection: { pos: [3.8, 1.72, 2.8], target: [5.0, 1.72, 0.8] },
};

// Internal 3D Scene Controls & Orchestrator with Frame-Accurate Camera Lifecycle
const FirstFlightSceneContent: React.FC = () => {
  const cameraControlRef = useRef<CameraControls>(null);
  const { stage, flightState, completeFindFlight } = useFlightExperienceStore();
  const isInitializedRef = useRef(false);
  const prevStageRef = useRef<string | null>(null);

  useFrame(() => {
    if (!cameraControlRef.current) return;

    // 1. Initial First-Frame Mount & Entry Fly-in Swoop at Human Eye Level
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      prevStageRef.current = stage;

      const cfg = STAGE_CAMERA_CONFIGS[stage] || STAGE_CAMERA_CONFIGS.intro;

      if (stage === "intro") {
        // Human arrival from terminal entrance
        cameraControlRef.current.setLookAt(
          cfg.pos[0], cfg.pos[1] + 0.8, cfg.pos[2] + 3.0,
          cfg.target[0], cfg.target[1], cfg.target[2],
          false
        );
        cameraControlRef.current.smoothTime = 1.35;
        cameraControlRef.current.setLookAt(
          cfg.pos[0], cfg.pos[1], cfg.pos[2],
          cfg.target[0], cfg.target[1], cfg.target[2],
          true
        );
      } else {
        cameraControlRef.current.setLookAt(
          cfg.pos[0], cfg.pos[1], cfg.pos[2],
          cfg.target[0], cfg.target[1], cfg.target[2],
          false
        );
      }
      return;
    }

    // 2. Subsequent Stage Camera Transitions ("一步换景" - Silky smooth glide at human eye level)
    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
      const cfg = STAGE_CAMERA_CONFIGS[stage] || STAGE_CAMERA_CONFIGS.intro;
      if (cfg) {
        cameraControlRef.current.smoothTime = 1.25; // Generous cinematic glide
        cameraControlRef.current.setLookAt(
          cfg.pos[0], cfg.pos[1], cfg.pos[2],
          cfg.target[0], cfg.target[1], cfg.target[2],
          true
        );
      }
    }
  });

  return (
    <>
      <CameraControls
        ref={cameraControlRef}
        makeDefault
        minDistance={0.5}
        maxDistance={35}
        smoothTime={0.85}
        draggingSmoothTime={0.06}
        dollySpeed={1.0}
        truckSpeed={1.0}
        maxPolarAngle={Math.PI / 2 + 0.05}
        minPolarAngle={0.08}
      />

      {/* Luminous International Terminal Daylight Sky Background & Atmospheric Mist */}
      <color attach="background" args={["#dbeafe"]} />
      <fog attach="fog" args={["#e0f2fe", 45, 140]} />

      {/* Radiant High-Key Ambient & Daylight Architecture Lighting */}
      <ambientLight intensity={1.35} color="#ffffff" />

      {/* Primary Key Light - Crisp Warm Sunlight streaming into the grand hall */}
      <directionalLight
        position={[15, 24, 12]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#fffdfa"
      />

      {/* Secondary Fill Light - Expansive Skylight Pouring in through Grand Apron Glass Curtain */}
      <directionalLight
        position={[0, 10, -12]}
        intensity={1.35}
        color="#bae6fd"
      />

      {/* Ceiling Ambient Wash */}
      <directionalLight
        position={[-10, 14, 6]}
        intensity={0.9}
        color="#f0f9ff"
      />

      {/* Upper-Lower Architectural Bounce Light */}
      <hemisphereLight args={["#ffffff", "#f1f5f9", 0.95]} />

      {/* Targeted Architectural Downlight Spotlights for Key Interactive Waypoints */}
      <pointLight position={[-5.0, 4.2, 1.2]} intensity={1.5} distance={8} color="#ffffff" />
      <pointLight position={[0.0, 4.2, 0.8]} intensity={1.6} distance={8} color="#ffffff" />
      <pointLight position={[4.0, 4.2, 1.5]} intensity={1.5} distance={8} color="#ffffff" />

      {/* Soft Contact Floor Shadows */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.35}
        scale={42}
        blur={2.0}
        far={8}
      />

      {/* Main Spacious Airport Architecture */}
      <group position={[0, 0, 0]}>
        <AirportModel
          isInteractiveMode={true}
          interactiveTrayItems={flightState.trayItems}
          trayScanned={flightState.trayScanned}
          targetFlightFound={flightState.flightFound}
          isTargetStage={stage === "guide_find_flight"}
          onTargetFlightClick={completeFindFlight}
          showGuidePath={stage !== "intro"}
        />
      </group>
    </>
  );
};

export const FirstFlightExperienceScene: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <Canvas
        camera={{ position: [-0.6, 1.72, 7.8], fov: 48, near: 0.1, far: 150 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
        }}
      >
        <Suspense fallback={null}>
          <FirstFlightSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};
