"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  scale?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  glowColor = "rgba(0, 117, 74, 0.25)",
  maxTilt = 12,
  scale = 1.02,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const xPercent = (clientX / rect.width) * 100;
      const yPercent = (clientY / rect.height) * 100;

      const rotateY = ((clientX / rect.width) - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - (clientY / rect.height)) * (maxTilt * 2);

      setTransform(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`
      );

      setGlarePosition({
        x: xPercent,
        y: yPercent,
        opacity: 0.65,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease",
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative group rounded-3xl overflow-hidden cursor-pointer",
        "backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Dynamic Specular Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.2), transparent 80%)`,
        }}
      />

      {/* Ambient Glow Accent */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-0"
        style={{ background: glowColor }}
      />

      {/* Card Content with 3D depth */}
      <div className="relative z-10 h-full w-full" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </div>
  );
};
