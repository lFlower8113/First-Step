"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

// 1. High-Resolution Outpatient Queue Calling Board Canvas Texture (门诊叫号大屏)
function createTriageBoardCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background - Deep Medical Navy Blue
  ctx.fillStyle = "#021329";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Header Banner
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#0369a1");
  gradient.addColorStop(0.5, "#0284c7");
  gradient.addColorStop(1, "#0369a1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 80);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("三甲医院门诊大厅 · 实时就诊叫号与分诊指引", 36, 52);

  ctx.fillStyle = "#bae6fd";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "right";
  ctx.fillText("09:42:15  |  内科综合诊区", canvas.width - 36, 52);
  ctx.textAlign = "left";

  // Table Column Headers
  ctx.fillStyle = "#0f2744";
  ctx.fillRect(24, 96, canvas.width - 48, 48);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("诊室名称", 50, 128);
  ctx.fillText("主诊医师", 260, 128);
  ctx.fillText("当前就诊", 480, 128);
  ctx.fillText("请候诊", 690, 128);
  ctx.fillText("诊室状态", 870, 128);

  // Table Rows (Live Outpatient Queue Data)
  const rows = [
    { room: "内科一诊室 (01)", doctor: "张伟 主任医师", current: "A-1028 (李*华)", next: "A-1029, A-1030", status: "● 就诊中", color: "#22c55e" },
    { room: "内科二诊室 (02)", doctor: "刘芳 副主任医师", current: "A-1031 (王*强)", next: "A-1032, A-1033", status: "● 叫号中", color: "#f59e0b" },
    { room: "心血管内科 (03)", doctor: "陈晨 主治医师", current: "B-2005 (赵*平)", next: "B-2006, B-2007", status: "● 就诊中", color: "#22c55e" },
    { room: "神经内科 (04)", doctor: "赵明 副主任医师", current: "B-2012 (孙*林)", next: "B-2013", status: "● 就诊中", color: "#22c55e" },
    { room: "呼吸内科 (05)", doctor: "钱峰 主任医师", current: "C-3001 (周*杰)", next: "C-3002, C-3003", status: "● 叫号中", color: "#f59e0b" },
    { room: "专家特需诊室", doctor: "孙立成 教授", current: "S-008 (张*)", next: "S-009", status: "● 就诊中", color: "#22c55e" },
  ];

  let y = 148;
  const rowH = 48;
  rows.forEach((r, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? "rgba(15, 39, 68, 0.45)" : "rgba(10, 25, 48, 0.45)";
    ctx.fillRect(24, y, canvas.width - 48, rowH);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px sans-serif";
    ctx.fillText(r.room, 50, y + 32);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    ctx.fillText(r.doctor, 260, y + 32);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText(r.current, 480, y + 32);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px monospace";
    ctx.fillText(r.next, 690, y + 32);

    ctx.fillStyle = r.color;
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(r.status, 870, y + 32);

    y += rowH;
  });

  // Footer Marquee strip
  ctx.fillStyle = "#010b18";
  ctx.fillRect(0, canvas.height - 46, canvas.width, 46);
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "16px sans-serif";
  ctx.fillText("★ 医保就医提示：请听到叫号后持医保码或就诊卡进入诊室，过号请至护士分诊台重新刷卡排号。", 36, canvas.height - 18);

  return canvas;
}

// 2. High-Resolution Medical Smart Kiosk Touchscreen UI (银医自助终端屏幕)
function createKioskScreenCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, "#0369a1");
  bgGrad.addColorStop(0.3, "#075985");
  bgGrad.addColorStop(1, "#0c4a6e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("智慧医院自助服务终端", canvas.width / 2, 54);

  ctx.fillStyle = "#bae6fd";
  ctx.font = "16px sans-serif";
  ctx.fillText("全国医保联网 · 银医通一站式服务", canvas.width / 2, 88);

  // Central Card Insert Indicator
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(36, 114, canvas.width - 72, 80);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 114, canvas.width - 72, 80);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("请在感应区刷 医保码 / 身份证 / 就诊卡", canvas.width / 2, 160);

  // 4 Primary Functional Buttons (2x2 Grid)
  const buttons = [
    { title: "当日挂号", sub: "REGISTER TODAY", color: "#0284c7", icon: "🩺", x: 36, y: 220 },
    { title: "预约取号", sub: "APPOINTMENT", color: "#059669", icon: "📋", x: 268, y: 220 },
    { title: "门诊缴费", sub: "SELF PAYMENT", color: "#d97706", icon: "💳", x: 36, y: 380 },
    { title: "报告打印", sub: "PRINT REPORT", color: "#7c3aed", icon: "📑", x: 268, y: 380 },
  ];

  ctx.textAlign = "left";
  buttons.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, 208, 130);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, 208, 130);

    ctx.fillStyle = "#ffffff";
    ctx.font = "28px sans-serif";
    ctx.fillText(b.icon, b.x + 20, b.y + 50);

    ctx.font = "bold 22px sans-serif";
    ctx.fillText(b.title, b.x + 20, b.y + 88);

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "12px monospace";
    ctx.fillText(b.sub, b.x + 20, b.y + 112);
  });

  // Footer Payment Support Logos
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
  ctx.fillStyle = "#e0f2fe";
  ctx.font = "15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("支持 电子医保码 • 微信支付 • 支付宝 • 银联云闪付", canvas.width / 2, canvas.height - 28);

  return canvas;
}

// 3. High-Resolution Pharmacy Dispensing LED Screen Canvas Texture (药房取药窗口大屏)
function createPharmacySignCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // LED Screen Dark Background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Title Bar
  ctx.fillStyle = "#0369a1";
  ctx.fillRect(0, 0, canvas.width, 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("西药房发药处 · 01 号窗口", canvas.width / 2, 40);

  // Active Calling Numbers Box
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(20, 80, canvas.width - 40, 110);
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 80, canvas.width - 40, 110);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("● 请取药 NOW PICKUP", canvas.width / 2, 115);

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 34px monospace";
  ctx.fillText("P-1025 (李*华)", canvas.width / 2, 162);

  // Footer
  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px sans-serif";
  ctx.fillText("正在配药: P-1026, P-1027 • 请核对处方小票", canvas.width / 2, 226);

  return canvas;
}

// 4. Clinic Door Digital LCD Plate Canvas (诊室门前电子门牌)
function createClinicDoorSignCanvas(room: string, title: string, doctor: string): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0284c7";
  ctx.fillRect(0, 0, canvas.width, 56);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${room} · ${title}`, canvas.width / 2, 38);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`主诊: ${doctor}`, canvas.width / 2, 100);

  ctx.fillStyle = "#15803d";
  ctx.fillRect(24, 130, canvas.width - 48, 50);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("● 正在就诊: 028号", canvas.width / 2, 162);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "15px sans-serif";
  ctx.fillText("请下一位患者在门外候诊区等候", canvas.width / 2, 218);

  return canvas;
}

export const HospitalModel: React.FC = () => {
  // Canvas textures with SSR safeguards and memoized GPU upload
  const triageTex = useMemo(() => {
    const canvas = createTriageBoardCanvas();
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const kioskTex = useMemo(() => {
    const canvas = createKioskScreenCanvas();
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const pharmacyTex = useMemo(() => {
    const canvas = createPharmacySignCanvas();
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const clinic01Tex = useMemo(() => {
    const canvas = createClinicDoorSignCanvas("01", "内科诊室", "张伟 主任医师");
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const clinic02Tex = useMemo(() => {
    const canvas = createClinicDoorSignCanvas("02", "外科诊室", "刘芳 副主任医师");
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Medical seamless floor tile grid (Grand spacious 26m x 14m outpatient concourse)
  const floorTiles = useMemo(() => {
    const tiles = [];
    for (let x = -12.5; x <= 12.5; x += 1.4) {
      for (let z = -6.5; z <= 6.5; z += 1.4) {
        tiles.push({ x, z });
      }
    }
    return tiles;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. CLINICAL ANTIBACTERIAL FLOORING & COLOR-CODED WAYFINDING ================= */}
      {/* Base Foundation Slab with Clean Precision Expansion Joints */}
      <mesh receiveShadow position={[0, -0.06, 0]}>
        <boxGeometry args={[26, 0.12, 14]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Terrazzo Clinical Floor Tiles - High-traffic Medical Pearl Grey / Ivory Finish */}
      <group position={[0, 0.005, 0]}>
        {floorTiles.map((tile, i) => (
          <mesh key={i} receiveShadow position={[tile.x, 0, tile.z]}>
            <boxGeometry args={[1.35, 0.01, 1.35]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#f8fafc" : "#f1f5f9"}
              roughness={0.35}
              metalness={0.06}
            />
          </mesh>
        ))}

        {/* Embedded Color-Coded Department Navigation Wayfinding Tracks (三甲医院经典彩色地标动线) */}
        {/* Track 1: Blue Line -> Registration & Cashier (引导往左侧挂号机) */}
        <group position={[-3.5, 0.016, 2.8]}>
          <mesh>
            <boxGeometry args={[12, 0.012, 0.14]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          {/* Arrow pointing left */}
          <mesh position={[-5.8, 0.01, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <coneGeometry args={[0.15, 0.25, 3]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Track 2: Emerald Green Line -> Outpatient Clinic & Triage (引导直行至分诊台与诊室) */}
        <group position={[0, 0.016, 0.5]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[7.5, 0.012, 0.14]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} />
          </mesh>
          {/* Arrow pointing forward to clinics */}
          <mesh position={[0, 0.01, -3.8]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.15, 0.25, 3]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Track 3: Warm Orange Line -> Pharmacy Dispensing & Lab (引导往右侧西药房) */}
        <group position={[3.5, 0.016, 2.8]}>
          <mesh>
            <boxGeometry args={[12, 0.012, 0.14]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} />
          </mesh>
          {/* Arrow pointing right */}
          <mesh position={[5.8, 0.01, 0]} rotation={[0, Math.PI / 2, 0]}>
            <coneGeometry args={[0.15, 0.25, 3]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </group>

      {/* ================= 2. ARCHITECTURAL CLINICAL WALLS & CONSULTATION DOORS ================= */}
      {/* Back Wall - Antimicrobial Pure White with Deep Cyan Ribbon Accent */}
      <group position={[0, 2.7, -5.2]}>
        <mesh receiveShadow>
          <boxGeometry args={[26, 5.4, 0.25]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Cyan Architectural Ribbon Stripe */}
        <mesh position={[0, 2.1, 0.14]}>
          <boxGeometry args={[25.8, 0.38, 0.04]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>

        {/* Dimensional Backlit Red Cross Emblem */}
        <group position={[0, 3.8, 0.15]}>
          <mesh>
            <cylinderGeometry args={[0.75, 0.75, 0.06, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Red Cross Vertical Bar */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.22, 0.8, 0.03]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
          {/* Red Cross Horizontal Bar */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.8, 0.22, 0.03]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
          <pointLight color="#fca5a5" intensity={1.5} distance={3.5} position={[0, 0, 0.3]} />
        </group>

        {/* Clinic Door 1: 内科一诊室 (Left Clinic Doorway) */}
        <group position={[-3.2, -1.3, 0.14]}>
          {/* Wooden Door Frame */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 2.5, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
          </mesh>
          {/* Door Leaf Body */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.36, 2.38, 0.04]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          {/* Frosted Vision Panel Window */}
          <mesh position={[0, 0.35, 0.03]}>
            <boxGeometry args={[0.42, 0.85, 0.02]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.65} roughness={0.2} />
          </mesh>
          {/* Stainless Steel Push Bar Handle */}
          <mesh position={[0.55, -0.15, 0.06]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
          {/* Digital Clinic Doorplate LCD Screen */}
          <group position={[0, 1.55, 0.06]}>
            <mesh>
              <boxGeometry args={[0.72, 0.45, 0.04]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.68, 0.41]} />
              {clinic01Tex ? (
                <meshBasicMaterial map={clinic01Tex} toneMapped={false} />
              ) : (
                <meshStandardMaterial color="#0284c7" />
              )}
            </mesh>
          </group>
        </group>

        {/* Clinic Door 2: 外科二诊室 (Right Clinic Doorway) */}
        <group position={[3.2, -1.3, 0.14]}>
          {/* Wooden Door Frame */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 2.5, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
          </mesh>
          {/* Door Leaf Body */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.36, 2.38, 0.04]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          {/* Frosted Vision Panel Window */}
          <mesh position={[0, 0.35, 0.03]}>
            <boxGeometry args={[0.42, 0.85, 0.02]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.65} roughness={0.2} />
          </mesh>
          {/* Stainless Steel Push Bar Handle */}
          <mesh position={[-0.55, -0.15, 0.06]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
          {/* Digital Clinic Doorplate LCD Screen */}
          <group position={[0, 1.55, 0.06]}>
            <mesh>
              <boxGeometry args={[0.72, 0.45, 0.04]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.68, 0.41]} />
              {clinic02Tex ? (
                <meshBasicMaterial map={clinic02Tex} toneMapped={false} />
              ) : (
                <meshStandardMaterial color="#0284c7" />
              )}
            </mesh>
          </group>
        </group>
      </group>

      {/* Left Glass Window Wall (Daylight Flood) */}
      <group position={[-12.9, 2.7, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 5.2, 13.6]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.92}
            transparent
            opacity={0.8}
            roughness={0.06}
          />
        </mesh>
        {[-5, -2.5, 0, 2.5, 5].map((wz, idx) => (
          <mesh key={idx} position={[0.02, 0, wz]}>
            <boxGeometry args={[0.12, 5.3, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= ZONE ①: SELF-SERVICE REGISTRATION & PAYMENT (Left: x ~ -5.2) ================= */}
      <group position={[-5.2, 0, 1.2]}>
        {/* Overhead Glowing Signboard "自助挂号与缴费区 (SELF-SERVICE KIOSKS)" */}
        <group position={[0, 3.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 0.65, 0.08]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[3.48, 0.52]} />
            <meshStandardMaterial color="#ffffff" emissive="#0284c7" emissiveIntensity={0.25} />
          </mesh>
          {/* Ceiling Suspension Rods */}
          {[-1.5, 1.5].map((rx, idx) => (
            <mesh key={idx} position={[rx, 0.8, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* 3 Multifunction Smart Medical Kiosks with High-Res Interactive Touch Screen Textures */}
        {[-1.15, 0, 1.15].map((kx, idx) => (
          <group key={idx} position={[kx, 0, 0]}>
            {/* Machine Main Body Enclosure */}
            <mesh castShadow position={[0, 0.88, 0]}>
              <boxGeometry args={[0.62, 1.76, 0.48]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Cyan Aviation/Medical Accent Band on Top */}
            <mesh position={[0, 1.72, 0.02]}>
              <boxGeometry args={[0.63, 0.12, 0.49]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            {/* Touchscreen Glass Face with Rich Canvas Texture */}
            <group position={[0, 1.16, 0.25]} rotation={[-0.22, 0, 0]}>
              <mesh>
                <planeGeometry args={[0.54, 0.68]} />
                {kioskTex ? (
                  <meshBasicMaterial map={kioskTex} toneMapped={false} />
                ) : (
                  <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.7} />
                )}
              </mesh>
            </group>
            {/* National Health Insurance / ID Card Reader with Glowing Green Sensing Area */}
            <mesh position={[-0.15, 0.72, 0.26]}>
              <boxGeometry args={[0.18, 0.04, 0.14]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.7} />
            </mesh>
            {/* Barcode & QR Code Optical Scanner Bed */}
            <mesh position={[0.15, 0.72, 0.26]}>
              <boxGeometry args={[0.16, 0.03, 0.12]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
            {/* Thermal Receipt Paper Exit Slot with Printed Slip Protruding */}
            <mesh position={[0, 0.62, 0.25]}>
              <boxGeometry args={[0.18, 0.02, 0.06]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[0, 0.61, 0.28]} rotation={[-0.35, 0, 0]}>
              <planeGeometry args={[0.14, 0.14]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Queuing Guidance Retractable Barrier Post with Stretched Blue Webbing */}
        <group position={[-2.1, 0, 0.6]}>
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
        <mesh position={[0, 0.008, 0.95]}>
          <boxGeometry args={[3.6, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= ZONE ②: NURSE TRIAGE & LIVE CALLING DISPLAY (Center: x ~ 0.0) ================= */}
      <group position={[0, 0, -0.6]}>
        {/* Overhead Grand Digital Outpatient Queue Calling Board (门诊叫号大屏 - High Resolution) */}
        <group position={[0, 3.4, 0.2]}>
          {/* Stainless Steel Suspension Rods */}
          {[-1.6, 1.6].map((rx, idx) => (
            <mesh key={idx} position={[rx, 0.9, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
          ))}
          {/* Screen Outer Aluminum Housing */}
          <mesh castShadow>
            <boxGeometry args={[4.4, 2.2, 0.12]} />
            <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* High-Resolution Screen Face with Table Data Texture */}
          <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[4.28, 2.08]} />
            {triageTex ? (
              <meshBasicMaterial map={triageTex} toneMapped={false} />
            ) : (
              <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.8} />
            )}
          </mesh>
        </group>

        {/* Modern Ergonomic Clinical Triage Desk (门诊导医分诊台) */}
        <group position={[0, 0, 0]}>
          {/* Main Curved Antibacterial Counter Body */}
          <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
            <boxGeometry args={[4.2, 1.1, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Cyan Recessed Front Accent Band */}
          <mesh position={[0, 0.88, 0.56]}>
            <boxGeometry args={[4.22, 0.12, 0.02]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Front Illuminated Acrylic "分诊导医咨询台 (NURSE TRIAGE)" Logo */}
          <mesh position={[0, 0.5, 0.56]}>
            <boxGeometry args={[1.8, 0.32, 0.02]} />
            <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>

          {/* Frosted Protective Acrylic Sneeze Guard */}
          <mesh position={[0, 1.25, 0.15]}>
            <boxGeometry args={[4.0, 0.38, 0.02]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.88} transparent opacity={0.65} roughness={0.15} />
          </mesh>

          {/* Desktop Patient Barcode Check-in Terminal (患者报到扫码墩，带绿色激光感应区) */}
          <group position={[-1.2, 1.14, 0.35]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.24, 0.2]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.13, 0.09]} rotation={[-0.35, 0, 0]}>
              <planeGeometry args={[0.22, 0.18]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Desktop Electronic Arm Blood Pressure Monitor (便民电子血压计) */}
          <group position={[-0.4, 1.15, 0.25]}>
            <mesh castShadow position={[0, 0.08, 0]}>
              <boxGeometry args={[0.34, 0.16, 0.26]} />
              <meshStandardMaterial color="#f1f5f9" />
            </mesh>
            {/* Cylindrical Arm Cuff Tunnel */}
            <mesh position={[0, 0.12, 0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.075, 0.075, 0.28, 16]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* LED Digital Display for BP Readout */}
            <mesh position={[0, 0.15, -0.09]} rotation={[-0.4, 0, 0]}>
              <planeGeometry args={[0.18, 0.08]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Nurse Triage Workstation LCD Monitor */}
          <group position={[0.9, 1.14, -0.1]}>
            <mesh position={[0, 0.24, 0]}>
              <boxGeometry args={[0.48, 0.32, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.24, 0.012]}>
              <planeGeometry args={[0.45, 0.29]} />
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>

          {/* Automatic Touchless Hand Sanitizer Dispenser (免洗手感应消毒机) */}
          <group position={[-2.15, 1.25, 0.35]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.32, 0.12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.04, 0.062]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.9} />
            </mesh>
          </group>
        </group>

        {/* Waiting Lounge Tandem Seating (排椅 - 4连座) */}
        <group position={[0, 0, 2.7]}>
          {/* Main Structural Cross Beam */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[3.4, 0.04, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.88} />
          </mesh>
          {/* Chrome Legs */}
          {[-1.3, 1.3].map((lx, idx) => (
            <group key={idx} position={[lx, 0.21, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.42, 12]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.48]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
            </group>
          ))}
          {/* 4 Ergonomic Padded Medical Blue Waiting Chairs */}
          {[-1.2, -0.4, 0.4, 1.2].map((sx, idx) => (
            <group key={idx} position={[sx, 0, 0]}>
              {/* Seat Cushion */}
              <mesh castShadow position={[0, 0.46, 0.05]}>
                <boxGeometry args={[0.58, 0.06, 0.48]} />
                <meshStandardMaterial color="#0284c7" roughness={0.5} />
              </mesh>
              {/* Backrest */}
              <mesh position={[0, 0.75, -0.18]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.58, 0.52, 0.05]} />
                <meshStandardMaterial color="#0284c7" roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Mobile IV Infusion Drip Stand (移动输液架) beside waiting area */}
        <group position={[2.1, 0, 2.7]}>
          {/* 5-Prong Caster Base */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.04, 10]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          {/* Vertical Telescoping Stainless Steel Pole */}
          <mesh castShadow position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.015, 0.018, 1.8, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Top Hanging Hooks */}
          <mesh position={[0, 1.85, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Saline IV Solution Drip Bottle */}
          <group position={[0.1, 1.68, 0]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.045, 0.2, 12]} />
              <meshPhysicalMaterial color="#e0f2fe" transmission={0.92} transparent opacity={0.85} roughness={0.08} />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>

        {/* Commercial Drinking Water Dispenser (便民温热直饮机) */}
        <group position={[-2.4, 0, 2.7]}>
          {/* Water Dispenser Body Cabinet */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.42, 1.2, 0.38]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          {/* Top Blue 5-Gallon Water Bottle */}
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.34, 16]} />
            <meshPhysicalMaterial color="#38bdf8" transmission={0.9} transparent opacity={0.7} />
          </mesh>
          {/* Hot and Cold Push Spigots */}
          <mesh position={[-0.08, 0.72, 0.2]}>
            <boxGeometry args={[0.04, 0.06, 0.06]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.08, 0.72, 0.2]}>
            <boxGeometry args={[0.04, 0.06, 0.06]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Disposable Paper Cup Stack Dispenser Tube */}
          <group position={[0.25, 0.75, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.85} transparent opacity={0.6} />
            </mesh>
          </group>
        </group>

        {/* Health Education Pamphlet & Magazine Rack (便民健康科普宣教架) */}
        <group position={[-2.9, 0, 0.2]} rotation={[0, 0.35, 0]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.45, 1.2, 0.15]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
          </mesh>
          {/* 3 Tier Pamphlet Pockets */}
          {[-0.25, 0.05, 0.35].map((py, idx) => (
            <mesh key={idx} position={[0, 0.6 + py, 0.08]}>
              <boxGeometry args={[0.4, 0.18, 0.04]} />
              <meshStandardMaterial color={idx === 0 ? "#0284c7" : idx === 1 ? "#10b981" : "#f59e0b"} />
            </mesh>
          ))}
        </group>

        {/* Foldable Hospital Wheelchair (便民就诊轮椅) */}
        <group position={[2.7, 0, 0.2]} rotation={[0, -0.4, 0]}>
          {/* Wheelchair Main Steel Tubing Frame */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[0.55, 0.04, 0.5]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.75, -0.22]}>
            <boxGeometry args={[0.52, 0.55, 0.03]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Two Large Rear Wheels */}
          {[-0.32, 0.32].map((wx, idx) => (
            <mesh key={idx} position={[wx, 0.32, -0.05]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))}
          {/* Footrests */}
          <mesh position={[0, 0.12, 0.32]}>
            <boxGeometry args={[0.42, 0.02, 0.15]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ================= ZONE ③: PHARMACY DISPENSING & MEDICINE STORAGE (Right: x ~ +5.2) ================= */}
      <group position={[5.2, 0, 1.0]}>
        {/* Pharmacy Wall Partition */}
        <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
          <boxGeometry args={[3.2, 2.8, 1.1]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>

        {/* Overhead Digital Calling LED Screen for Pharmacy */}
        <group position={[0, 2.35, 0.6]}>
          <mesh>
            <boxGeometry args={[2.8, 0.65, 0.06]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[2.72, 0.58]} />
            {pharmacyTex ? (
              <meshBasicMaterial map={pharmacyTex} toneMapped={false} />
            ) : (
              <meshStandardMaterial color="#0284c7" />
            )}
          </mesh>
        </group>

        {/* 2 Pharmacy Dispensing Service Windows with Safety Glass, Speaking Intercom & Pass Tray */}
        {[-0.8, 0.8].map((wx, idx) => (
          <group key={idx} position={[wx, 1.15, 0.56]}>
            {/* Window Glass Pane */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1.05, 0.95, 0.02]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.92} transparent roughness={0.05} thickness={0.06} />
            </mesh>
            {/* Stainless Steel Speaking Intercom Grille */}
            <mesh position={[0, 0.22, 0.02]}>
              <circleGeometry args={[0.07, 24]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} />
            </mesh>
            {/* Lower Medicine & Prescription Pass-Through Cutout Tray */}
            <mesh position={[0, -0.38, 0]}>
              <boxGeometry args={[0.55, 0.16, 0.22]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
            {/* Medicine Bag on Tray ready for pickup */}
            <mesh position={[0, -0.32, 0.05]}>
              <boxGeometry args={[0.22, 0.14, 0.12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Yellow Safety Boundary Line (请在一米线外排队等候) */}
        <mesh position={[0, 0.008, 1.25]}>
          <boxGeometry args={[3.2, 0.012, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>

        {/* High-Density Medicine Storage Carousel Shelves inside Pharmacy */}
        <group position={[0, 1.3, -0.2]}>
          {[-0.5, -0.1, 0.3, 0.7].map((ry, rIdx) => (
            <group key={rIdx} position={[0, ry, 0]}>
              {/* Metal Shelf Plate */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.9, 0.02, 0.45]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
              {/* Rows of Color-Coded Medicine Boxes (Antibiotics, Cardiac, Respiratory) */}
              {[-1.1, -0.65, -0.2, 0.25, 0.7, 1.15].map((bx, bIdx) => {
                const boxColors = ["#ffffff", "#0284c7", "#10b981", "#f59e0b", "#ef4444", "#ffffff"];
                return (
                  <mesh key={bIdx} position={[bx, 0.07, 0]}>
                    <boxGeometry args={[0.26, 0.12, 0.32]} />
                    <meshStandardMaterial color={boxColors[bIdx]} roughness={0.4} />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      </group>

      {/* Standing Department Directory Billboard (科室楼层分布指示牌) */}
      <group position={[-5.4, 0, 2.8]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.72, 0.04, 0.32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 1.0, 0]}>
          <boxGeometry args={[0.66, 1.9, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 1.0, 0.035]}>
          <planeGeometry args={[0.6, 1.78]} />
          <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.2} />
        </mesh>
        {/* Floor Indicators (1F, 2F, 3F, 4F) */}
        {[-0.5, -0.18, 0.15, 0.48].map((fy, idx) => (
          <mesh key={idx} position={[0, 1.0 + fy, 0.04]}>
            <planeGeometry args={[0.54, 0.2]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#0284c7" : "#0369a1"} />
          </mesh>
        ))}
      </group>

      {/* Modern Cylindrical Architectural Ficus Tree Planter Pot */}
      <group position={[5.6, 0, -3.2]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.32, 0.24, 0.9, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Green Foliage Globe */}
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
