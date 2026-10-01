"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export const CoffeeShopModel: React.FC = () => {
  // Generate vertical wooden fluted slats for the front counter facade
  const flutedSlats = useMemo(() => {
    const slats = [];
    const count = 64;
    const startX = -4.2;
    const step = 8.4 / count;
    for (let i = 0; i < count; i++) {
      slats.push(startX + i * step);
    }
    return slats;
  }, []);

  // Generate herringbone floor planks with natural warm honey-oak variations (Expanded spacious hall)
  const floorPlanks = useMemo(() => {
    const planks = [];
    const woodColors = ["#854d0e", "#9a6128", "#a16207", "#78350f", "#8c5324"];
    for (let x = -10; x <= 10; x += 0.8) {
      for (let z = -5.6; z <= 5.6; z += 0.8) {
        const color = woodColors[Math.abs(Math.floor(x * 3 + z * 7)) % woodColors.length];
        planks.push({ x, z, color });
      }
    }
    return planks;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= ARCHITECTURAL WARM TRACK LIGHTING FIXTURES ================= */}
      <group position={[0, 4.3, 0]}>
        {/* Main Ceiling Track Conduit Rods */}
        <mesh position={[0, 0, -1.2]}>
          <boxGeometry args={[14, 0.05, 0.05]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 1.8]}>
          <boxGeometry args={[14, 0.05, 0.05]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} />
        </mesh>

        {/* 6 Warm 3000K Spotlights Illuminating the Service Counter, Menu, and Seating */}
        {[
          { x: -3.8, z: 0.8, color: "#fffbeb", intensity: 2.4 },
          { x: -1.6, z: -0.6, color: "#fef08a", intensity: 2.6 },
          { x: -0.2, z: 0.2, color: "#fffbeb", intensity: 2.4 },
          { x: 1.6, z: -0.4, color: "#fff7ed", intensity: 2.5 },
          { x: 3.4, z: 0.2, color: "#fffbeb", intensity: 2.4 },
          { x: -3.6, z: 2.0, color: "#fef3c7", intensity: 2.2 },
        ].map((light, idx) => (
          <group key={idx} position={[light.x, 0, light.z]}>
            {/* Track Light Canister Fixture */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.16, 16]} />
              <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Luminous Warm Light Lens */}
            <mesh position={[0, -0.16, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color={light.color} />
            </mesh>
            {/* Actual Warm Light Source casting golden glow */}
            <pointLight
              color={light.color}
              intensity={light.intensity}
              distance={8.0}
              decay={1.8}
              position={[0, -0.25, 0]}
            />
          </group>
        ))}
      </group>

      {/* ================= 1. ARCHITECTURAL FLOORING (Spacious 22x13) ================= */}
      {/* Base Floor Slab */}
      <mesh receiveShadow position={[0, -0.06, 0]}>
        <boxGeometry args={[22, 0.12, 13]} />
        <meshStandardMaterial color="#452a1a" roughness={0.7} />
      </mesh>

      {/* Herringbone Parquet Wood Tiles with warm honey-oak satin sheen */}
      <group position={[0, 0.005, 0]}>
        {floorPlanks.map((p, i) => (
          <mesh
            key={i}
            receiveShadow
            position={[p.x, 0, p.z]}
            rotation={[0, (i % 2 === 0 ? 0.785 : -0.785), 0]}
          >
            <boxGeometry args={[0.76, 0.01, 0.18]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.32}
              metalness={0.06}
            />
          </mesh>
        ))}
        {/* Polished Brass Floor Transition Inlay Strip */}
        <mesh position={[0, 0.018, 4.2]}>
          <boxGeometry args={[21.5, 0.015, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 2. ARCHITECTURAL WALLS & WINDOWS ================= */}
      {/* Back Wall - Rich Starbucks Reserve Emerald Green (#064e3b) */}
      <mesh receiveShadow position={[0, 2.7, -4.8]}>
        <boxGeometry args={[22, 5.4, 0.25]} />
        <meshStandardMaterial color="#064e3b" roughness={0.55} />
      </mesh>

      {/* Vertical Acoustic Timber Slats on Back Wall */}
      {[-9, -7.5, -6, 6, 7.5, 9].map((wx, idx) => (
        <mesh key={idx} receiveShadow position={[wx, 2.7, -4.65]}>
          <boxGeometry args={[0.7, 5.2, 0.06]} />
          <meshStandardMaterial color="#5c3821" roughness={0.45} />
        </mesh>
      ))}

      {/* Left Wall - Architectural Concrete with warm tone */}
      <mesh receiveShadow position={[-10.9, 2.7, 0]}>
        <boxGeometry args={[0.25, 5.4, 13]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>

      {/* Right Wall - Large Floor-to-Ceiling Storefront Glass with Black Steel Mullions */}
      <group position={[10.9, 2.7, 0]}>
        {/* Glass Panes */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 5.2, 12.6]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            transmission={0.88}
            transparent
            opacity={0.8}
            roughness={0.08}
            reflectivity={0.9}
          />
        </mesh>
        {/* Steel Mullions */}
        {[-5, -2.5, 0, 2.5, 5].map((mz, idx) => (
          <mesh key={idx} position={[0, 0, mz]}>
            <boxGeometry args={[0.12, 5.3, 0.08]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Horizontal Mullion */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.08, 12.8]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 3. BACKLIT STARBUCKS SIREN EMBLEM ================= */}
      <group position={[0, 3.3, -4.66]}>
        {/* Outer Circular Brass Bevel Ring */}
        <mesh>
          <cylinderGeometry args={[0.82, 0.82, 0.06, 48]} />
          <meshStandardMaterial color="#c5a059" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Deep Green Inner Core Disc */}
        <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.02, 48]} />
          <meshStandardMaterial color="#006241" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Laser-cut Radial Crown & Star Relief */}
        <mesh position={[0, 0.2, 0.05]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.02]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.05]}>
          <ringGeometry args={[0.42, 0.48, 48]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Emerald Backlight Halo */}
        <pointLight color="#34d399" intensity={1.5} distance={2.5} position={[0, 0, 0.2]} />
      </group>

      {/* ================= 4. OVERHEAD CHALKBOARD MENU (Open-air, No Ceiling Roof) ================= */}
      <group position={[-0.8, 3.2, -2.1]}>
        {/* Deep Slate Blackboard with Walnut Frame */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[5.6, 1.25, 0.08]} />
          <meshStandardMaterial color="#171717" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[5.75, 1.4, 0.06]} />
          <meshStandardMaterial color="#3e2723" roughness={0.6} />
        </mesh>
        {/* Chalk Drink Panels (Espresso & Frappuccino Columns) */}
        {[-1.8, -0.6, 0.6, 1.8].map((cx, idx) => (
          <group key={idx} position={[cx, 0, 0.045]}>
            <mesh>
              <planeGeometry args={[1.1, 0.95]} />
              <meshStandardMaterial color="#262626" roughness={0.9} />
            </mesh>
            {/* Decorative Chalk Lines & Item Strips */}
            {[-0.3, -0.1, 0.1, 0.3].map((ly, lIdx) => (
              <mesh key={lIdx} position={[0, ly, 0.005]}>
                <planeGeometry args={[0.9, 0.025]} />
                <meshBasicMaterial color="#e5e5e5" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ================= 5. THE GRAND BARISTA SERVICE BAR (Expanded 9.2m) ================= */}
      <group position={[0, 0, -1.0]}>
        {/* Luxury Honed Calacatta Marble Countertop with Waterfall Edge */}
        <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
          <boxGeometry args={[9.4, 0.1, 1.7]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.16}
            metalness={0.06}
          />
        </mesh>
        {/* Recessed Warm LED Linear Cove Light Under Marble Lip */}
        <mesh position={[0, 0.92, 0.86]}>
          <boxGeometry args={[9.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>

        {/* Counter Core Body */}
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[9.2, 0.92, 1.55]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>

        {/* Realistic Fluted Tambour Wooden Vertical Slats along Front */}
        <group position={[0, 0.45, 0.79]}>
          {flutedSlats.map((sx, idx) => (
            <mesh key={idx} position={[sx, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.88, 12]} />
              <meshStandardMaterial color="#63391d" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Polished Brass Tubular Foot Rail with Stanchions */}
        <group position={[0, 0.12, 0.92]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 9.0, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
          {[-4.2, -2.8, -1.4, 0, 1.4, 2.8, 4.2].map((rx, idx) => (
            <mesh key={idx} position={[rx, -0.06, -0.06]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}
        </group>

        {/* ================= ZONE ①: ENTRY QUEUE & SIGNAGE (Dispersed to Left: x ~ -3.8) ================= */}
        <group position={[-3.8, 0, 1.0]}>
          {/* Polished Stainless Steel Stanchions with Emerald Retractable Strap */}
          {[-0.6, 0.6].map((sx, idx) => (
            <group key={idx} position={[sx, 0, 0]}>
              <mesh castShadow position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 16]} />
                <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.025, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
                <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.98, 0]}>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          ))}
          {/* Retractable Emerald Strap */}
          <mesh position={[0, 0.88, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#00754a" roughness={0.7} />
          </mesh>

          {/* Wooden A-Frame Daily Special Easel Board */}
          <group position={[0.9, 0.45, 0.6]} rotation={[0, -0.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.9, 0.05]} />
              <meshStandardMaterial color="#3e2723" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.02, 0.03]}>
              <planeGeometry args={[0.38, 0.72]} />
              <meshStandardMaterial color="#171717" roughness={0.95} />
            </mesh>
            {/* Chalk Title Accent */}
            <mesh position={[0, 0.28, 0.035]}>
              <planeGeometry args={[0.28, 0.04]} />
              <meshBasicMaterial color="#34d399" />
            </mesh>
          </group>
        </group>

        {/* ================= ZONE ②: POINT OF SALE & STARBUCKS CUP SIZES (Center-Left: x ~ -0.8) ================= */}
        <group position={[-0.8, 1.03, 0.2]}>
          {/* Dual-Display POS Touchscreen Terminal */}
          <group position={[0, 0, 0]}>
            <mesh castShadow position={[0, 0.16, 0]}>
              <boxGeometry args={[0.32, 0.32, 0.14]} />
              <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Cashier Screen */}
            <mesh position={[0, 0.28, -0.06]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.44, 0.28, 0.02]} />
              <meshStandardMaterial color="#09090b" roughness={0.15} />
            </mesh>
            {/* Customer Facing Confirmation Screen */}
            <mesh position={[0, 0.28, 0.06]} rotation={[-0.35, 0, 0]}>
              <boxGeometry args={[0.44, 0.28, 0.02]} />
              <meshStandardMaterial color="#09090b" roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.28, 0.075]} rotation={[-0.35, 0, 0]}>
              <planeGeometry args={[0.4, 0.24]} />
              <meshStandardMaterial color="#006241" emissive="#004d33" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Thermal Receipt Printer with Printed Paper Ticket Out */}
          <group position={[0.42, 0.08, 0.08]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.16, 0.22]} />
              <meshStandardMaterial color="#27272a" roughness={0.5} />
            </mesh>
            {/* Paper Slip extending out */}
            <mesh position={[0, 0.13, 0.05]} rotation={[-0.3, 0, 0]}>
              <planeGeometry args={[0.12, 0.18]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* NFC / QR Payment Scanner Pedestal */}
          <group position={[0.42, 0.06, 0.36]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.12, 0.16]} />
              <meshStandardMaterial color="#18181b" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>

          {/* STARBUCKS CUP SIZE SHOWCASE: Tall (中), Grande (大), Venti (超大) */}
          <group position={[-0.75, 0, 0.1]}>
            {/* 1. Tall (中杯 - 355ml) - The Smallest! */}
            <group position={[-0.32, 0.09, 0]}>
              {/* Flared Paper Cup */}
              <mesh castShadow>
                <cylinderGeometry args={[0.048, 0.038, 0.18, 24]} />
                <meshStandardMaterial color="#fefefe" roughness={0.3} />
              </mesh>
              {/* Kraft Sleeve with Starbucks Stamp */}
              <mesh position={[0, -0.01, 0]}>
                <cylinderGeometry args={[0.049, 0.044, 0.08, 24]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
              </mesh>
              {/* Siren Green Disc on Sleeve */}
              <mesh position={[0, -0.01, 0.05]}>
                <circleGeometry args={[0.025, 24]} />
                <meshBasicMaterial color="#00754a" />
              </mesh>
              {/* White Sip Lid */}
              <mesh position={[0, 0.095, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.018, 24]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.4} />
              </mesh>
            </group>

            {/* 2. Grande (大杯 - 473ml) - The Standard */}
            <group position={[0, 0.115, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.054, 0.04, 0.23, 24]} />
                <meshStandardMaterial color="#fefefe" roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.01, 0]}>
                <cylinderGeometry args={[0.055, 0.048, 0.09, 24]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.01, 0.056]}>
                <circleGeometry args={[0.028, 24]} />
                <meshBasicMaterial color="#00754a" />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.056, 0.056, 0.018, 24]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.4} />
              </mesh>
            </group>

            {/* 3. Venti (超大杯 - 591ml) - The Favorite */}
            <group position={[0.34, 0.14, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.058, 0.042, 0.28, 24]} />
                <meshStandardMaterial color="#fefefe" roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.01, 0]}>
                <cylinderGeometry args={[0.059, 0.051, 0.1, 24]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.01, 0.06]}>
                <circleGeometry args={[0.03, 24]} />
                <meshBasicMaterial color="#00754a" />
              </mesh>
              <mesh position={[0, 0.145, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.018, 24]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.4} />
              </mesh>
            </group>
          </group>

          {/* Curved Bakery Pastry Vitrine (Display Case) */}
          <group position={[-1.9, 0.26, 0]}>
            {/* Frameless Low-Iron Curved Glass Box */}
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.52, 0.72]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.96}
                opacity={1}
                transparent
                roughness={0.04}
                reflectivity={0.9}
                thickness={0.15}
              />
            </mesh>
            {/* Matte Black Metal Base Frame */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[1.42, 0.04, 0.74]} />
              <meshStandardMaterial color="#18181b" metalness={0.8} />
            </mesh>
            {/* Tiered Glass Shelves */}
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[1.32, 0.015, 0.6]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.1} />
            </mesh>
            {/* Warm Interior Display LED Light */}
            <pointLight color="#fde047" intensity={0.9} distance={1.4} position={[0, 0.18, 0]} />

            {/* Hand-Crafted Pastries on Slate Trays */}
            {/* Croissants */}
            {[-0.45, -0.15].map((cx, idx) => (
              <mesh key={idx} position={[cx, 0.04, 0.08]} rotation={[0, 0.2, 0]}>
                <torusGeometry args={[0.065, 0.035, 12, 24, Math.PI * 1.1]} />
                <meshStandardMaterial color="#d97706" roughness={0.7} />
              </mesh>
            ))}
            {/* Blueberry Muffins */}
            {[0.15, 0.45].map((mx, idx) => (
              <group key={idx} position={[mx, 0.05, 0.08]}>
                <mesh>
                  <cylinderGeometry args={[0.045, 0.035, 0.06, 16]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.035, 0]}>
                  <sphereGeometry args={[0.052, 16, 16]} />
                  <meshStandardMaterial color="#451a03" roughness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* ================= ZONE ③: ESPRESSO MACHINE, PICKUP & CONDIMENTS (Dispersed to Right: x ~ +2.4 to +4.4) ================= */}
        <group position={[2.4, 1.03, 0.1]}>
          {/* COMMERCIAL ESPRESSO MACHINE (La Marzocco Linea Style Dual-Group) */}
          <group position={[0, 0.32, -0.3]}>
            {/* Main Chassis - Brushed Matte Stainless Steel & Black Enamel */}
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.58, 0.62]} />
              <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Polished Mirror-Chrome Front Facing Panel */}
            <mesh position={[0, 0, 0.315]}>
              <boxGeometry args={[1.05, 0.52, 0.02]} />
              <meshStandardMaterial color="#f4f4f5" metalness={0.98} roughness={0.08} />
            </mesh>

            {/* Top Wire Cup Warming Rail with Porcelain Demitasses */}
            <group position={[0, 0.32, 0]}>
              <mesh>
                <boxGeometry args={[1.02, 0.04, 0.54]} />
                <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
              </mesh>
              {/* Stacked White Espresso Cups */}
              {[-0.35, -0.15, 0.15, 0.35].map((ux, idx) => (
                <group key={idx} position={[ux, 0.06, (idx % 2 === 0 ? 0.1 : -0.1)]}>
                  <mesh>
                    <cylinderGeometry args={[0.04, 0.025, 0.055, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* Saturated Dual Groupheads with Portafilters */}
            {[-0.22, 0.22].map((gx, idx) => (
              <group key={idx} position={[gx, -0.05, 0.38]}>
                {/* Chrome Neck */}
                <mesh position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
                </mesh>
                {/* Portafilter Basket & Double Spout */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.048, 0.045, 0.06, 16]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Ergonomic Angled Bakelite Handle */}
                <mesh position={[0, 0.02, 0.14]} rotation={[0.25, 0, 0]}>
                  <cylinderGeometry args={[0.015, 0.018, 0.2, 12]} />
                  <meshStandardMaterial color="#09090b" roughness={0.3} />
                </mesh>
              </group>
            ))}

            {/* Dual Steam Wands with Knurled Cool-Touch Sleeves */}
            {[-0.48, 0.48].map((wx, idx) => (
              <group key={idx} position={[wx, 0.05, 0.34]} rotation={[0.2, (idx === 0 ? 0.3 : -0.3), 0]}>
                <mesh>
                  <cylinderGeometry args={[0.012, 0.012, 0.26, 12]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
                </mesh>
                {/* Rotary Steam Valve Knobs */}
                <mesh position={[0, 0.16, -0.06]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.05, 16]} />
                  <meshStandardMaterial color="#18181b" metalness={0.6} />
                </mesh>
              </group>
            ))}

            {/* Mechanical Pressure Gauges & Digital Shot Timers */}
            <mesh position={[-0.32, 0.16, 0.33]}>
              <circleGeometry args={[0.035, 24]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.32, 0.16, 0.33]}>
              <circleGeometry args={[0.035, 24]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Cyan OLED Shot Timers */}
            <mesh position={[0, 0.16, 0.33]}>
              <planeGeometry args={[0.14, 0.05]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>

            {/* Slotted Stainless Steel Drip Tray */}
            <mesh position={[0, -0.28, 0.2]}>
              <boxGeometry args={[1.05, 0.06, 0.45]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Precision Coffee Grinder with Transparent Amber Bean Hopper */}
          <group position={[-0.75, 0.38, -0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.13, 0.15, 0.48, 20]} />
              <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Tinted Amber Hopper filled with dark roast coffee beans */}
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.15, 0.08, 0.3, 20]} />
              <meshPhysicalMaterial
                color="#451a03"
                transmission={0.8}
                roughness={0.15}
                transparent
              />
            </mesh>
            {/* Hopper Chrome Lid */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.155, 0.155, 0.03, 20]} />
              <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* Barista Tooling: Pitcher Rinser, Tamping Mat & Frothing Pitchers */}
          <group position={[-0.75, 0.02, 0.2]}>
            {/* Counter-sunk Pitcher Rinser with Star Actuator */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.28, 0.02, 0.28]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.02, 8]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>

            {/* Stainless Steel Spouted Milk Pitchers */}
            <group position={[0.26, 0.08, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.048, 0.042, 0.14, 20]} />
                <meshStandardMaterial color="#f4f4f5" metalness={0.98} roughness={0.1} />
              </mesh>
            </group>
          </group>

          {/* 4-Bottle Acrylic Flavor Syrup Rack (Vanilla, Caramel, Hazelnut, Classic) */}
          <group position={[0.72, 0.16, -0.2]}>
            {[-0.18, -0.06, 0.06, 0.18].map((bx, idx) => {
              const syrupColors = ["#d97706", "#b45309", "#92400e", "#78350f"];
              return (
                <group key={idx} position={[bx, 0, 0]}>
                  {/* Glass Bottle */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.038, 0.038, 0.26, 16]} />
                    <meshPhysicalMaterial
                      color={syrupColors[idx]}
                      transmission={0.82}
                      transparent
                      roughness={0.15}
                    />
                  </mesh>
                  {/* Gold Pump Head */}
                  <mesh position={[0, 0.16, 0]}>
                    <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
                    <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh position={[0.03, 0.19, 0]} rotation={[0, 0, -0.4]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
                    <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* DEDICATED PICKUP COUNTER ZONE (出餐台) */}
          <group position={[0.82, 0.02, 0.2]}>
            {/* Walnut Serving Mat */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.85, 0.02, 0.55]} />
              <meshStandardMaterial color="#2d1b11" roughness={0.6} />
            </mesh>
            {/* Freshly Prepared Iced Macchiato with Signature Green Straw */}
            <group position={[0, 0.14, 0]}>
              {/* Clear Cold Cup */}
              <mesh castShadow>
                <cylinderGeometry args={[0.054, 0.038, 0.24, 20]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  transmission={0.92}
                  transparent
                  roughness={0.06}
                  thickness={0.04}
                />
              </mesh>
              {/* Layered Espresso & Milk Gradient */}
              <mesh position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.036, 0.18, 20]} />
                <meshStandardMaterial color="#451a03" roughness={0.25} />
              </mesh>
              {/* Green Straw */}
              <mesh position={[0.015, 0.08, 0]} rotation={[0.1, 0, 0.15]}>
                <cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />
                <meshStandardMaterial color="#00754a" roughness={0.4} />
              </mesh>
            </group>
          </group>

          {/* FREE CONDIMENT BAR TABLE (调味吧台 - Dispersed) */}
          <group position={[1.8, -0.15, 1.4]}>
            {/* Solid Walnut Tabletop with Beveled Rim */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
              <boxGeometry args={[0.95, 0.06, 0.75]} />
              <meshStandardMaterial color="#3e2723" roughness={0.45} />
            </mesh>
            {/* 4 Black Metal Hairpin Legs */}
            {[-0.4, 0.4].map((lx, lIdx) =>
              [-0.3, 0.3].map((lz, zIdx) => (
                <mesh key={`${lIdx}-${zIdx}`} position={[lx, 0.22, lz]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                  <meshStandardMaterial color="#18181b" metalness={0.8} />
                </mesh>
              ))
            )}

            {/* Condiment Accessories On Top */}
            {/* 1. Paper Napkin Dispenser */}
            <mesh castShadow position={[-0.3, 0.62, -0.12]}>
              <boxGeometry args={[0.18, 0.16, 0.18]} />
              <meshStandardMaterial color="#f4f4f5" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* 2. Straw Dispenser (Clear Acrylic Tower) */}
            <mesh castShadow position={[-0.05, 0.64, -0.12]}>
              <cylinderGeometry args={[0.065, 0.065, 0.22, 16]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.1} />
            </mesh>
            {/* 3. Kraft Cup Sleeve Dispenser */}
            <mesh castShadow position={[0.2, 0.6, -0.12]}>
              <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
              <meshStandardMaterial color="#92400e" roughness={0.9} />
            </mesh>
            {/* 4. Three Spice Shakers (Cinnamon, Cocoa, Nutmeg) */}
            {[-0.2, 0.0, 0.2].map((sx, idx) => (
              <group key={idx} position={[sx, 0.59, 0.16]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.032, 0.032, 0.12, 16]} />
                  <meshPhysicalMaterial color="#f4f4f5" transmission={0.7} transparent roughness={0.1} />
                </mesh>
                {/* Perforated Metal Screw Top */}
                <mesh position={[0, 0.065, 0]}>
                  <cylinderGeometry args={[0.034, 0.034, 0.02, 16]} />
                  <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* ================= 7. MID-CENTURY CAFE SEATING LOUNGE ================= */}
      <group position={[-3.6, 0, 2.0]}>
        {/* Round Bistro Table with Cast-Iron Fluted Base */}
        <group position={[0, 0, 0]}>
          <mesh castShadow position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
            <meshStandardMaterial color="#3e2723" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.72, 16]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.04, 24]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} />
          </mesh>
        </group>

        {/* 2 Scandinavian Curved Bentwood Chairs */}
        {[-0.75, 0.75].map((cx, idx) => (
          <group key={idx} position={[cx, 0, 0]} rotation={[0, (idx === 0 ? 1.57 : -1.57), 0]}>
            {/* Padded Leather Seat Cushion */}
            <mesh castShadow position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
              <meshStandardMaterial color="#78350f" roughness={0.5} />
            </mesh>
            {/* Curved Backrest */}
            <mesh position={[0, 0.72, -0.2]}>
              <boxGeometry args={[0.42, 0.16, 0.03]} />
              <meshStandardMaterial color="#2d1b11" roughness={0.5} />
            </mesh>
            {/* 4 Tapered Brass-Tipped Legs */}
            {[-0.16, 0.16].map((lx, lIdx) =>
              [-0.16, 0.16].map((lz, zIdx) => (
                <mesh key={`${lIdx}-${zIdx}`} position={[lx, 0.22, lz]} rotation={[0.08, 0, 0.08]}>
                  <cylinderGeometry args={[0.014, 0.01, 0.44, 12]} />
                  <meshStandardMaterial color="#18181b" metalness={0.7} />
                </mesh>
              ))
            )}
          </group>
        ))}
      </group>

      {/* ================= 8. ARCHITECTURAL BOTANICAL: FIDDLE-LEAF FIG TREE ================= */}
      <group position={[-5.2, 0, -2.8]}>
        {/* Modern Fluted Ceramic Planter */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.36, 0.26, 1.0, 24]} />
          <meshStandardMaterial color="#fafaf9" roughness={0.25} />
        </mesh>
        {/* Dark Potting Soil */}
        <mesh position={[0, 0.98, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 20]} />
          <meshStandardMaterial color="#291e17" roughness={0.9} />
        </mesh>

        {/* Natural Wooden Trunk */}
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 0.95, 12]} />
          <meshStandardMaterial color="#422e20" roughness={0.9} />
        </mesh>

        {/* Sculpted Organic Multi-Tiered Broad Leaves */}
        {[
          { y: 1.5, rot: 0.2, scale: 0.32 },
          { y: 1.7, rot: 1.3, scale: 0.38 },
          { y: 1.9, rot: 2.5, scale: 0.42 },
          { y: 2.1, rot: 3.7, scale: 0.36 },
          { y: 2.3, rot: 4.8, scale: 0.3 },
        ].map((leaf, idx) => (
          <group key={idx} position={[0, leaf.y, 0]} rotation={[0.25, leaf.rot, 0.3]}>
            <mesh position={[0.2, 0, 0]}>
              <sphereGeometry args={[leaf.scale, 12, 12]} />
              <meshStandardMaterial
                color="#15803d"
                roughness={0.4}
                metalness={0.05}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
