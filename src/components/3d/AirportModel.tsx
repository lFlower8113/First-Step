"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface AirportModelProps {
  isInteractiveMode?: boolean;
  interactiveTrayItems?: string[];
  trayScanned?: boolean;
  targetFlightFound?: boolean;
  isTargetStage?: boolean;
  onTargetFlightClick?: () => void;
  showGuidePath?: boolean;
}

// 1. Realistic High-DPI Departures Screen Texture (ISLAND F 航显屏)
function createDeparturesCanvas(targetFound: boolean, isTargetStage: boolean): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Header Banner
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, 0, canvas.width, 68);

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("ISLAND F • 出港航班动态 DEPARTURES", 28, 44);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 19px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("国内出港 DOMESTIC • 14:15", canvas.width - 28, 44);
  ctx.textAlign = "left";

  // Table Column Headers
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 68, canvas.width, 40);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("航班号 FLIGHT", 28, 95);
  ctx.fillText("目的地 DESTINATION", 230, 95);
  ctx.fillText("计划起飞 TIME", 520, 95);
  ctx.fillText("登机口 GATE", 710, 95);
  ctx.fillText("状态 STATUS", 870, 95);

  // Flight Rows
  const rows = [
    {
      flight: "FS001",
      dest: "北京大兴 PKX",
      time: "14:30",
      gate: "28",
      status: targetFound ? "值机完成" : "正在值机",
      highlight: true,
    },
    {
      flight: "CA1832",
      dest: "上海虹桥 SHA",
      time: "15:10",
      gate: "16",
      status: "正在值机",
      highlight: false,
    },
    {
      flight: "CZ3105",
      dest: "广州白云 CAN",
      time: "15:40",
      gate: "32",
      status: "正在值机",
      highlight: false,
    },
    {
      flight: "MU5118",
      dest: "深圳宝安 SZX",
      time: "16:20",
      gate: "09",
      status: "计划中",
      highlight: false,
    },
    {
      flight: "3U8882",
      dest: "成都天府 TFU",
      time: "16:55",
      gate: "12",
      status: "计划中",
      highlight: false,
    },
  ];

  let y = 108;
  const rowHeight = 60;

  rows.forEach((r, idx) => {
    // Row background
    if (r.highlight) {
      ctx.fillStyle = targetFound
        ? "rgba(16, 185, 129, 0.4)"
        : isTargetStage
        ? "rgba(2, 132, 199, 0.55)"
        : "rgba(30, 58, 138, 0.45)";
      ctx.fillRect(10, y + 4, canvas.width - 20, rowHeight - 8);
      ctx.strokeStyle = targetFound ? "#10b981" : isTargetStage ? "#38bdf8" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, y + 4, canvas.width - 20, rowHeight - 8);
    } else {
      ctx.fillStyle = idx % 2 === 0 ? "#050b18" : "#091328";
      ctx.fillRect(10, y + 4, canvas.width - 20, rowHeight - 8);
    }

    // Flight number
    ctx.font = "bold 23px monospace";
    ctx.fillStyle = r.highlight ? (targetFound ? "#34d399" : "#38bdf8") : "#ffffff";
    ctx.fillText(r.flight, 28, y + 38);

    // Dest
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(r.dest, 230, y + 38);

    // Time
    ctx.font = "20px monospace";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(r.time, 530, y + 38);

    // Gate
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "#facc15";
    ctx.fillText(r.gate, 730, y + 38);

    // Status
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = r.status.includes("值机") ? "#22c55e" : "#f59e0b";
    ctx.fillText(r.status, 870, y + 38);

    y += rowHeight;
  });

  // Footer Marquee strip
  ctx.fillStyle = "#0a192f";
  ctx.fillRect(0, canvas.height - 38, canvas.width, 38);
  ctx.fillStyle = "#93c5fd";
  ctx.font = "15px sans-serif";
  ctx.fillText("★ 乘机提示：请提前 2 小时办理托运，充电宝及锂电池严禁托运，请随身携带。", 28, canvas.height - 14);

  return canvas;
}

// 2. Realistic Gate 28 Boarding FID Screen Texture (登机口大屏)
function createGate28Canvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Banner
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, 90);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 44px monospace";
  ctx.fillText("GATE 28", 36, 62);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("登机口", 260, 60);

  // Flight Info Box
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(28, 110, canvas.width - 56, 150);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 110, canvas.width - 56, 150);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 38px monospace";
  ctx.fillText("FS001", 56, 172);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("北京大兴 PKX", 230, 172);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "20px sans-serif";
  ctx.fillText("计划起飞: 14:30  •  登机口关闭: 14:15", 56, 226);

  // Big Status Banner
  ctx.fillStyle = "#15803d";
  ctx.fillRect(28, 280, canvas.width - 56, 95);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("● 正在登机 NOW BOARDING", canvas.width / 2, 344);
  ctx.textAlign = "left";

  // Footer
  ctx.fillStyle = "#64748b";
  ctx.font = "16px sans-serif";
  ctx.fillText("请提前出示登机牌二维码与有效身份证件 • PLEASE PREPARE BOARDING PASS & ID", 36, 426);

  return canvas;
}

// 3. Overhead Wayfinding Direction Signboard Texture (航站楼蓝色指引大牌)
function createWayfindingCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Navy Blue CAAC / Airport Sign Background
  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  // Divider lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(330, 16);
  ctx.lineTo(330, 164);
  ctx.moveTo(670, 16);
  ctx.lineTo(670, 164);
  ctx.stroke();

  // Section 1: Left
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("← 值机区 A-E", 36, 75);
  ctx.fillStyle = "#facc15";
  ctx.font = "18px sans-serif";
  ctx.fillText("CHECK-IN A-E", 36, 120);

  // Section 2: Center
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("F 岛值机柜台 (国内)", 360, 75);
  ctx.fillStyle = "#facc15";
  ctx.font = "18px sans-serif";
  ctx.fillText("ISLAND F CHECK-IN", 360, 120);

  // Section 3: Right
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("安检 SECURITY →", 710, 75);
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("登机口 GATES 20-35 →", 710, 120);

  return canvas;
}

// 4. Ground Dynamic Guiding Light Ribbon (跟随地面的光 - 带有方向流光箭头的高清导向带)
const GuidingLightPath: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const arrowGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (arrowGroupRef.current) {
      arrowGroupRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          // Continuous forward-flowing light pulse across arrows
          const phase = (t * 2.2 + i * 0.35) % (Math.PI * 2);
          mat.opacity = 0.4 + Math.sin(phase) * 0.45;
          mat.emissiveIntensity = 0.8 + Math.sin(phase) * 0.8;
        }
      });
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.0 + Math.sin(t * 3.0) * 0.4;
    }
  });

  if (!active) return null;

  // Waypoints for Island F -> Security Checkpoint line (Dispersed layout)
  const waypoints = [
    { x: -4.4, z: 2.1 },
    { x: -3.5, z: 2.1 },
    { x: -2.6, z: 2.0 },
    { x: -1.8, z: 1.7 },
    { x: -1.2, z: 1.3 },
    { x: -0.6, z: 0.85 },
  ];

  return (
    <group position={[0, 0.022, 0]}>
      {/* 1. Base Luminous Flow Ribbon (Clear Cyan Runway Track) */}
      {/* Segment 1: In front of Island F Check-in Counter */}
      <mesh position={[-3.5, 0, 2.1]} rotation={[-1.5708, 0, 0]}>
        <planeGeometry args={[2.2, 0.34]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Segment 2: Turning Corridor towards Security Checkpoint */}
      <mesh position={[-1.4, 0, 1.4]} rotation={[-1.5708, 0, 0.52]}>
        <planeGeometry args={[0.34, 2.4]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Directional Animated Chevrons (Flowing ">>>" indicating clear direction to Security) */}
      <group ref={arrowGroupRef}>
        {waypoints.map((wp, idx) => (
          <group key={idx} position={[wp.x, 0.003, wp.z]} rotation={[0, idx < 3 ? 1.57 : 2.1, 0]}>
            <mesh rotation={[-1.5708, 0, 0]}>
              <coneGeometry args={[0.08, 0.16, 3]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#38bdf8"
                emissiveIntensity={1.5}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Path from Security Exit to Gate 28 (Golden Beacon Path reaching Gate 28 at x = 5.2) */}
      <mesh position={[2.6, 0, 0.4]} rotation={[-1.5708, 0, -0.42]}>
        <planeGeometry args={[0.26, 5.2]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Dynamic Illuminating Ambient Floor Light */}
      <pointLight
        ref={lightRef}
        color="#38bdf8"
        intensity={1.2}
        distance={3.5}
        position={[-1.2, 0.25, 1.5]}
      />
    </group>
  );
};



export const AirportModel: React.FC<AirportModelProps> = ({
  isInteractiveMode = false,
  interactiveTrayItems = [],
  trayScanned = false,
  targetFlightFound = false,
  isTargetStage = false,
  onTargetFlightClick,
  showGuidePath = true,
}) => {
  // Conveyor physical animation refs
  const trayGroupRef = useRef<THREE.Group>(null);
  const conveyProgressRef = useRef(0);
  const scanProgressRef = useRef(0);

  useFrame((_, delta) => {
    if (!isInteractiveMode || !trayGroupRef.current) return;

    if (trayScanned) {
      // Phase 2: After security clear, tray glides through the scanner to outfeed (0.1 -> 1.05)
      scanProgressRef.current = Math.min(1.0, scanProgressRef.current + delta / 1.2);
      const t = scanProgressRef.current;
      const ease = t * t * (3 - 2 * t);
      trayGroupRef.current.position.x = 0.1 + (1.05 - 0.1) * ease;
    } else if (interactiveTrayItems.length >= 3) {
      // Phase 1: 3 items in tray, smooth steady slide into tunnel entrance (-1.1 -> 0.1)
      conveyProgressRef.current = Math.min(1.0, conveyProgressRef.current + delta / 1.6);
      const t = conveyProgressRef.current;
      // Smooth cubic ease out: silky smooth entry with zero jitter
      const ease = 1 - Math.pow(1 - t, 3);
      trayGroupRef.current.position.x = -1.1 + (0.1 - (-1.1)) * ease;
    } else {
      // Reset smoothly when items are cleared or user stepped back
      conveyProgressRef.current = 0;
      scanProgressRef.current = 0;
      trayGroupRef.current.position.x = -1.1;
    }
  });

  // Pre-generate dynamic crisp Canvas Textures
  const departuresTex = useMemo(() => {
    const canvas = createDeparturesCanvas(targetFlightFound, isTargetStage);
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [targetFlightFound, isTargetStage]);

  const gate28Tex = useMemo(() => {
    const canvas = createGate28Canvas();
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const wayfindingTex = useMemo(() => {
    const canvas = createWayfindingCanvas();
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 1. Polished airport terrazzo floor tile grid (Expanded spacious terminal hall)
  // 1. Polished airport terrazzo floor tile grid (Grand spacious terminal hall 48m x 20m)
  const floorTiles = useMemo(() => {
    const tiles = [];
    for (let x = -22.5; x <= 22.5; x += 1.6) {
      for (let z = -8.0; z <= 8.0; z += 1.6) {
        tiles.push({ x, z });
      }
    }
    return tiles;
  }, []);

  // 2. Space-frame truss diagonal lattice nodes
  const trussMembers = useMemo(() => {
    const members = [];
    for (let x = -22; x <= 22; x += 1.5) {
      members.push(x);
    }
    return members;
  }, []);

  // 3. Roller conveyor individual stainless steel rollers
  const conveyorRollers = useMemo(() => {
    const rollers = [];
    // Infeed (-1.5 to -0.6) and Outfeed (0.6 to 1.5)
    for (let x = -1.5; x <= -0.65; x += 0.12) {
      rollers.push(x);
    }
    for (let x = 0.65; x <= 1.5; x += 0.12) {
      rollers.push(x);
    }
    return rollers;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. ARCHITECTURAL FOUNDATION & POLISHED FLOOR ================= */}
      {/* Grand Base Structural Foundation with Architectural Joint Lines (Spacious 48m concourse) */}
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[48, 0.16, 20]} />
        <meshStandardMaterial color="#475569" roughness={0.65} />
      </mesh>

      {/* Large Polished High-Traffic Airport Terrazzo Tiles - Natural Harmonious Pearl-Stone Terrazzo */}
      <group position={[0, 0.005, 0]}>
        {floorTiles.map((t, idx) => (
          <mesh key={idx} receiveShadow position={[t.x, 0, t.z]}>
            <boxGeometry args={[1.54, 0.01, 1.54]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#94a3b8" : "#a1b2c4"}
              roughness={0.40}
              metalness={0.06}
            />
          </mesh>
        ))}

        {/* Airport Floor Tactile Paving Strip (Yellow Blind Path leading across terminal) */}
        <mesh position={[0, 0.018, 3.2]}>
          <boxGeometry args={[46, 0.012, 0.28]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>

        {/* Yellow Safety Boundary Line in front of Island F Check-in (Dispersed to Left) */}
        <mesh position={[-5.0, 0.018, 2.1]}>
          <boxGeometry args={[4.2, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>

        {/* Yellow "Please Stand Behind Line" in front of Security WTMD */}
        <mesh position={[0.0, 0.018, 0.8]}>
          <boxGeometry args={[2.4, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>

        {/* Floor Gate Directional Arrow Inlay (Pointing towards Gate 28, Dispersed to Right) */}
        <group position={[5.0, 0.018, 2.1]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.012, 0.4]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0, -0.22]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.12, 0.18, 3]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* ================= 2. SOARING PANORAMIC GLASS CURTAIN WALL & APRON OUTLOOK ================= */}
      {/* Grand 46-meter Floor-to-Ceiling Structural Glass Wall (7.6m soaring height) */}
      <group position={[0, 3.8, -7.0]}>
        <mesh receiveShadow>
          <boxGeometry args={[46.5, 7.6, 0.18]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            transmission={0.88}
            transparent
            opacity={0.82}
            roughness={0.06}
            metalness={0.12}
          />
        </mesh>
        {/* Steel Structural Mullions (Vertical Pillars across grand 46m width) */}
        {[-22, -19.5, -17, -14.5, -12, -9.5, -7, -4.5, -2, 0, 2, 4.5, 7, 9.5, 12, 14.5, 17, 19.5, 22].map((mx, idx) => (
          <mesh key={idx} position={[mx, 0, 0.1]}>
            <boxGeometry args={[0.14, 7.62, 0.16]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
        {/* Horizontal Transom Structural Bars */}
        {[-2.2, 0.2, 2.6].map((my, idx) => (
          <mesh key={idx} position={[0, my, 0.08]}>
            <boxGeometry args={[46.5, 0.1, 0.14]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Exterior Expansive Tarmac Runway Visible Through Glass (56m x 18m) */}
      <group position={[0, 0, -11.5]}>
        {/* Dark Asphalt Apron Surface */}
        <mesh receiveShadow position={[0, -0.08, 0]}>
          <boxGeometry args={[56, 0.12, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.85} />
        </mesh>
        {/* Taxiway Yellow Centerline Stripe */}
        <mesh position={[0, 0.02, -1.8]}>
          <boxGeometry args={[54, 0.012, 0.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* White Dashed Aircraft Stop / Hold Marking */}
        {[-22, -18, -14, -10, -6, -2, 2, 6, 10, 14, 18, 22].map((dx, idx) => (
          <mesh key={idx} position={[dx, 0.02, 0.6]}>
            <boxGeometry args={[1.5, 0.012, 0.12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {/* Runway Edge Blue Beacon Lights */}
        {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((bx, idx) => (
          <group key={idx} position={[bx, 0.08, -2.6]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.07, 0.14, 12]} />
              <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.4} />
            </mesh>
            <pointLight color="#38bdf8" intensity={0.6} distance={3} position={[0, 0.18, 0]} />
          </group>
        ))}

        {/* Apron High-Mast Floodlight Towers */}
        {[-16, 16].map((tx, idx) => (
          <group key={idx} position={[tx, 0, -4.5]}>
            <mesh castShadow position={[0, 4.5, 0]}>
              <cylinderGeometry args={[0.08, 0.15, 9.0, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Top Light Battery Head */}
            <mesh position={[0, 9.1, 0]}>
              <boxGeometry args={[1.2, 0.35, 0.4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <pointLight color="#fdfbf7" intensity={2.0} distance={16} position={[0, 9.0, 0.4]} />
          </group>
        ))}

        {/* Authentic Horizontal Commercial Passenger Airliner 1 (Parked at Gate 28 Jetbridge) */}
        <group position={[8.5, 1.35, -3.8]} rotation={[0, -0.15, 0]}>
          {/* Main Horizontal Aerodynamic Fuselage */}
          <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.92, 0.92, 11.2, 24]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.25} />
          </mesh>
          {/* Streamlined Nose Cone */}
          <mesh position={[0, 0, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.92, 1.8, 24]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.25} />
          </mesh>
          {/* Cockpit Windshield Visor (Tinted Glass) */}
          <mesh position={[0, 0.38, 5.6]} rotation={[-0.45, 0, 0]}>
            <boxGeometry args={[1.1, 0.32, 0.45]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Swept Main Wings */}
          <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[11.6, 0.08, 2.2]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Upward Canting Winglet Wingtips */}
          {[-5.8, 5.8].map((wx, idx) => (
            <mesh key={idx} position={[wx, 0.35, -0.2]} rotation={[0, 0, idx === 0 ? -0.35 : 0.35]}>
              <boxGeometry args={[0.06, 0.8, 0.45]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          ))}
          {/* Under-Wing High-Bypass Jet Engine Turbofans */}
          {[-2.2, 2.2].map((ex, idx) => (
            <group key={idx} position={[ex, -0.65, 0.4]}>
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.42, 0.38, 1.6, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
              </mesh>
              {/* Fan Spinner Intake */}
              <mesh position={[0, 0, 0.82]}>
                <cylinderGeometry args={[0.36, 0.36, 0.04, 16]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}
          {/* Vertical Stabilizer Tail Fin (Aviation Blue Livery) */}
          <mesh position={[0, 1.8, -4.8]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.12, 2.8, 1.8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.25} />
          </mesh>
          {/* Tail Horizontal Stabilizers */}
          <mesh position={[0, 0.45, -5.2]}>
            <boxGeometry args={[4.2, 0.06, 0.9]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} />
          </mesh>
          {/* Red Flashing Beacon Strobe on Fuselage Roof */}
          <mesh position={[0, 1.0, 0.5]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* Distant Commercial Passenger Airliner 2 (Taxiing on distant runway) */}
        <group position={[-16.0, 1.35, -6.5]} rotation={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.82, 0.82, 9.8, 20]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 5.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.82, 1.6, 20]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[10.2, 0.08, 1.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Red Livery Tail Fin */}
          <mesh position={[0, 1.6, -4.2]} rotation={[-0.32, 0, 0]}>
            <boxGeometry args={[0.1, 2.4, 1.6]} />
            <meshStandardMaterial color="#e11d48" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.92, 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.2} />
          </mesh>
        </group>
      </group>

      {/* ================= DISTANT TERMINAL WINGS (Adding Immense Scale & Depth) ================= */}
      {/* Far Left Wing: Distant Island A-E Check-in Bays */}
      <group position={[-14.5, 0, 1.0]}>
        {/* Distant Island E Sign */}
        <group position={[0, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.0, 0.65]} />
            <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Distant Counter Desk */}
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[2.8, 1.16, 0.88]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Far Right Wing: Distant Gates 20-27 Waiting Concourse */}
      <group position={[14.5, 0, 0.8]}>
        {/* Distant Gate Sign */}
        <group position={[0, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.0, 0.65]} />
            <meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Distant Gate Speed Turnstiles */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[2.2, 1.04, 1.0]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
      </group>

      {/* ================= 3. OVERHEAD TERMINAL WAYFINDING DIRECTION SIGNBOARD (Open-air, Suspended) ================= */}
      <group position={[0, 3.8, 1.8]}>
        <mesh castShadow>
          <boxGeometry args={[4.2, 0.6, 0.08]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[4.08, 0.5]} />
          {wayfindingTex ? (
            <meshBasicMaterial map={wayfindingTex} toneMapped={false} />
          ) : (
            <meshStandardMaterial color="#1d4ed8" emissive="#1e40af" emissiveIntensity={0.6} />
          )}
        </mesh>
        {/* Overhead Stainless Steel Suspension Cables (Ceiling Mounted - Zero Floor Obstruction) */}
        {[-1.8, 1.8].map((rx, idx) => (
          <mesh key={idx} position={[rx, 1.1, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* ================= ZONE ①: ISLAND F CHECK-IN & BAGGAGE DROP (Dispersed to Left: x ~ -5.0) ================= */}
      <group position={[-5.0, 0, 1.0]}>
        {/* Overhead Island Sign "ISLAND F / 国内航班出港航显屏" */}
        <group position={[0, 3.2, 0]}>
          {/* Stainless Steel Suspension Rods */}
          {[-0.8, 0.8].map((rx, idx) => (
            <mesh key={idx} position={[rx, 0.7, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
          {/* Signboard Housing Frame */}
          <mesh castShadow>
            <boxGeometry args={[2.3, 0.88, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* High-Resolution Authentically Rendered Departures Screen Face */}
          <group
            position={[0, 0, 0.065]}
            onClick={onTargetFlightClick}
          >
            <mesh>
              <planeGeometry args={[2.18, 0.76]} />
              {departuresTex ? (
                <meshBasicMaterial map={departuresTex} toneMapped={false} />
              ) : (
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
              )}
            </mesh>
          </group>

          {/* Green Status "OPEN" Beacon on corner */}
          <mesh position={[0.98, 0.28, 0.07]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* Island Check-in Counter Desk (Dual Attendant Stations) */}
        <group position={[0, 0, 0]}>
          {/* Main Counter Body - Dark Slate & Architectural Wood Trim */}
          <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
            <boxGeometry args={[2.8, 1.16, 0.88]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.15} />
          </mesh>
          {/* Countertop Surface - Polished Quartz White */}
          <mesh position={[0, 1.17, 0.02]}>
            <boxGeometry args={[2.86, 0.04, 0.94]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.05} />
          </mesh>
          {/* Front Brushed Aluminum Trim Accent Line */}
          <mesh position={[0, 0.85, 0.45]}>
            <boxGeometry args={[2.82, 0.08, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Recessed Kickplate with Subtle LED Glow */}
          <mesh position={[0, 0.05, 0.42]}>
            <boxGeometry args={[2.7, 0.1, 0.04]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
          </mesh>

          {/* 2 Staff Workstations with Dual Flight System Monitors */}
          {[-0.75, 0.75].map((wx, idx) => (
            <group key={idx} position={[wx, 1.19, 0]}>
              {/* LCD Monitor 1 */}
              <group position={[-0.18, 0.22, -0.1]} rotation={[0, 0.12, 0]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.36, 0.24, 0.02]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0, 0, 0.012]}>
                  <planeGeometry args={[0.33, 0.21]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0, -0.14, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
              </group>
              {/* LCD Monitor 2 */}
              <group position={[0.2, 0.22, -0.08]} rotation={[0, -0.12, 0]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.36, 0.24, 0.02]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0, 0, 0.012]}>
                  <planeGeometry args={[0.33, 0.21]} />
                  <meshStandardMaterial color="#047857" emissive="#065f46" emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[0, -0.14, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
              </group>
              {/* Boarding Pass Thermal Slip Printer */}
              <group position={[-0.1, 0.05, 0.2]}>
                <mesh castShadow>
                  <boxGeometry args={[0.18, 0.1, 0.22]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                {/* Paper Output Slot with Protruding Boarding Pass */}
                <mesh position={[0, 0.055, 0.02]} rotation={[-0.2, 0, 0]}>
                  <planeGeometry args={[0.12, 0.08]} />
                  <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                </mesh>
              </group>
              {/* Handheld Barcode Scanner on Cradle */}
              <group position={[0.28, 0.06, 0.22]} rotation={[0.3, 0.4, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.02, 0.03, 0.12, 8]} />
                  <meshStandardMaterial color="#0284c7" />
                </mesh>
              </group>
            </group>
          ))}
        </group>

        {/* Luggage Weighing Scale Platform (Flush with Floor) */}
        <group position={[1.85, 0, 0.1]}>
          {/* Heavy Stainless Steel Tread Scale Base */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.85, 0.16, 1.4]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.165, 0]}>
            <boxGeometry args={[0.82, 0.01, 1.36]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Upright Digital Weight Display Column */}
          <group position={[0.48, 0, -0.6]}>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* LED Display Box */}
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[0.28, 0.18, 0.1]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Glowing Green Weight Reading: "23.5 KG" */}
            <mesh position={[0, 1.05, 0.052]}>
              <planeGeometry args={[0.24, 0.14]} />
              <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Realistic Polycarbonate Suitcase (28-inch Checked Luggage on Scale) */}
          <group position={[0, 0.52, 0]} rotation={[0, 0.15, 0]}>
            {/* Ribbed Hard Shell Body */}
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.42, 0.68, 0.28]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Corner Protective Caps */}
            {[-0.2, 0.2].map((cx, i) =>
              [-0.32, 0.32].map((cy, j) => (
                <mesh key={`${i}-${j}`} position={[cx, cy, 0]}>
                  <boxGeometry args={[0.06, 0.08, 0.29]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
              ))
            )}
            {/* Telescoping Handle Tube */}
            <mesh position={[0, 0.44, -0.1]}>
              <boxGeometry args={[0.18, 0.22, 0.03]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.56, -0.1]}>
              <boxGeometry args={[0.2, 0.03, 0.04]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* 4 360-degree Spinner Wheels */}
            {[-0.15, 0.15].map((wx, i) =>
              [-0.1, 0.1].map((wz, j) => (
                <mesh key={`${i}-${wz}`} position={[wx, -0.37, wz]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.03, 12]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              ))
            )}
            {/* Airline Baggage Tag (White strip attached to top handle) */}
            <group position={[0.08, 0.38, 0.02]} rotation={[0.2, 0.2, -0.3]}>
              <mesh>
                <boxGeometry args={[0.04, 0.22, 0.005]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
              </mesh>
              {/* Barcode Band */}
              <mesh position={[0, -0.04, 0.003]}>
                <boxGeometry args={[0.036, 0.08, 0.006]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          </group>
        </group>

        {/* Motorized Luggage Conveyor Belt (Carrying bags into baggage handling) */}
        <group position={[1.85, 0, -1.2]}>
          {/* Conveyor Bed Frame */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.9, 0.24, 1.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Black Rubber Textured Belt */}
          <mesh position={[0, 0.245, 0]}>
            <boxGeometry args={[0.82, 0.01, 1.38]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          {/* Yellow Safety Hazard Border Striping */}
          {[-0.42, 0.42].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.25, 0]}>
              <boxGeometry args={[0.04, 0.015, 1.38]} />
              <meshStandardMaterial color="#eab308" roughness={0.4} />
            </mesh>
          ))}
          {/* Wall Pass-Through Baggage Hole with Flexible Rubber Flap Curtains */}
          <group position={[0, 0.6, -0.7]}>
            <mesh>
              <boxGeometry args={[0.94, 0.72, 0.1]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Flexible segmented rubber curtain strips */}
            {[-0.3, -0.15, 0, 0.15, 0.3].map((sx, idx) => (
              <mesh key={idx} position={[sx, -0.1, 0.04]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[0.13, 0.5, 0.01]} />
                <meshStandardMaterial color="#090d16" roughness={0.8} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Aerodynamic Self-Service Check-in Kiosk (自助值机机) next to island */}
        <group position={[-2.0, 0, 0.2]} rotation={[0, 0.3, 0]}>
          {/* Kiosk Pedestal Tower */}
          <mesh castShadow position={[0, 0.85, 0]}>
            <boxGeometry args={[0.5, 1.7, 0.44]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Blue Header Aviation Brand Accent */}
          <mesh position={[0, 1.62, 0.02]}>
            <boxGeometry args={[0.51, 0.16, 0.45]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Angled Touchscreen Display */}
          <mesh position={[0, 1.15, 0.23]} rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.42, 0.54]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
          </mesh>
          {/* Passport / ID Card Reader Glass Bed with Scanning Glow */}
          <mesh position={[-0.12, 0.72, 0.24]}>
            <boxGeometry args={[0.16, 0.03, 0.14]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
          </mesh>
          {/* Boarding Pass Printer Slot */}
          <mesh position={[0.12, 0.72, 0.24]}>
            <boxGeometry args={[0.16, 0.02, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Queue Guidance Stanchion Posts with Blue Webbing Belt */}
        <group position={[-1.2, 0, 1.6]}>
          {[-0.8, 0.8].map((px, idx) => (
            <group key={idx} position={[px, 0, 0]}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.04, 20]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow position={[0, 0.48, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.92, 16]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}
          {/* Stretched Navy Guide Belt */}
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[1.6, 0.05, 0.015]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ================= ZONE ②: SECURITY INSPECTION & X-RAY SCANNER (Center: x ~ 0.0) ================= */}
      <group position={[0, 0, -0.6]}>
        {/* Walk-Through Metal Detector (WTMD) Archway */}
        <group position={[-1.1, 0, 0]}>
          {/* Left Vertical Sensor Pillar */}
          <mesh castShadow position={[-0.45, 1.2, 0]}>
            <boxGeometry args={[0.16, 2.4, 0.52]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Left Vertical LED Threat Detection Light Strip */}
          <mesh position={[-0.37, 1.2, 0.262]}>
            <boxGeometry args={[0.02, 2.1, 0.01]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
          </mesh>

          {/* Right Vertical Sensor Pillar */}
          <mesh castShadow position={[0.45, 1.2, 0]}>
            <boxGeometry args={[0.16, 2.4, 0.52]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Right Vertical LED Threat Detection Light Strip */}
          <mesh position={[0.37, 1.2, 0.262]}>
            <boxGeometry args={[0.02, 2.1, 0.01]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
          </mesh>

          {/* Top Control Crossbar */}
          <mesh position={[0, 2.32, 0]}>
            <boxGeometry args={[1.06, 0.22, 0.52]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* WTMD Control Display Module */}
          <mesh position={[0, 2.32, 0.265]}>
            <planeGeometry args={[0.35, 0.14]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
          </mesh>
          {/* Non-Slip Floor Footpad Mat */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.74, 0.015, 0.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>

        {/* Dual-View Tunnel X-Ray Baggage Inspection Scanner */}
        <group position={[1.0, 0, 0]}>
          {/* Lead-Shielded Main Scanner Tunnel Housing */}
          <mesh castShadow position={[0, 0.95, 0]}>
            <boxGeometry args={[1.2, 1.1, 0.95]} />
            <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Yellow Safety Hazard Stripe Band around Scanner */}
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[1.22, 0.08, 0.97]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          {/* Radiation Warning Emblem Decal (Yellow Triangle Simulation) */}
          <mesh position={[0, 1.1, 0.48]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.08, 3]} />
            <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.5} />
          </mesh>

          {/* Lead-Rubber Hanging Safety Curtains (Tunnel Entry & Exit) */}
          {[-0.6, 0.6].map((tx, i) => (
            <group key={i} position={[tx, 0.9, 0]}>
              {[-0.3, -0.1, 0.1, 0.3].map((z, j) => (
                <mesh key={j} position={[0, 0, z]} rotation={[0, 0, i === 0 ? -0.1 : 0.1]}>
                  <boxGeometry args={[0.02, 0.65, 0.18]} />
                  <meshStandardMaterial color="#090d16" roughness={0.8} />
                </mesh>
              ))}
            </group>
          ))}

          {/* Gravity Roller Conveyor Track Bed */}
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[3.2, 0.22, 0.7]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Individual Cylindrical Stainless Steel Rollers */}
          <group>
            {conveyorRollers.map((rx, idx) => (
              <mesh key={idx} position={[rx, 0.6, 0]} rotation={[1.5708, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.62, 12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>

          {/* Plastic Baggage Inspection Tubs / Bins on Conveyor */}
          {/* Tray 1 (Infeed side): Physically driven by useFrame cubic easing animation */}
          <group
            ref={trayGroupRef}
            position-y={0.64}
            position-z={0}
          >
            {/* Gray Plastic Tub */}
            <mesh castShadow>
              <boxGeometry args={[0.54, 0.12, 0.46]} />
              <meshStandardMaterial
                color={interactiveTrayItems.length >= 3 ? "#64748b" : "#94a3b8"}
                roughness={0.4}
              />
            </mesh>

            {!isInteractiveMode ? (
              /* Non-interactive static display: realistic items laid flat in tray per airport regulation */
              <group position={[0, 0.03, 0]}>
                {/* 1. Slim Laptop laid flat */}
                <group position={[0.06, 0.015, -0.02]} rotation={[0, -0.08, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.32, 0.016, 0.22]} />
                    <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
                  </mesh>
                  {/* Subtle Apple / Ultrabook lid badge glow */}
                  <mesh position={[0, 0.009, 0]}>
                    <circleGeometry args={[0.018, 16]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} />
                  </mesh>
                </group>

                {/* 2. Passenger Smartphone placed next to laptop */}
                <group position={[-0.15, 0.015, 0.06]} rotation={[0, 0.12, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.08, 0.012, 0.16]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
                  </mesh>
                  <mesh position={[0, 0.007, 0]}>
                    <planeGeometry args={[0.072, 0.145]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
                  </mesh>
                </group>

                {/* 3. Boarding Pass Slip */}
                <mesh position={[-0.14, 0.01, -0.1]} rotation={[-1.57, 0, 0.2]}>
                  <planeGeometry args={[0.12, 0.06]} />
                  <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                </mesh>
              </group>
            ) : (
              /* Interactive mode: items placed cleanly inside the tray */
              <group position={[0, 0.04, 0]}>
                {/* 1. Phone placed in tray */}
                {interactiveTrayItems.includes("phone") && (
                  <group position={[-0.14, 0.02, 0.08]} rotation={[0, 0.15, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.09, 0.012, 0.17]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0.007, 0]}>
                      <planeGeometry args={[0.08, 0.15]} />
                      <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
                    </mesh>
                  </group>
                )}

                {/* 2. Backpack placed in tray */}
                {interactiveTrayItems.includes("bag") && (
                  <group position={[0.08, 0.08, 0]} rotation={[0, -0.15, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.28, 0.16, 0.24]} />
                      <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
                    </mesh>
                    {/* Backpack Front Pocket */}
                    <mesh position={[0, -0.02, 0.13]}>
                      <boxGeometry args={[0.2, 0.08, 0.03]} />
                      <meshStandardMaterial color="#172554" />
                    </mesh>
                  </group>
                )}

                {/* 3. Jacket placed in tray */}
                {interactiveTrayItems.includes("jacket") && (
                  <group position={[-0.04, 0.06, -0.1]} rotation={[0, 0.25, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.26, 0.09, 0.2]} />
                      <meshStandardMaterial color="#334155" roughness={0.8} />
                    </mesh>
                  </group>
                )}
              </group>
            )}
          </group>

          {/* Security Officer Elevated Workstation Desk & Dual X-Ray Inspection Monitors */}
          <group position={[0, 0, -1.0]}>
            {/* Desk Surface */}
            <mesh castShadow position={[0, 0.6, 0]}>
              <boxGeometry args={[1.2, 1.2, 0.5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Dual Widescreen False-Color X-Ray Inspection Displays */}
            <group position={[-0.28, 1.35, 0.1]} rotation={[0, 0.15, 0]}>
              <mesh>
                <boxGeometry args={[0.48, 0.32, 0.02]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              {/* False Color X-Ray: Orange (Organic) & Blue (Dense Metal/Gun/Knife detection) */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.45, 0.29]} />
                <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.7} />
              </mesh>
            </group>
            <group position={[0.28, 1.35, 0.1]} rotation={[0, -0.15, 0]}>
              <mesh>
                <boxGeometry args={[0.48, 0.32, 0.02]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.45, 0.29]} />
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.7} />
              </mesh>
            </group>
            {/* Officer Handheld Metal Detector Wand on Cradle */}
            <group position={[0.42, 1.22, 0.15]} rotation={[0.4, 0.2, 0]}>
              <mesh>
                <cylinderGeometry args={[0.018, 0.025, 0.35, 8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} />
              </mesh>
            </group>
          </group>

          {/* Standing Instruction Board ("请主动取出笔记本电脑与雨伞") */}
          <group position={[-1.7, 0, 0.8]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Graphic Signboard Face */}
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[0.5, 0.65, 0.03]} />
              <meshStandardMaterial color="#1e40af" />
            </mesh>
            <mesh position={[0, 1.3, 0.018]}>
              <planeGeometry args={[0.46, 0.6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================= ZONE ③: GATE 28 & BOARDING SPEED GATES (Dispersed to Right: x ~ 5.2) ================= */}
      <group position={[5.2, 0, 0.8]}>
        {/* Overhead Gate 28 Flight Information Display Screen (FID) */}
        <group position={[0, 3.2, 0]}>
          {/* Suspension Rods */}
          {[-0.7, 0.7].map((rx, idx) => (
            <mesh key={idx} position={[rx, 0.7, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
          {/* Outer Screen Bezel */}
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.9, 0.12]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* High-Luminance LCD Board Face with Gate 28 Canvas Texture */}
          <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[2.08, 0.78]} />
            {gate28Tex ? (
              <meshBasicMaterial map={gate28Tex} toneMapped={false} />
            ) : (
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
            )}
          </mesh>
        </group>

        {/* Biometric Automated e-Gate Speed Turnstiles (2 Lanes) */}
        <group position={[0, 0, 0]}>
          {/* 3 Brushed Stainless Steel Pedestals forming 2 Walkway Lanes */}
          {[-0.8, 0.0, 0.8].map((px, idx) => (
            <group key={idx} position={[px, 0, 0]}>
              {/* Pedestal Sleek Cabinet */}
              <mesh castShadow position={[0, 0.52, 0]}>
                <boxGeometry args={[0.18, 1.04, 1.2]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.18} />
              </mesh>
              {/* Black Tempered Glass Top Plate */}
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[0.2, 0.02, 1.24]} />
                <meshStandardMaterial color="#020617" roughness={0.1} />
              </mesh>
              {/* QR Boarding Pass / NFC Passport Scanner Bed with Glowing Target */}
              <mesh position={[0, 1.062, 0.35]}>
                <boxGeometry args={[0.14, 0.01, 0.18]} />
                <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
              </mesh>
              {/* Passenger Lane Status Light Indicator (Green Forward Arrow / Red Cross) */}
              <mesh position={[0, 0.75, 0.605]}>
                <boxGeometry args={[0.08, 0.08, 0.01]} />
                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
              </mesh>
              {/* Slender Facial Recognition Camera Pole with Ring Light */}
              <group position={[0, 1.06, -0.3]}>
                <mesh position={[0, 0.28, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.56, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} />
                </mesh>
                {/* Camera Pod */}
                <mesh position={[0, 0.58, 0.02]}>
                  <boxGeometry args={[0.08, 0.1, 0.06]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                {/* Camera Lens */}
                <mesh position={[0, 0.58, 0.052]}>
                  <circleGeometry args={[0.02, 16]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                </mesh>
              </group>
            </group>
          ))}

          {/* Translucent Motorized Swing Flap Wings (Cyan Acrylic Gate Paddles) */}
          {[-0.4, 0.4].map((gx, idx) => (
            <group key={idx} position={[gx, 0.55, 0]}>
              {/* Left & Right Glass Flaps (Partially open angle) */}
              <mesh position={[-0.14, 0, 0]} rotation={[0, 0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.015]} />
                <meshPhysicalMaterial
                  color="#38bdf8"
                  transmission={0.85}
                  transparent
                  opacity={0.7}
                  roughness={0.1}
                />
              </mesh>
              <mesh position={[0.14, 0, 0]} rotation={[0, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.015]} />
                <meshPhysicalMaterial
                  color="#38bdf8"
                  transmission={0.85}
                  transparent
                  opacity={0.7}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Gate Agent Service Podium & Passenger Public Address Microphone */}
        <group position={[-1.4, 0, -0.3]}>
          <mesh castShadow position={[0, 0.58, 0]}>
            <boxGeometry args={[0.7, 1.16, 0.55]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.17, 0]}>
            <boxGeometry args={[0.74, 0.03, 0.58]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Gate Agent Flight Monitor */}
          <group position={[0, 1.34, 0]}>
            <mesh>
              <boxGeometry args={[0.34, 0.24, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[0.31, 0.21]} />
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
            </mesh>
          </group>
          {/* Goose-Neck Announcement Microphone */}
          <group position={[0.22, 1.25, 0.15]} rotation={[0.4, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.11, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
          </group>
        </group>

        {/* Airport Waiting Lounge Beam Chairs (Tandem 4-Seater) */}
        <group position={[0.2, 0, 2.4]}>
          {/* Main Structural Cross Beam */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[3.2, 0.04, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Chrome Support Legs */}
          {[-1.2, 1.2].map((lx, idx) => (
            <group key={idx} position={[lx, 0.21, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.42, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.08, 0.02, 0.48]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>
          ))}
          {/* 4 Ergonomic Perforated Metallic Airport Seats */}
          {[-1.15, -0.38, 0.38, 1.15].map((sx, idx) => (
            <group key={idx} position={[sx, 0, 0]}>
              {/* Contoured Seat Pan */}
              <mesh castShadow position={[0, 0.45, 0.04]}>
                <boxGeometry args={[0.56, 0.04, 0.46]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Backrest */}
              <mesh position={[0, 0.74, -0.18]} rotation={[-0.15, 0, 0]}>
                <boxGeometry args={[0.56, 0.52, 0.04]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Chrome Armrests */}
              {[-0.26, 0.26].map((ax, aIdx) => (
                <group key={aIdx} position={[ax, 0.6, -0.02]}>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.02, 0.02, 0.3]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
        </group>

        {/* Jet Bridge Entrance Portal Doorway (登机廊桥) */}
        <group position={[0, 0, -2.4]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[2.4, 2.8, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Glass Door Panes */}
          {[-0.5, 0.5].map((dx, idx) => (
            <mesh key={idx} position={[dx, 1.25, 0.02]}>
              <boxGeometry args={[0.85, 2.2, 0.02]} />
              <meshPhysicalMaterial color="#38bdf8" transmission={0.88} transparent opacity={0.6} />
            </mesh>
          ))}
          {/* Overhead "JET BRIDGE / 登机廊桥入口" Sign */}
          <mesh position={[0, 2.55, 0.09]}>
            <boxGeometry args={[1.8, 0.28, 0.04]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* Dynamic Guiding Light Ribbon (跟随地面的光) */}
      <GuidingLightPath active={showGuidePath} />
    </group>
  );
};
