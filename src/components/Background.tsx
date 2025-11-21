"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type Palette = {
  gradient: string[];
  nebula: string[];
  stars: string[];
  comet: string;
};

class Star {
  x: number;
  y: number;
  depth: number;
  color: string;
  radius: number;
  speed: number;
  twinkle: number;
  private canvas: HTMLCanvasElement;
  private palette: Palette;

  constructor(canvas: HTMLCanvasElement, palette: Palette) {
    this.canvas = canvas;
    this.palette = palette;
    this.depth = Math.random() * 1.1 + 0.2;
    this.radius = this.depth * (Math.random() * 1.2 + 0.4);
    this.speed = 0.45 + this.depth * 1.2;
    this.x = Math.random() * this.canvas.clientWidth;
    this.y = Math.random() * this.canvas.clientHeight;
    const colors = this.palette.stars.length ? this.palette.stars : ["#ffffff"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.twinkle = Math.random() * Math.PI * 2;
  }

  private reset() {
    this.depth = Math.random() * 1.1 + 0.2;
    this.speed = 0.45 + this.depth * 1.2;
    this.x = Math.random() * this.canvas.clientWidth;
    this.y = -20;
  }

  update(tick: number) {
    const wind = Math.sin(tick * 0.002) * 0.6;
    this.y += this.speed;
    this.x += wind * this.depth;
    if (this.y > this.canvas.clientHeight + 20) {
      this.reset();
    }
    this.twinkle += 0.02;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.globalAlpha = 0.55 + Math.sin(this.twinkle) * 0.3;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  life: number;
  angle: number;
  private canvas: HTMLCanvasElement;
  private palette: Palette;

  constructor(canvas: HTMLCanvasElement, palette: Palette) {
    this.canvas = canvas;
    this.palette = palette;
    this.x = Math.random() * this.canvas.clientWidth;
    this.y = -60 - Math.random() * 120;
    this.length = 160 + Math.random() * 140;
    this.speed = 6.5 + Math.random() * 3;
    this.life = 1.2;
    this.angle = (Math.PI / 180) * (95 + Math.random() * 20);
  }

  update() {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.life -= 0.009;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const tailX = this.x - Math.cos(this.angle) * this.length;
    const tailY = this.y - Math.sin(this.angle) * this.length;
    const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    gradient.addColorStop(0, this.palette.comet);
    gradient.addColorStop(1, "transparent");

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
    ctx.restore();
  }

  isAlive() {
    return (
      this.life > 0 &&
      this.x > -this.length &&
      this.y < this.canvas.clientHeight + this.length
    );
  }
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let tick = 0;

    const isDark = resolvedTheme === "dark";
    const palette: Palette = {
      gradient: isDark ? ["#030712", "#0b1028", "#1b1f3a"] : ["#f8fafc", "#f8fafc", "#f8fafc"],
      nebula: isDark
        ? ["rgba(124, 58, 237, 0.35)", "rgba(59, 130, 246, 0.25)", "rgba(94, 234, 212, 0.2)"]
        : [],
      stars: isDark ? ["#ffffff", "#c7d2fe", "#99f6e4"] : [],
      comet: isDark ? "#c084fc" : "#22c55e",
    };

    function initStars() {
      const starCount = Math.min(
        700,
        Math.max(280, Math.floor((canvas.clientWidth * canvas.clientHeight) / 3500))
      );
      stars = Array.from({ length: starCount }, () => new Star(canvas, palette));
      shootingStars = [];
    }

    function drawSky() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      palette.gradient.forEach((color, index) => {
        gradient.addColorStop(index / (palette.gradient.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    function drawNebulae(time: number) {
      if (!palette.nebula.length) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const blobs = [
        { x: w * 0.22, y: h * 0.32, r: 360, pulse: 0.02 },
        { x: w * 0.78, y: h * 0.68, r: 480, pulse: 0.025 },
        { x: w * 0.55, y: h * 0.18, r: 300, pulse: 0.03 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      blobs.forEach((blob, index) => {
        const scale = 1 + Math.sin(time * blob.pulse + index) * 0.05;
        ctx.globalAlpha = 0.12;
        ctx.filter = "blur(90px)";
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = palette.nebula[index % palette.nebula.length];
        ctx.fill();
      });
      ctx.restore();
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      if (isDark) {
        initStars();
      } else {
        stars = [];
        shootingStars = [];
        drawSky();
      }
    }

    function animate() {
      tick += 1;
      drawSky();

      if (!isDark) {
        return;
      }

      drawNebulae(tick);

      stars.forEach((star) => {
        star.update(tick);
        star.draw(ctx);
      });

      if (shootingStars.length < 2 && Math.random() > 0.992) {
        shootingStars.push(new ShootingStar(canvas, palette));
      }

      shootingStars = shootingStars.filter((s) => s.isAlive());
      shootingStars.forEach((s) => {
        s.update();
        s.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full transition-colors duration-700"
    />
  );
}
