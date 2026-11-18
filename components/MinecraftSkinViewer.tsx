"use client";

import React, { useEffect, useRef } from "react";

interface MinecraftSkinViewerProps {
  skinUrl?: string | null;
  gamertag: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function MinecraftSkinViewer({
  skinUrl,
  gamertag,
  width = 240,
  height = 310,
  className = "",
}: MinecraftSkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let viewerInstance: any = null;

    async function initViewer() {
      if (!canvasRef.current || !isMounted) return;

      try {
        const { SkinViewer, WalkingAnimation } = await import("skinview3d");
        if (!isMounted || !canvasRef.current) return;

        // Determine skin source: custom uploaded skin, or official gamertag skin
        const skinSource =
          skinUrl ||
          (gamertag?.trim()
            ? `https://mc-heads.net/skin/${encodeURIComponent(gamertag.trim())}`
            : "https://mc-heads.net/skin/Steve");

        // Initialize SkinViewer with transparent background
        const viewer = new SkinViewer({
          canvas: canvasRef.current,
          width: width,
          height: height,
          skin: skinSource,
        });

        viewerInstance = viewer;
        viewerRef.current = viewer;

        // Ensure 100% transparent background so it seamlessly blends into hero card
        viewer.background = null;

        // OrbitControls: Full 360-degree rotation like Nova Skin
        if (viewer.controls) {
          viewer.controls.enableRotate = true;
          viewer.controls.enableZoom = false; // Prevent accidental page scroll interception
          viewer.controls.enablePan = false;
          viewer.controls.rotateSpeed = 0.85;
        }

        // Slow, continuous natural walking animation (no buttons, always walking)
        const walking = new WalkingAnimation();
        walking.speed = 0.45; // Slow, majestic walk
        walking.headBobbing = true;
        viewer.animation = walking;

        // Set natural 3D angle (3/4 angle facing user)
        viewer.adjustCameraDistance();
        viewer.playerObject.rotation.y = -0.45;
        viewer.camera.position.y = 0;
      } catch (err) {
        console.warn("Notice: 3D skin viewer initialization:", err);
      }
    }

    initViewer();

    return () => {
      isMounted = false;
      if (viewerInstance) {
        try {
          viewerInstance.dispose();
        } catch (e) {
          // ignore cleanup errors
        }
      }
      viewerRef.current = null;
    };
  }, [width, height]);

  // Update skin dynamically if user uploads a new skin or changes gamertag
  useEffect(() => {
    if (!viewerRef.current) return;
    const skinSource =
      skinUrl ||
      (gamertag?.trim()
        ? `https://mc-heads.net/skin/${encodeURIComponent(gamertag.trim())}`
        : "https://mc-heads.net/skin/Steve");

    try {
      viewerRef.current.loadSkin(skinSource, { model: "auto-detect" });
    } catch (err) {
      console.warn("Notice: Error reloading skin texture:", err);
    }
  }, [skinUrl, gamertag]);

  return (
    <div
      className={`relative flex items-center justify-center bg-transparent select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Three.js / WebGL 3D Canvas - Transparent, rotatable with mouse like Nova Skin */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full bg-transparent outline-none cursor-grab active:cursor-grabbing touch-none"
        title="Geser untuk memutar karakter 360°"
      />
    </div>
  );
}
