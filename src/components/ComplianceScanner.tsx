"use client";

import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  part: string;
}

interface Hotspot3D {
  id: string;
  x: number;
  y: number;
  z: number;
  label: string;
}

interface ComplianceScannerProps {
  activePart: string;
  onPartSelect: (part: string) => void;
}

export default function ComplianceScanner({ activePart, onPartSelect }: ComplianceScannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // Generate 3D particle points for the worker body
  const pointsRef = useRef<Point3D[]>([]);
  const hotspotsRef = useRef<Hotspot3D[]>([
    { id: "helmet", x: 0, y: -110, z: 0, label: "Safety Helmet (SOP 2.1)" },
    { id: "goggles", x: 0, y: -90, z: 12, label: "Goggles (SOP 12.1)" },
    { id: "vest", x: 0, y: -10, z: 18, label: "Reflective Vest (SOP 4.3)" },
    { id: "boots", x: 0, y: 110, z: 0, label: "Insulated Boots (SOP 12.1)" }
  ]);

  if (pointsRef.current.length === 0) {
    const pts: Point3D[] = [];

    // 1. HELMET (Orange dome at top)
    for (let r = 0; r <= 35; r += 6) {
      for (let theta = 0; theta < Math.PI * 2; theta += 0.3) {
        const phi = (r / 35) * (Math.PI / 2);
        pts.push({
          x: 35 * Math.sin(phi) * Math.cos(theta),
          y: -120 - 20 * Math.cos(phi),
          z: 35 * Math.sin(phi) * Math.sin(theta),
          color: "#FF5722",
          size: 1.5,
          part: "helmet"
        });
      }
    }

    // 2. FACE & GOGGLES (Head sphere + blue visor line)
    for (let phi = 0.2; phi < Math.PI - 0.2; phi += 0.3) {
      for (let theta = 0; theta < Math.PI * 2; theta += 0.4) {
        const isGoggles = phi > 1.0 && phi < 1.3 && Math.sin(theta) > 0;
        pts.push({
          x: 25 * Math.sin(phi) * Math.cos(theta),
          y: -85 + 25 * Math.cos(phi),
          z: 25 * Math.sin(phi) * Math.sin(theta),
          color: isGoggles ? "#00E5FF" : "#8A857C",
          size: isGoggles ? 2 : 1,
          part: isGoggles ? "goggles" : "head"
        });
      }
    }

    // 3. TORSO & SAFETY VEST (Neon green cylinder with reflective stripes)
    for (let y = -50; y <= 50; y += 8) {
      const radius = 42 - (y * y) / 400; // slightly tapered torso
      for (let theta = 0; theta < Math.PI * 2; theta += 0.25) {
        const isReflective = (y > -35 && y < -25) || (y > 15 && y < 25);
        const isVest = theta < Math.PI * 1.8; // front split
        pts.push({
          x: radius * Math.cos(theta),
          y: y,
          z: radius * Math.sin(theta),
          color: isReflective ? "#FFFFFF" : isVest ? "#CCFF00" : "#2E2B26",
          size: isReflective ? 1.8 : 1.2,
          part: "vest"
        });
      }
    }

    // 4. LEGS (Two cylinders)
    for (let y = 55; y <= 110; y += 10) {
      for (let theta = 0; theta < Math.PI * 2; theta += 0.5) {
        // Left Leg
        pts.push({
          x: -16 + 10 * Math.cos(theta),
          y: y,
          z: 10 * Math.sin(theta),
          color: "#2E2B26",
          size: 1,
          part: "pants"
        });
        // Right Leg
        pts.push({
          x: 16 + 10 * Math.cos(theta),
          y: y,
          z: 10 * Math.sin(theta),
          color: "#2E2B26",
          size: 1,
          part: "pants"
        });
      }
    }

    // 5. BOOTS (Grey blocks at bottom)
    for (let y = 110; y <= 125; y += 6) {
      for (let xOffset of [-16, 16]) {
        for (let z = -12; z <= 20; z += 5) {
          pts.push({
            x: xOffset + (z > 0 ? 11 : 9) * Math.sin(z),
            y: y,
            z: z,
            color: "#4A453F",
            size: 1.5,
            part: "boots"
          });
        }
      }
    }

    pointsRef.current = pts;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let localAngle = 0;

    const render = () => {
      // Slow automatic rotation when cursor is not hovering
      if (!isHoveredRef.current) {
        localAngle += 0.008;
      } else {
        // Swing slightly towards cursor position
        const deltaX = (mousePosRef.current.x - canvas.width / 2) / canvas.width;
        localAngle += deltaX * 0.04;
      }
      setRotationAngle(localAngle);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0C0B0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cos = Math.cos(localAngle);
      const sin = Math.sin(localAngle);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 10;
      const perspective = 350;
      const distance = 250;

      // Draw scanner background radar grid lines
      ctx.strokeStyle = "rgba(255, 87, 34, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 40; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Holographic circular grid floor
      ctx.strokeStyle = "rgba(255, 87, 34, 0.1)";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 125, 70, 20, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Sort points back-to-front for proper depth occlusion rendering
      const projectedPoints = pointsRef.current.map(p => {
        // Rotate points
        const rx = p.x * cos - p.z * sin;
        const rz = p.x * sin + p.z * cos;
        
        // Perspective projection
        const scale = perspective / (perspective + rz + distance);
        const px = centerX + rx * scale * 1.8;
        const py = centerY + p.y * scale * 1.8;

        return { px, py, rz, color: p.color, size: p.size * scale, part: p.part };
      }).sort((a, b) => b.rz - a.rz);

      // Render 3D points
      projectedPoints.forEach(p => {
        // Make active part glow
        const isActive = p.part === activePart;
        ctx.fillStyle = isActive ? "#FFFFFF" : p.color;
        
        // Depth-based transparency
        const opacity = Math.min(1, Math.max(0.15, (perspective - p.rz) / perspective));
        ctx.globalAlpha = isActive ? 1.0 : opacity * 0.7;

        ctx.beginPath();
        ctx.arc(p.px, p.py, isActive ? p.size * 1.6 : p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;

      // Draw projected interactive 3D Hotspots
      hotspotsRef.current.forEach(h => {
        const rx = h.x * cos - h.z * sin;
        const rz = h.x * sin + h.z * cos;

        // Front hemisphere check (only render hotspots when facing frontwards)
        if (rz > -50) {
          const scale = perspective / (perspective + rz + distance);
          const px = centerX + rx * scale * 1.8;
          const py = centerY + h.y * scale * 1.8;

          const isSelected = h.id === activePart;

          // Render blinking hotspot halo
          ctx.strokeStyle = isSelected ? "#FFFFFF" : "var(--orange)";
          ctx.lineWidth = isSelected ? 2 : 1;
          
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 9 : 6, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = isSelected ? "#FFFFFF" : "var(--orange)";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();

          // Connect text label pointers
          if (isSelected) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 40, py - 20);
            ctx.lineTo(px + 90, py - 20);
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 9px monospace";
            ctx.fillText("ACTIVE", px + 44, py - 24);
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [activePart]);

  // Click handler to select compliance parts on Canvas coordinate collision
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cos = Math.cos(rotationAngle);
    const sin = Math.sin(rotationAngle);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;
    const perspective = 350;
    const distance = 250;

    let bestMatch = "";
    let minDist = 24; // hotspot click padding radius

    hotspotsRef.current.forEach(h => {
      const rx = h.x * cos - h.z * sin;
      const rz = h.x * sin + h.z * cos;

      if (rz > -50) {
        const scale = perspective / (perspective + rz + distance);
        const px = centerX + rx * scale * 1.8;
        const py = centerY + h.y * scale * 1.8;

        const dist = Math.hypot(px - mx, py - my);
        if (dist < minDist) {
          minDist = dist;
          bestMatch = h.id;
        }
      }
    });

    if (bestMatch) {
      onPartSelect(bestMatch);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isHoveredRef.current = true;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={400}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        style={{
          background: "#0C0B0A",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          cursor: "pointer",
          boxShadow: "inset 0 0 40px rgba(255, 87, 34, 0.05)"
        }}
      />
      <div style={{ fontSize: "10px", color: "var(--muted2)", textTransform: "uppercase", marginTop: "8px", letterSpacing: "1px" }}>
        ← Hover to inspect · Click hotspots to sync →
      </div>
    </div>
  );
}
