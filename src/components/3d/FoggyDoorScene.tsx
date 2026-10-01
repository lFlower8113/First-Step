"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "@/lib/experience-store";
import { ambientAudio } from "@/lib/ambient-sound";

// Camera Director Component that drives cinematic transitions based on stage
const CameraDirector: React.FC = () => {
  const { stage, setStage } = useExperienceStore();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.8, 12));
  const lookAtPos = useRef(new THREE.Vector3(0, 1.8, 0));

  useEffect(() => {
    if (stage === "intro") {
      targetPos.current.set(0, 2.2, 13);
      lookAtPos.current.set(0, 2.0, 0);
    } else if (stage === "observe") {
      targetPos.current.set(0, 1.8, 8.5);
      lookAtPos.current.set(0, 1.8, 0);
    } else if (stage === "stepping") {
      // Accelerate through the portal
      targetPos.current.set(0, 1.8, -3.0);
      lookAtPos.current.set(0, 1.8, -10);
      const timer = setTimeout(() => {
        setStage("reveal");
        ambientAudio.playResolutionChime();
      }, 1800);
      return () => clearTimeout(timer);
    } else if (stage === "reveal") {
      targetPos.current.set(0, 2.0, -5.0);
      lookAtPos.current.set(0, 2.0, -12);
      const timer = setTimeout(() => {
        setStage("reflection");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, setStage]);

  useFrame((state, delta) => {
    // Smooth lerp camera movement
    const lerpSpeed = stage === "stepping" ? 3.2 * delta : 1.8 * delta;
    camera.position.lerp(targetPos.current, lerpSpeed);

    // Subtle gentle breathing floating motion in observe mode
    if (stage === "observe") {
      camera.position.x += Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
      camera.position.y += Math.cos(state.clock.elapsedTime * 0.6) * 0.002;
    }

    camera.lookAt(lookAtPos.current);
  });

  return null;
};

// Swirling Volumetric Mist Particle System
const FoggyParticles: React.FC = () => {
  const { stage } = useExperienceStore();
  const count = 1200;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color("#38bdf8"); // Cyan
    const c2 = new THREE.Color("#e0e7ff"); // Light Mist
    const c3 = new THREE.Color("#fbbf24"); // Amber Light

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution surrounding the corridor and door
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 8.0;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 6.5 - 0.5;
      pos[i * 3 + 2] = Math.random() * 22 - 6;

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = Math.random() * 0.006 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

      const chosenColor = Math.random() > 0.4 ? (Math.random() > 0.5 ? c1 : c2) : c3;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, vel, col];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const speedMultiplier = stage === "stepping" ? 7.0 : stage === "reveal" ? 3.0 : 1.0;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3] * speedMultiplier;
      array[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier;
      // In stepping mode, particles fly past camera
      if (stage === "stepping") {
        array[i * 3 + 2] += 0.25;
      } else {
        array[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier;
      }

      // Reset particles that drift too far
      if (array[i * 3 + 1] > 6.5) array[i * 3 + 1] = -0.5;
      if (array[i * 3 + 2] > 16) array[i * 3 + 2] = -6;
      if (array[i * 3 + 2] < -8) array[i * 3 + 2] = 15;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={stage === "reveal" ? 0.08 : 0.05}
        vertexColors
        transparent
        opacity={stage === "reveal" ? 0.8 : 0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// The Monumental "Door in the Fog" Monolith Arch
const DoorMonolith: React.FC = () => {
  const { stage, triggerFirstStep, recordDoorHover, soundEnabled } = useExperienceStore();
  const [hovered, setHovered] = React.useState(false);
  const portalLightRef = useRef<THREE.PointLight>(null);

  const handlePointerEnter = () => {
    setHovered(true);
    recordDoorHover();
    if (soundEnabled && stage === "observe") {
      ambientAudio.playHoverChime();
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const handleStepClick = () => {
    if (stage === "observe") {
      if (soundEnabled) {
        ambientAudio.playPortalSwell();
      }
      triggerFirstStep();
    }
  };

  useFrame((state) => {
    if (!portalLightRef.current) return;
    const t = state.clock.elapsedTime;
    // Breathing pulse
    if (stage === "observe") {
      portalLightRef.current.intensity = 2.2 + Math.sin(t * 2) * 0.8 + (hovered ? 1.5 : 0);
    } else if (stage === "stepping") {
      portalLightRef.current.intensity = 8.0;
    } else if (stage === "reveal") {
      portalLightRef.current.intensity = 15.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Left Monolith Pillar - Obsidian / Basalt */}
      <mesh castShadow receiveShadow position={[-1.4, 2.2, 0]}>
        <boxGeometry args={[0.55, 4.4, 0.65]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      {/* Left Pillar Glowing Inscribed Rune Vein */}
      <mesh position={[-1.12, 2.2, 0.33]}>
        <boxGeometry args={[0.02, 3.6, 0.01]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>

      {/* Right Monolith Pillar */}
      <mesh castShadow receiveShadow position={[1.4, 2.2, 0]}>
        <boxGeometry args={[0.55, 4.4, 0.65]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      {/* Right Pillar Glowing Inscribed Rune Vein */}
      <mesh position={[1.12, 2.2, 0.33]}>
        <boxGeometry args={[0.02, 3.6, 0.01]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>

      {/* Floating Monolith Lintel */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh castShadow position={[0, 4.4, 0]}>
          <boxGeometry args={[3.45, 0.6, 0.7]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.35}
            metalness={0.3}
          />
        </mesh>
        {/* Lintel Glowing Inscribed Rune */}
        <mesh position={[0, 4.4, 0.36]}>
          <boxGeometry args={[2.2, 0.03, 0.01]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={hovered ? 2.5 : 1.2}
          />
        </mesh>
      </Float>

      {/* Radiant Portal Aperture (The Gateway into Unknown) */}
      <group
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleStepClick}
      >
        {/* Portal Light Membrane */}
        <mesh position={[0, 2.2, 0]}>
          <planeGeometry args={[2.25, 4.0]} />
          <meshBasicMaterial
            color={stage === "reveal" ? "#ffffff" : hovered ? "#7dd3fc" : "#38bdf8"}
            transparent
            opacity={stage === "reveal" ? 0.95 : hovered ? 0.75 : 0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Ethereal Golden Core Shaft */}
        <pointLight
          ref={portalLightRef}
          position={[0, 2.2, -0.2]}
          color={stage === "reveal" ? "#fef08a" : hovered ? "#e0f2fe" : "#38bdf8"}
          distance={stage === "reveal" ? 25 : 12}
          intensity={2.5}
        />

        {/* Interactive Floating Pulse Tag in 'observe' Stage */}
        {stage === "observe" && (
          <Html position={[0, 1.8, 0.2]} center zIndexRange={[100, 0]}>
            <div
              onClick={handleStepClick}
              className={`px-5 py-2.5 rounded-full select-none cursor-pointer transition-all duration-300 flex items-center gap-2.5 backdrop-blur-2xl ${
                hovered
                  ? "bg-sky-400 text-black font-extrabold scale-110 shadow-[0_0_35px_rgba(56,189,248,0.9)] ring-4 ring-sky-300/40"
                  : "bg-black/60 text-sky-200 border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-pulse"
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                迈出第一步
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* Infinite Mirror Slate Floor */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial
          color="#030712"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

export const FoggyDoorScene: React.FC = () => {
  const { stage, recordPointerMove } = useExperienceStore();

  return (
    <div
      onMouseMove={recordPointerMove}
      className="relative w-full h-screen bg-black overflow-hidden select-none"
    >
      <Canvas
        camera={{ position: [0, 2.2, 13], fov: 48 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        {/* Dynamic Dark Ambient Lighting */}
        <ambientLight intensity={stage === "reveal" ? 1.5 : 0.15} />

        {/* Cinematic Director Camera Motion */}
        <CameraDirector />

        {/* Volumetric Fog & Star Particles */}
        <FoggyParticles />

        {/* Monumental Door In The Fog */}
        <DoorMonolith />
      </Canvas>
    </div>
  );
};
