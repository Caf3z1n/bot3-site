"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

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
    let waves: PriceWave[] = [];
    let candles: Candle[] = [];
    let chips: DataChip[] = [];
    let markers: TradeMarker[] = [];
    let tickers: Ticker[] = [];
    let tick = 0;

    const isDark = resolvedTheme === "dark";
    const palette = {
      gradient: isDark ? ["#030712", "#0b1028", "#1b1f3a"] : ["#f8fafc", "#f8fafc", "#f8fafc"],
      nebula: isDark
        ? ["rgba(124, 58, 237, 0.35)", "rgba(59, 130, 246, 0.25)", "rgba(94, 234, 212, 0.2)"]
        : [],
      stars: isDark ? ["#ffffff", "#c7d2fe", "#99f6e4"] : [],
      comet: isDark ? "#c084fc" : "#22c55e",
      lines: isDark ? [] : ["#0ea5e9", "#22c55e", "#6366f1"],
      grid: isDark ? [] : [],
      highlight: isDark ? null : null,
      candles: isDark ? [] : [],
      chips: isDark ? [] : [],
      ticker: isDark ? [] : [],
    };

    const resizeCanvas = () => {
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
        waves = [];
        candles = [];
        chips = [];
        markers = [];
        tickers = [];
      }
    };

    class Star {
      x: number;
      y: number;
      depth: number;
      color: string;
      radius: number;
      speed: number;
      twinkle: number;

      constructor() {
        this.depth = Math.random() * 1.1 + 0.2;
        this.radius = this.depth * (Math.random() * 1.2 + 0.4);
        this.speed = 0.45 + this.depth * 1.2;
        this.x = Math.random() * canvas.clientWidth;
        this.y = Math.random() * canvas.clientHeight;
        const colors = palette.stars.length ? palette.stars : ["#ffffff"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.twinkle = Math.random() * Math.PI * 2;
      }

      update() {
        const wind = Math.sin(tick * 0.002) * 0.6;
        this.y += this.speed;
        this.x += wind * this.depth;
        if (this.y > canvas.clientHeight + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.clientWidth;
          this.depth = Math.random() * 1.1 + 0.2;
          this.speed = 0.45 + this.depth * 1.2;
        }
        this.twinkle += 0.02;
      }

      draw() {
        if (!ctx) return;

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

      constructor() {
        this.x = Math.random() * canvas.clientWidth;
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

      draw() {
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, palette.comet);
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

      isAlive(width: number, height: number) {
        return this.life > 0 && this.x > -this.length && this.y < height + this.length;
      }
    }

    class PriceWave {
      amplitude: number;
      freq: number;
      speed: number;
      phase: number;
      yOffset: number;
      width: number;
      color: string;
      thickness: number;

      constructor(index: number) {
        this.width = canvas.clientWidth;
        this.amplitude = 24 + Math.random() * 18;
        this.freq = 0.006 + Math.random() * 0.004;
        this.speed = 0.005 + index * 0.0015;
        this.phase = Math.random() * Math.PI * 2;
        this.yOffset = canvas.clientHeight * (0.22 + index * 0.18);
        const lineColors = palette.lines.length ? palette.lines : ["#0ea5e9"];
        this.color = lineColors[index % lineColors.length];
        this.thickness = 1.5 + index * 0.3;
      }

      update() {
        this.phase += this.speed;
      }

      draw() {
        ctx.save();
        const gradient = ctx.createLinearGradient(0, 0, canvas.clientWidth, 0);
        gradient.addColorStop(0, `${this.color}88`);
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, `${this.color}88`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();

        for (let x = 0; x <= this.width; x += 8) {
          const y =
            this.yOffset +
            Math.sin(x * this.freq + this.phase) * this.amplitude +
            Math.sin(x * 0.015 + this.phase * 1.4) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
      }

      yAt(x: number) {
        return (
          this.yOffset +
          Math.sin(x * this.freq + this.phase) * this.amplitude +
          Math.sin(x * 0.015 + this.phase * 1.4) * 6
        );
      }
    }

    class Candle {
      x: number;
      y: number;
      bodyH: number;
      wickH: number;
      width: number;
      bullish: boolean;
      drift: number;
      color: string;
      constructor() {
        this.width = 6 + Math.random() * 6;
        this.bodyH = 24 + Math.random() * 90;
        this.wickH = this.bodyH * (0.6 + Math.random() * 0.6);
        this.x = Math.random() * canvas.clientWidth;
        this.y = canvas.clientHeight * (0.5 + Math.random() * 0.35);
        this.bullish = Math.random() > 0.32;
        const colors = palette.candles.length ? palette.candles : ["#22c55e"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.drift = -0.35 - Math.random() * 0.45;
      }

      reset() {
        this.bodyH = 24 + Math.random() * 90;
        this.wickH = this.bodyH * (0.6 + Math.random() * 0.6);
        this.x = Math.random() * canvas.clientWidth;
        this.y = canvas.clientHeight * (0.65 + Math.random() * 0.25);
        this.bullish = Math.random() > 0.32;
      }

      update() {
        this.y += this.drift * 0.6;
        this.x += Math.sin(tick * 0.002 + this.y * 0.01) * 0.1;
        if (this.y < canvas.clientHeight * 0.18) {
          this.reset();
        }
      }

      draw() {
        const bodyTop = this.y - this.bodyH;
        const wickTop = this.y - this.bodyH - this.wickH;
        const alpha = 0.82;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `${this.color}${this.bullish ? "cc" : "88"}`;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 2);
        ctx.lineTo(this.x, wickTop);
        ctx.stroke();

        const grad = ctx.createLinearGradient(this.x, bodyTop, this.x, this.y);
        grad.addColorStop(0, `${this.color}dd`);
        grad.addColorStop(1, `${this.color}88`);
        ctx.fillStyle = grad;
        const half = this.width / 2;
        ctx.fillRect(this.x - half, bodyTop, this.width, this.bodyH);
        ctx.restore();
      }
    }

    class DataChip {
      x: number;
      y: number;
      w: number;
      h: number;
      speedX: number;
      bob: number;
      color: string;
      alpha: number;

      constructor() {
        this.w = 52 + Math.random() * 32;
        this.h = 14 + Math.random() * 8;
        this.x = Math.random() * canvas.clientWidth;
        this.y = canvas.clientHeight * (0.2 + Math.random() * 0.55);
        this.speedX = -0.3 - Math.random() * 0.35;
        this.bob = Math.random() * Math.PI * 2;
        const colors = palette.chips.length ? palette.chips : ["rgba(14,165,233,0.12)"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.6 + Math.random() * 0.3;
      }

      update() {
        this.x += this.speedX;
        this.bob += 0.015;
        this.y += Math.sin(this.bob) * 0.12;
        if (this.x < -this.w) {
          this.x = canvas.clientWidth + this.w;
          this.y = canvas.clientHeight * (0.2 + Math.random() * 0.55);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        const r = this.h / 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.w / 2 + r, this.y - r);
        ctx.lineTo(this.x + this.w / 2 - r, this.y - r);
        ctx.quadraticCurveTo(this.x + this.w / 2, this.y - r, this.x + this.w / 2, this.y);
        ctx.lineTo(this.x + this.w / 2, this.y + r);
        ctx.quadraticCurveTo(this.x + this.w / 2, this.y + r, this.x + this.w / 2 - r, this.y + r);
        ctx.lineTo(this.x - this.w / 2 + r, this.y + r);
        ctx.quadraticCurveTo(this.x - this.w / 2, this.y + r, this.x - this.w / 2, this.y);
        ctx.lineTo(this.x - this.w / 2, this.y - r);
        ctx.quadraticCurveTo(this.x - this.w / 2, this.y - r, this.x - this.w / 2 + r, this.y - r);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    class TradeMarker {
      wave: PriceWave;
      x: number;
      speed: number;
      color: string;
      alpha: number;

      constructor(wave: PriceWave, color: string) {
        this.wave = wave;
        this.speed = 0.6 + Math.random() * 0.5;
        this.alpha = 0.5 + Math.random() * 0.4;
        this.color = color;
        this.x = Math.random() * canvas.clientWidth;
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.clientWidth + 10) {
          this.x = -10;
        }
      }

      draw() {
        const y = this.wave.yAt(this.x);
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const grad = ctx.createRadialGradient(this.x, y, 1, this.x, y, 14);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, `${this.color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Ticker {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      color: string;
      alpha: number;

      constructor() {
        this.w = 70 + Math.random() * 60;
        this.h = 12 + Math.random() * 6;
        this.x = Math.random() * canvas.clientWidth;
        this.y = 24 + Math.random() * 40;
        this.speed = -0.8 - Math.random() * 0.6;
        const colors = palette.ticker.length ? palette.ticker : ["#0ea5e9"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.45 + Math.random() * 0.35;
      }

      update() {
        this.x += this.speed;
        if (this.x < -this.w) {
          this.x = canvas.clientWidth + this.w;
          this.y = 24 + Math.random() * 40;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        const r = this.h / 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.w / 2 + r, this.y - r);
        ctx.lineTo(this.x + this.w / 2 - r, this.y - r);
        ctx.quadraticCurveTo(this.x + this.w / 2, this.y - r, this.x + this.w / 2, this.y);
        ctx.lineTo(this.x + this.w / 2, this.y + r);
        ctx.quadraticCurveTo(this.x + this.w / 2, this.y + r, this.x + this.w / 2 - r, this.y + r);
        ctx.lineTo(this.x - this.w / 2 + r, this.y + r);
        ctx.quadraticCurveTo(this.x - this.w / 2, this.y + r, this.x - this.w / 2, this.y);
        ctx.lineTo(this.x - this.w / 2, this.y - r);
        ctx.quadraticCurveTo(this.x - this.w / 2, this.y - r, this.x - this.w / 2 + r, this.y - r);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const initStars = () => {
      stars = [];
      const starCount = Math.min(
        700,
        Math.max(280, Math.floor((canvas.clientWidth * canvas.clientHeight) / 3500))
      );
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const initWaves = () => {
      waves = [];
      for (let i = 0; i < 3; i++) {
        waves.push(new PriceWave(i));
      }
    };

    const initCandles = () => {
      candles = [];
      const count = Math.max(18, Math.floor(canvas.clientWidth / 60));
      for (let i = 0; i < count; i++) {
        candles.push(new Candle());
      }
    };

    const initChips = () => {
      chips = [];
      const count = Math.max(22, Math.floor(canvas.clientWidth / 65));
      for (let i = 0; i < count; i++) {
        chips.push(new DataChip());
      }
    };

    const initMarkers = () => {
      markers = [];
      if (!waves.length) return;
      const colors = palette.lines.length ? palette.lines : ["#22c55e"];
      waves.forEach((wave, idx) => {
        const markerCount = 8 + idx * 4;
        for (let i = 0; i < markerCount; i++) {
          markers.push(new TradeMarker(wave, colors[idx % colors.length]));
        }
      });
    };

    const initTickers = () => {
      tickers = [];
      const count = Math.max(12, Math.floor(canvas.clientWidth / 90));
      for (let i = 0; i < count; i++) {
        tickers.push(new Ticker());
      }
    };

    const drawSky = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      palette.gradient.forEach((color, index) => {
        gradient.addColorStop(index / (palette.gradient.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    const drawNebulae = (time: number) => {
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
    };

    const drawGrid = (time: number) => {
      if (!palette.grid.length) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.save();
      const spacing = 120;
      const offset = (time * 0.8) % spacing;
      const skew = 0.28;
      ctx.lineWidth = 1;

      ctx.strokeStyle = palette.grid[0];
      for (let x = -spacing; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset + skew * h, h);
        ctx.stroke();
      }

      ctx.strokeStyle = palette.grid[1] || palette.grid[0];
      for (let x = -spacing; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x - skew * h, 0);
        ctx.lineTo(x + offset, h);
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      tick += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      drawSky();

      if (!isDark) {
        return;
      }

      drawNebulae(tick);

      if (!ctx || !canvas) return;
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      if (shootingStars.length < 2 && Math.random() > 0.992) {
        shootingStars.push(new ShootingStar());
      }

      shootingStars = shootingStars.filter((s) => s.isAlive(w, h));
      shootingStars.forEach((s) => {
        s.update();
        s.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]); // Re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full transition-colors duration-700"
    />
  );
}
