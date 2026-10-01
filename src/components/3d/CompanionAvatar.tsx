"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterGender } from "@/lib/flight-experience-store";
import { Html } from "@react-three/drei";

interface CompanionAvatarProps {
  gender?: CharacterGender;
  stage: string;
}

// Stage positions and target orientations for the companion avatar
const STAGE_WAYPOINTS: Record<
  string,
  { pos: [number, number, number]; rotY: number; label: string }
> = {
  intro: { pos: [-1.2, 0, 4.2], rotY: 0, label: "准备就绪" },
  pre_safe: { pos: [-1.5, 0, 3.8], rotY: -0.2, label: "出发准备" },
  observe: { pos: [-2.0, 0, 3.2], rotY: -0.4, label: "环顾航站楼" },
  guide_find_flight: { pos: [-4.6, 0, 2.5], rotY: -0.15, label: "核对大屏" },
  guide_path: { pos: [-1.8, 0, 1.8], rotY: 0.9, label: "沿光标前行" },
  guide_security: { pos: [-0.65, 0, 0.45], rotY: 0.2, label: "过检置物" },
  boarding_gate: { pos: [4.6, 0, 1.8], rotY: -0.4, label: "到达登机口" },
  reflection: { pos: [4.6, 0, 1.8], rotY: -0.4, label: "达成登机" },
};

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  gender = "male",
  stage,
}) => {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Position interpolation state
  const currentPos = useRef(new THREE.Vector3(-1.2, 0, 4.2));
  const currentRotY = useRef(0);
  const isMoving = useRef(false);

  const waypoint = STAGE_WAYPOINTS[stage] || STAGE_WAYPOINTS.intro;

  useFrame((state, delta) => {
    if (!avatarGroupRef.current) return;

    const t = state.clock.getElapsedTime();
    const targetVec = new THREE.Vector3(...waypoint.pos);

    // Check distance to target
    const dist = currentPos.current.distanceTo(targetVec);
    isMoving.current = dist > 0.08;

    // Smooth movement interpolation to current stage waypoint
    currentPos.current.lerp(targetVec, Math.min(1, delta * 3.2));
    avatarGroupRef.current.position.copy(currentPos.current);

    // Smooth rotation interpolation
    currentRotY.current = THREE.MathUtils.lerp(
      currentRotY.current,
      waypoint.rotY,
      Math.min(1, delta * 4.0)
    );
    avatarGroupRef.current.rotation.y = currentRotY.current;

    // Dynamic animation: Walking gait when moving, subtle breathing idle when stopped
    if (isMoving.current) {
      const walkFreq = 7.5;
      const legSwing = Math.sin(t * walkFreq) * 0.35;
      const armSwing = Math.sin(t * walkFreq) * 0.32;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      // Bobbing body motion
      avatarGroupRef.current.position.y = Math.abs(Math.sin(t * walkFreq * 2)) * 0.04;
    } else {
      // Idle breathing and head sway
      const idleBreath = Math.sin(t * 1.8) * 0.03;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      // Pose reactions depending on stage
      if (stage === "guide_find_flight") {
        // Looking up at the board
        if (headRef.current) {
          headRef.current.rotation.x = -0.3 + Math.sin(t * 1.2) * 0.04;
          headRef.current.rotation.y = 0.15;
        }
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4;
        if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      } else if (stage === "guide_security") {
        // Reaching down placing item
        if (headRef.current) headRef.current.rotation.x = 0.28;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.65;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -0.35;
      } else if (stage === "boarding_gate" || stage === "reflection") {
        // Standing proud & waving / checking pass
        if (headRef.current) {
          headRef.current.rotation.x = -0.05;
          headRef.current.rotation.y = Math.sin(t * 1.5) * 0.08;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.55 + Math.sin(t * 2.5) * 0.1;
          rightArmRef.current.rotation.z = 0.25;
        }
        if (leftArmRef.current) leftArmRef.current.rotation.x = idleBreath;
      } else {
        // Gentle neutral idle
        if (headRef.current) {
          headRef.current.rotation.x = 0;
          headRef.current.rotation.y = Math.sin(t * 1.2) * 0.06;
        }
        if (leftArmRef.current) leftArmRef.current.rotation.x = idleBreath;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -idleBreath;
        avatarGroupRef.current.position.y = 0;
      }
    }
  });

  // Clothing color schemes by gender
  const colors = useMemo(() => {
    if (gender === "female") {
      return {
        coat: "#c2410c", // Chic warm terracotta trench coat
        inner: "#f8fafc", // White high-neck
        pants: "#1e293b", // Slate black trousers
        shoes: "#451a03", // Leather Chelsea boots
        hair: "#292524", // Dark chestnut
        skin: "#fed7aa", // Gentle natural skin tone
        bag: "#d97706", // Amber leather crossbody
      };
    }
    return {
      coat: "#1e3a8a", // Classic aviation navy bomber jacket
      inner: "#f1f5f9", // Clean casual tee
      pants: "#334155", // Charcoal tailored chinos
      shoes: "#f8fafc", // White travel sneakers
      hair: "#1c1917", // Espresso black
      skin: "#fde68a", // Warm natural skin tone
      bag: "#0f172a", // Dark carry-on tech backpack
    };
  }, [gender]);

  return (
    <group ref={avatarGroupRef} position={STAGE_WAYPOINTS.intro.pos}>
      {/* Companion Floating Status Pill */}
      <Html position={[0, 2.05, 0]} center distanceFactor={14}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] whitespace-nowrap pointer-events-none select-none">
          <span
            className={`w-2 h-2 rounded-full ${
              gender === "female" ? "bg-amber-400" : "bg-sky-400"
            } animate-pulse`}
          />
          <span className="text-[11px] font-medium text-white tracking-wide">
            {gender === "female" ? "Emma" : "Alex"} · {waypoint.label}
          </span>
        </div>
      </Html>

      {/* Character Shadow on Floor */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Master Skeleton Root */}
      <group position={[0, 0, 0]}>
        {/* ================= 1. LEGS & SHOES ================= */}
        {/* Left Leg Root */}
        <group ref={leftLegRef} position={[-0.12, 0.72, 0]}>
          {/* Leg Mesh */}
          <mesh castShadow position={[0, -0.34, 0]}>
            <capsuleGeometry args={[0.065, 0.62, 8, 12]} />
            <meshStandardMaterial color={colors.pants} roughness={0.6} />
          </mesh>
          {/* Left Shoe */}
          <mesh castShadow position={[0, -0.68, 0.05]}>
            <boxGeometry args={[0.11, 0.08, 0.22]} />
            <meshStandardMaterial color={colors.shoes} roughness={0.4} />
          </mesh>
        </group>

        {/* Right Leg Root */}
        <group ref={rightLegRef} position={[0.12, 0.72, 0]}>
          {/* Leg Mesh */}
          <mesh castShadow position={[0, -0.34, 0]}>
            <capsuleGeometry args={[0.065, 0.62, 8, 12]} />
            <meshStandardMaterial color={colors.pants} roughness={0.6} />
          </mesh>
          {/* Right Shoe */}
          <mesh castShadow position={[0, -0.68, 0.05]}>
            <boxGeometry args={[0.11, 0.08, 0.22]} />
            <meshStandardMaterial color={colors.shoes} roughness={0.4} />
          </mesh>
        </group>

        {/* ================= 2. TORSO & COAT ================= */}
        <group position={[0, 1.05, 0]}>
          {/* Inner Shirt */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[0.34, 0.44, 0.22]} />
            <meshStandardMaterial color={colors.inner} roughness={0.5} />
          </mesh>
          {/* Outer Jacket / Trench Coat */}
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.37, 0.52, 0.25]} />
            <meshStandardMaterial color={colors.coat} roughness={0.45} />
          </mesh>
          {/* Coat Collar / Lapels */}
          <mesh position={[0, 0.32, 0.11]}>
            <boxGeometry args={[0.22, 0.12, 0.06]} />
            <meshStandardMaterial color={colors.coat} roughness={0.4} />
          </mesh>

          {/* Travel Bag */}
          {gender === "male" ? (
            /* Backpack */
            <group position={[0, 0.14, -0.16]}>
              <mesh castShadow>
                <boxGeometry args={[0.26, 0.35, 0.14]} />
                <meshStandardMaterial color={colors.bag} roughness={0.7} />
              </mesh>
              {/* Pocket */}
              <mesh position={[0, -0.06, -0.08]}>
                <boxGeometry args={[0.2, 0.14, 0.04]} />
                <meshStandardMaterial color="#020617" />
              </mesh>
            </group>
          ) : (
            /* Crossbody Bag */
            <group position={[0.2, -0.05, 0.08]} rotation={[0, 0, -0.15]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.16, 0.18]} />
                <meshStandardMaterial color={colors.bag} roughness={0.4} />
              </mesh>
              {/* Strap */}
              <mesh position={[-0.14, 0.24, -0.04]} rotation={[0, 0, 0.65]}>
                <boxGeometry args={[0.02, 0.52, 0.02]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            </group>
          )}

          {/* ================= 3. ARMS ================= */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.23, 0.26, 0]}>
            {/* Upper Arm & Forearm */}
            <mesh castShadow position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.05, 0.42, 8, 12]} />
              <meshStandardMaterial color={colors.coat} roughness={0.45} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.45, 0]}>
              <sphereGeometry args={[0.042, 12, 12]} />
              <meshStandardMaterial color={colors.skin} roughness={0.4} />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.23, 0.26, 0]}>
            <mesh castShadow position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.05, 0.42, 8, 12]} />
              <meshStandardMaterial color={colors.coat} roughness={0.45} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.45, 0]}>
              <sphereGeometry args={[0.042, 12, 12]} />
              <meshStandardMaterial color={colors.skin} roughness={0.4} />
            </mesh>

            {/* Boarding Pass or Mobile in Hand during Gate / Flight stage */}
            {(stage === "boarding_gate" || stage === "reflection") && (
              <group position={[0, -0.46, 0.08]} rotation={[0.4, 0, 0]}>
                <mesh>
                  <boxGeometry args={[0.06, 0.12, 0.008]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            )}
          </group>

          {/* ================= 4. HEAD & HAIR ================= */}
          <group ref={headRef} position={[0, 0.46, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.08, 12]} />
              <meshStandardMaterial color={colors.skin} roughness={0.4} />
            </mesh>

            {/* Stylized Head Sphere */}
            <mesh castShadow position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshStandardMaterial color={colors.skin} roughness={0.35} />
            </mesh>

            {/* Stylized Hair */}
            {gender === "female" ? (
              /* Female Hair Style: Stylish Bob / Ponytail */
              <group position={[0, 0.16, 0]}>
                {/* Hair Top Cap */}
                <mesh position={[0, 0.02, -0.01]}>
                  <sphereGeometry args={[0.14, 16, 16]} />
                  <meshStandardMaterial color={colors.hair} roughness={0.7} />
                </mesh>
                {/* Hair Bun / Tail */}
                <mesh position={[0, -0.04, -0.14]}>
                  <sphereGeometry args={[0.06, 12, 12]} />
                  <meshStandardMaterial color={colors.hair} roughness={0.7} />
                </mesh>
                {/* Side Locks */}
                {[-0.12, 0.12].map((hx, idx) => (
                  <mesh key={idx} position={[hx, -0.06, 0.03]} rotation={[0, 0, idx === 0 ? 0.2 : -0.2]}>
                    <boxGeometry args={[0.03, 0.14, 0.06]} />
                    <meshStandardMaterial color={colors.hair} roughness={0.7} />
                  </mesh>
                ))}
              </group>
            ) : (
              /* Male Hair Style: Modern Quiff / Clean Cut */
              <group position={[0, 0.18, 0]}>
                <mesh position={[0, 0, -0.01]}>
                  <boxGeometry args={[0.24, 0.11, 0.25]} />
                  <meshStandardMaterial color={colors.hair} roughness={0.6} />
                </mesh>
                {/* Front Fringe */}
                <mesh position={[0, 0.04, 0.08]}>
                  <boxGeometry args={[0.2, 0.06, 0.08]} />
                  <meshStandardMaterial color={colors.hair} roughness={0.6} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
