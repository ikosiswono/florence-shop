"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, RotateCw, Sparkles, Shirt } from "lucide-react";

interface MinecraftSkinViewerProps {
  skinUrl?: string | null;
  gamertag: string;
  className?: string;
  height?: number;
}

export default function MinecraftSkinViewer({
  skinUrl,
  gamertag,
  className = "",
  height = 360,
}: MinecraftSkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWalking, setIsWalking] = useState(true);
  const [skinLoaded, setSkinLoaded] = useState(false);
  const [rotation, setRotation] = useState(0); // in degrees: -45 to 45
  const [isHovered, setIsHovered] = useState(false);

  // Fallback direct fullbody render from mc-heads.net if no canvas custom skin
  const fallbackFullbody = `https://mc-heads.net/body/${encodeURIComponent(gamertag || "Steve")}/right`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Load skin image
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = skinUrl || `https://mc-heads.net/skin/${encodeURIComponent(gamertag || "Steve")}`;

    let animId: number;
    let startTime = performance.now();

    img.onload = () => {
      setSkinLoaded(true);

      const render = (now: number) => {
        const elapsed = now - startTime;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Detect 64x64 or 128x128
        const s = img.width >= 128 ? 2 : 1; // scale factor inside texture

        // Walking cycle parameters
        const walkSpeed = 0.0055;
        const maxSwing = isWalking ? 0.55 : 0;
        const legSwing = Math.sin(elapsed * walkSpeed) * maxSwing;
        const armSwing = Math.sin(elapsed * walkSpeed) * maxSwing;
        const bodyBob = isWalking ? Math.abs(Math.sin(elapsed * walkSpeed * 2)) * 3 : 0;

        ctx.save();
        ctx.translate(w / 2, h / 2 + 10);
        ctx.scale(3.5, 3.5); // Minecraft scale

        // Soft shadow underneath
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.ellipse(0, 48, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 1. LEFT LEG (Swinging backward when right is forward)
        ctx.save();
        ctx.translate(2, 20 + bodyBob);
        ctx.rotate(-legSwing);
        // Source in texture: (0, 16, 4, 12) or modern (16, 48, 4, 12)
        const leftLegX = img.height >= 64 * s ? 16 * s : 0;
        const leftLegY = img.height >= 64 * s ? 48 * s : 16 * s;
        ctx.drawImage(img, leftLegX + 4 * s, leftLegY + 4 * s, 4 * s, 12 * s, -2, 0, 4, 12);
        ctx.restore();

        // 2. RIGHT LEG
        ctx.save();
        ctx.translate(-2, 20 + bodyBob);
        ctx.rotate(legSwing);
        // Texture: (0, 16, 4, 12)
        ctx.drawImage(img, 4 * s, 20 * s, 4 * s, 12 * s, -2, 0, 4, 12);
        ctx.restore();

        // 3. TORSO (Body)
        ctx.save();
        ctx.translate(0, 8 + bodyBob);
        // Front Torso: (20, 20, 8, 12)
        ctx.drawImage(img, 20 * s, 20 * s, 8 * s, 12 * s, -4, 0, 8, 12);
        // Torso jacket overlay if 64x64 / 128x128
        if (img.height >= 64 * s) {
          ctx.drawImage(img, 20 * s, 36 * s, 8 * s, 12 * s, -4.2, -0.2, 8.4, 12.4);
        }
        ctx.restore();

        // 4. LEFT ARM (Swinging forward when right leg is forward)
        ctx.save();
        ctx.translate(6, 8 + bodyBob);
        ctx.rotate(armSwing);
        // Left arm texture: (32, 48, 4, 12) or modern (32, 48)
        const leftArmX = img.height >= 64 * s ? 32 * s : 40 * s;
        const leftArmY = img.height >= 64 * s ? 48 * s : 16 * s;
        ctx.drawImage(img, leftArmX + 4 * s, leftArmY + 4 * s, 4 * s, 12 * s, -2, 0, 4, 12);
        ctx.restore();

        // 5. RIGHT ARM (Swinging backward)
        ctx.save();
        ctx.translate(-6, 8 + bodyBob);
        ctx.rotate(-armSwing);
        // Right arm texture: (40, 16, 4, 12) -> front face is at (44, 20, 4, 12)
        ctx.drawImage(img, 44 * s, 20 * s, 4 * s, 12 * s, -2, 0, 4, 12);
        ctx.restore();

        // 6. HEAD (With slight bobbing)
        ctx.save();
        ctx.translate(0, bodyBob);
        // Head Face: (8, 8, 8, 8)
        ctx.drawImage(img, 8 * s, 8 * s, 8 * s, 8 * s, -4, 0, 8, 8);
        // Hat / Helmet overlay: (40, 8, 8, 8)
        ctx.drawImage(img, 40 * s, 8 * s, 8 * s, 8 * s, -4.4, -0.4, 8.8, 8.8);
        ctx.restore();

        ctx.restore();

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    };

    img.onerror = () => {
      setSkinLoaded(false);
    };

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [skinUrl, gamertag, isWalking]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      
      {/* Visual Canvas Container */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1526]/80 to-[#040c18] border border-cyan-400/30 p-2 flex items-center justify-center shadow-inner group"
        style={{ minHeight: `${height}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Atmosphere back-glow */}
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Dynamic HTML5 Canvas with Animated Minecraft Walk Cycle */}
        <canvas
          ref={canvasRef}
          width={220}
          height={280}
          className="relative z-10 image-rendering-pixelated cursor-pointer select-none"
          onClick={() => setIsWalking(!isWalking)}
          title="Klik avatar untuk jeda/lanjutkan animasi berjalan"
        />

        {/* Fallback Static if Canvas Image Fails */}
        {!skinLoaded && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-36 h-64">
              <Image
                src={fallbackFullbody}
                alt={gamertag}
                fill
                className="object-contain image-rendering-pixelated drop-shadow-2xl"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Walking State Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${isWalking ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
          <span>{isWalking ? "Animasi Berjalan" : "Pose Diam"}</span>
        </div>

        {/* Skin Format Badge */}
        <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[9px] font-mono text-slate-400 backdrop-blur-md">
          {skinUrl ? "Custom Bedrock Skin" : "Bedrock IGN Skin"}
        </div>

        {/* Controls Overlay on Bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 bg-slate-950/80 border border-slate-800 backdrop-blur-md rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => setIsWalking(!isWalking)}
            className="flex-1 py-1 px-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {isWalking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isWalking ? "Jeda Gerak" : "Mulai Jalan"}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
