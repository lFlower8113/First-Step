"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export const HospitalModel: React.FC = () => {
  // Medical floor tile grid with navigation guide line (Expanded spacious 24x13 hall)
  const floorTiles = useMemo(() => {
    const tiles = [];
    for (let x = -11; x <= 11; x += 1.2) {
      for (let z = -5.8; z <= 5.8; z += 1.2) {
        tiles.push({ x, z });
      }
    }
    return tiles;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. CLINICAL FLOOR & NAVIGATION LINES ================= */}
      {/* Base Foundation Slab (Spacious 24x13) */}
      <mesh receiveShadow position={[0, -0.06, 0]}>
        <boxGeometry args={[24, 0.12, 13]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Terrazzo Clinical Floor Tiles */}
      <group position={[0, 0.005, 0]}>
        {floorTiles.map((tile, i) => (
          <mesh key={i} receiveShadow position={[tile.x, 0, tile.z]}>
            <boxGeometry args={[1.16, 0.01, 1.16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.45}
              metalness={0.05}
            />
          </mesh>
        ))}

        {/* Embedded Color-Coded Department Navigation Wayfinding Line */}
        <mesh position={[0, 0.018, 1.8]}>
          <boxGeometry args={[23, 0.012, 0.12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.018, 2.05]}>
          <boxGeometry args={[23, 0.012, 0.06]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 2. ARCHITECTURAL WALLS (Open-air, No Ceiling Roof) ================= */}
      {/* Back Wall - Antimicrobial Clinical Clean White with Medical Cyan Ribbon */}
      <mesh receiveShadow position={[0, 2.7, -4.8]}>
        <boxGeometry args={[24, 5.4, 0.25]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Medical Cyan Architectural Ribbon Stripe */}
      <mesh position={[0, 2.1, -4.65]}>
        <boxGeometry args={[23.8, 0.35, 0.06]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>

      {/* Dimensional Illuminated Red Cross Emblem with Ambient Halo */}
      <group position={[0, 3.7, -4.66]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.06, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Red Cross Vertical Bar */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.22, 0.72, 0.03]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
        {/* Red Cross Horizontal Bar */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.72, 0.22, 0.03]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
        <pointLight color="#fca5a5" intensity={1.2} distance={3} position={[0, 0, 0.3]} />
      </group>

      {/* Left Glass Curtain Wall (Sunlight Window) */}
      <group position={[-11.9, 2.7, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 5.2, 12.6]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.88}
            transparent
            opacity={0.85}
            roughness={0.06}
          />
        </mesh>
        {[-4.5, -1.5, 1.5, 4.5].map((wz, idx) => (
          <mesh key={idx} position={[0.02, 0, wz]}>
            <boxGeometry args={[0.12, 5.3, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= ZONE ①: SELF-SERVICE REGISTRATION & KIOSKS (Dispersed to Left: x ~ -5.0) ================= */}
      <group position={[-5.0, 0, 1.2]}>
        {/* Overhead Department Signboard */}
        <group position={[0, 3.1, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[2.8, 0.6, 0.08]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[2.6, 0.45]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 3 Multifunction Hospital Smart Kiosks */}
        {[-0.9, 0, 0.9].map((kx, idx) => (
          <group key={idx} position={[kx, 0, 0]}>
            {/* Machine Main Cabinet */}
            <mesh castShadow position={[0, 0.88, 0]}>
              <boxGeometry args={[0.55, 1.76, 0.48]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Upper Blue Header Accent */}
            <mesh position={[0, 1.7, 0.02]}>
              <boxGeometry args={[0.56, 0.14, 0.49]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} />
            </mesh>
            {/* Large Capacitive Touchscreen Display */}
            <mesh position={[0, 1.15, 0.25]} rotation={[-0.22, 0, 0]}>
              <planeGeometry args={[0.44, 0.58]} />
              <meshStandardMaterial
                color="#0ea5e9"
                emissive="#0284c7"
                emissiveIntensity={0.65}
                roughness={0.1}
              />
            </mesh>
            {/* National Health Insurance / ID Card Reader Sensing Area */}
            <mesh position={[-0.14, 0.72, 0.26]}>
              <boxGeometry args={[0.18, 0.04, 0.14]} />
              <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} />
            </mesh>
            {/* Thermal Registration Slip Exit Slot with Paper Protruding */}
            <mesh position={[0.14, 0.72, 0.25]}>
              <boxGeometry args={[0.16, 0.02, 0.08]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[0.14, 0.74, 0.28]} rotation={[-0.3, 0, 0]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Queuing Guidance Retractable Barrier Post */}
        <group position={[-1.7, 0, 0.6]}>
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 20]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Yellow Safety Boundary Line (请在一米线外排队等候) */}
        <mesh position={[0, 0.008, 0.9]}>
          <boxGeometry args={[2.6, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= ZONE ②: NURSE TRIAGE & QUEUE WAITING LOUNGE (Center: x ~ 0.0) ================= */}
      <group position={[0, 0, -0.6]}>
        {/* Modern Curved Clinical Triage Desk */}
        <group position={[0, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
            <boxGeometry args={[3.8, 1.1, 1.1]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          {/* Cyan Recessed Front Accent Band */}
          <mesh position={[0, 0.9, 0.56]}>
            <boxGeometry args={[3.82, 0.14, 0.02]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          {/* Frosted Acrylic Protective Screen Divider */}
          <mesh position={[0, 1.25, 0.2]}>
            <boxGeometry args={[3.6, 0.35, 0.02]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.85} transparent opacity={0.6} roughness={0.2} />
          </mesh>
          {/* Desktop Patient Barcode Check-in Terminal (报到扫描机) */}
          <group position={[-0.8, 1.12, 0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.22, 0.18]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.12, 0.08]} rotation={[-0.35, 0, 0]}>
              <planeGeometry args={[0.2, 0.16]} />
              <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
            </mesh>
          </group>
          {/* Desktop Computer Monitor for Triage Nurse */}
          <group position={[0.6, 1.12, -0.1]}>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.42, 0.28, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        </group>

        {/* Overhead Digital Calling Screen (门诊叫号大屏幕) */}
        <group position={[0, 2.9, -0.4]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.95, 0.08]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Screen Display Face */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[3.05, 0.8]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.7} />
          </mesh>
          {/* Calling Columns Simulation */}
          {[-1.0, 0, 1.0].map((cx, idx) => (
            <mesh key={idx} position={[cx, 0, 0.05]}>
              <planeGeometry args={[0.9, 0.65]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
        </group>

        {/* Waiting Lounge Tandem Seating (排椅 - 4连座) */}
        <group position={[0, 0, 2.6]}>
          {/* Cross Support Beam */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[3.2, 0.04, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* 2 Support Legs */}
          {[-1.2, 1.2].map((lx, idx) => (
            <group key={idx} position={[lx, 0.21, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.42, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.48]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            </group>
          ))}
          {/* 4 Padded Blue Hospital Waiting Chairs */}
          {[-1.15, -0.38, 0.38, 1.15].map((sx, idx) => (
            <group key={idx} position={[sx, 0, 0]}>
              {/* Seat Cushion */}
              <mesh castShadow position={[0, 0.46, 0.05]}>
                <boxGeometry args={[0.55, 0.06, 0.48]} />
                <meshStandardMaterial color="#0369a1" roughness={0.5} />
              </mesh>
              {/* Backrest */}
              <mesh position={[0, 0.75, -0.18]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.55, 0.52, 0.05]} />
                <meshStandardMaterial color="#0369a1" roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Clinical Mobile IV Infusion Drip Stand (移动输液架) beside waiting area */}
        <group position={[1.8, 0, 2.6]}>
          {/* Caster Base with 5 Prongs */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.04, 10]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          {/* Vertical Telescoping Stainless Pole */}
          <mesh castShadow position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.015, 0.018, 1.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Top Hanging Hooks */}
          <mesh position={[0, 1.85, 0]}>
            <boxGeometry args={[0.25, 0.02, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Saline IV Solution Drip Bottle */}
          <group position={[0.1, 1.68, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.9}
                transparent
                opacity={0.8}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, -0.11, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>

        {/* Mobile Nursing Emergency Medication Cart (分诊抢救推车) */}
        <group position={[-2.4, 0, -0.4]} rotation={[0, 0.35, 0]}>
          {/* Cart Main Body */}
          <mesh castShadow position={[0, 0.52, 0]}>
            <boxGeometry args={[0.55, 0.85, 0.44]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* 3 Color-Coded Pullout Medication Drawers */}
          {[-0.15, 0.05, 0.25].map((dy, idx) => (
            <mesh key={idx} position={[0, 0.52 + dy, 0.222]}>
              <boxGeometry args={[0.48, 0.15, 0.02]} />
              <meshStandardMaterial
                color={idx === 0 ? "#0284c7" : idx === 1 ? "#ef4444" : "#10b981"}
              />
            </mesh>
          ))}
          {/* Stainless Steel Push Handle */}
          <group position={[-0.3, 0.9, 0]}>
            <mesh rotation={[0, 0, 1.57]}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.38]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          </group>
          {/* Top Tray with Disinfectant Bottle & Sharps Container */}
          <mesh position={[0.12, 0.98, 0.08]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 10]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-0.1, 0.97, -0.05]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 10]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* 4 Swivel Wheels */}
          {[-0.22, 0.22].map((wx, i) =>
            [-0.16, 0.16].map((wz, j) => (
              <mesh key={`${i}-${j}`} position={[wx, 0.04, wz]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            ))
          )}
        </group>

        {/* Automatic Touchless Hand Sanitizer Dispenser (免洗手感应消毒机) */}
        <group position={[-1.9, 1.45, 0.55]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.28, 0.1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0.052]}>
            <circleGeometry args={[0.02, 16]} />
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= ZONE ③: PHARMACY DISPENSE WINDOWS & DRUG STORAGE (Dispersed to Right: x ~ +5.0) ================= */}
      <group position={[5.0, 0, 1.0]}>
        {/* Pharmacy Wall Partition */}
        <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
          <boxGeometry args={[2.8, 2.8, 0.9]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>

        {/* 2 Pharmacy Dispensing Service Windows with Glass and Intercom */}
        {[-0.7, 0.7].map((wx, idx) => (
          <group key={idx} position={[wx, 1.3, 0.46]}>
            {/* Window Number LED Signboard Above */}
            <mesh position={[0, 0.78, 0]}>
              <boxGeometry args={[0.9, 0.28, 0.04]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <mesh position={[0, 0.78, 0.025]}>
              <planeGeometry args={[0.82, 0.2]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Heavy Glass Partition Screen */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[1.0, 0.95, 0.02]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.92}
                transparent
                roughness={0.05}
                thickness={0.08}
              />
            </mesh>
            {/* Circular Stainless Steel Speaking Intercom Grille */}
            <mesh position={[0, 0.18, 0.02]}>
              <circleGeometry args={[0.065, 24]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Lower Document / Medicine Pass-Through Cutout Tray */}
            <mesh position={[0, -0.42, 0]}>
              <boxGeometry args={[0.55, 0.14, 0.22]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Yellow Safety Boundary Line (一米安全线) in front of pharmacy */}
        <mesh position={[0, 0.008, 1.1]}>
          <boxGeometry args={[2.6, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>

        {/* Interior Automated Medicine Racks (Categorized drug boxes inside pharmacy) */}
        <group position={[0, 1.3, -0.2]}>
          {[-0.4, 0, 0.4].map((ry, rIdx) => (
            <group key={rIdx} position={[0, ry, 0]}>
              {/* Metal Shelf Plate */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.5, 0.02, 0.4]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              {/* Categorized Medicine Cartons in Rows */}
              {[-0.9, -0.5, -0.1, 0.3, 0.7].map((bx, bIdx) => {
                const boxColors = ["#ffffff", "#0284c7", "#10b981", "#f59e0b", "#ffffff"];
                return (
                  <mesh key={bIdx} position={[bx, 0.07, 0]}>
                    <boxGeometry args={[0.22, 0.12, 0.26]} />
                    <meshStandardMaterial color={boxColors[bIdx]} roughness={0.4} />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      </group>

      {/* Standing Department Directory Billboard (科室楼层分布指示牌) */}
      <group position={[-5.2, 0, 2.4]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Main Pillar & Sign Board */}
        <mesh castShadow position={[0, 0.95, 0]}>
          <boxGeometry args={[0.62, 1.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0.95, 0.035]}>
          <planeGeometry args={[0.56, 1.68]} />
          <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.2} />
        </mesh>
        {/* Floor Indicators (1F, 2F, 3F simulation stripes) */}
        {[-0.4, 0.0, 0.4].map((fy, idx) => (
          <mesh key={idx} position={[0, 0.95 + fy, 0.04]}>
            <planeGeometry args={[0.5, 0.22]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>
        ))}
      </group>

      {/* Modern Cylinder Plant Pot adding architectural warmth */}
      <group position={[5.4, 0, -2.8]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.3, 0.22, 0.9, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
