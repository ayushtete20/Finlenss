import React, { useEffect, useRef } from 'react';

import React, { useEffect, useRef } from 'react';

export const FinancialCanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Static horizontal reference lines across canvas (mimic CHART workspace)
    const gridLinesCount = 5;
    const gridLines = Array.from({ length: gridLinesCount }, (_, i) => 0.15 + (i * 0.7) / (gridLinesCount - 1));

    // Generate Candlesticks across 3 z-layers ('fg', 'mg', 'bg')
    const candleCount = Math.min(40, Math.floor(width / 35));
    const candles = [];

    for (let i = 0; i < candleCount; i++) {
      const x = (i + 0.5) * (width / candleCount);
      const layerIndex = i % 3;
      const layer = layerIndex === 0 ? 'fg' : layerIndex === 1 ? 'mg' : 'bg';
      const baseHeight = 40 + Math.random() * 110;

      // Candlesticks colors: Warm amber and glowing gold
      const candleColors = ['#F59E0B', '#EAB308', '#D97706'];
      const color = candleColors[Math.floor(Math.random() * candleColors.length)];

      candles.push({
        x,
        y: height * 0.52 + (Math.random() - 0.5) * 140,
        width: layer === 'fg' ? 14 : layer === 'mg' ? 9 : 5,
        height: baseHeight,
        wickTop: 20 + Math.random() * 40,
        wickBottom: 20 + Math.random() * 40,
        layer,
        color,
        opacity: layer === 'fg' ? 0.95 : layer === 'mg' ? 0.55 : 0.22,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012
      });
    }

    // Floating Financial Metrics (drifting near wicks and peaks)
    const metrics = [];
    const metricValues = ['1.234', '45.6', '0.98', '184.20', '3.141', '99.4', '0.045', '12.45', '78.9'];
    const metricColors = ['#2DD4BF', '#34D399', '#4ADE80'];

    const spawnMetric = (m = {}) => {
      // Find a random candle to float near
      const targetCandle = candles[Math.floor(Math.random() * candles.length)];
      m.x = targetCandle.x + (Math.random() - 0.5) * 20;
      m.y = targetCandle.y - (Math.random() * 30 + 15);
      m.text = metricValues[Math.floor(Math.random() * metricValues.length)];
      m.color = metricColors[Math.floor(Math.random() * metricColors.length)];
      m.opacity = 0.8 + Math.random() * 0.2;
      m.speedY = 0.25 + Math.random() * 0.45;
      m.life = 0;
      return m;
    };

    for (let i = 0; i < 8; i++) {
      metrics.push(spawnMetric({}));
    }

    // Render loop
    const render = () => {
      // 0. Clear canvas with Deep Dark Navy Background
      ctx.fillStyle = '#0A0E1A';
      ctx.fillRect(0, 0, width, height);

      // 1. Render Static Ultra-thin horizontal reference lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
      gridLines.forEach((ratio) => {
        const yLine = height * ratio;
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.lineTo(width, yLine);
        ctx.stroke();
      });

      // 2. Render Candlestick Layers with Parallax and DOF
      // Sort by layers: bg first, then mg, then fg
      const layers = ['bg', 'mg', 'fg'];
      layers.forEach((layerName) => {
        const layerCandles = candles.filter((c) => c.layer === layerName);

        layerCandles.forEach((candle) => {
          // Update height and wicks dynamically
          candle.phase += candle.speed;
          const delta = Math.sin(candle.phase) * 35;
          const currentHeight = Math.max(20, candle.height + delta);
          const currentWickTop = candle.wickTop + Math.cos(candle.phase) * 12;
          const currentWickBottom = candle.wickBottom + Math.sin(candle.phase) * 10;
          const bodyY = candle.y - currentHeight / 2;

          ctx.save();
          ctx.globalAlpha = candle.opacity;

          // Parallax and Blur for background layers
          if (candle.layer === 'bg') {
            ctx.filter = 'blur(4px)';
          } else if (candle.layer === 'mg') {
            ctx.filter = 'blur(1px)';
          } else {
            ctx.filter = 'none';
            // Foreground active glow
            ctx.shadowColor = candle.color;
            ctx.shadowBlur = 15;
          }

          // Draw vertical wick line
          ctx.strokeStyle = candle.color;
          ctx.lineWidth = candle.layer === 'fg' ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(candle.x, bodyY - currentWickTop);
          ctx.lineTo(candle.x, bodyY + currentHeight + currentWickBottom);
          ctx.stroke();

          // Draw candle rectangular body
          ctx.fillStyle = candle.color;
          const xPos = candle.x - candle.width / 2;
          const yPos = bodyY;
          const w = candle.width;
          const h = currentHeight;
          const radius = candle.layer === 'bg' ? 1 : 2;

          ctx.beginPath();
          ctx.roundRect(xPos, yPos, w, h, radius);
          ctx.fill();

          ctx.restore();
        });
      });

      // 3. Render Floating Financial Metrics (drifting slowly upwards)
      metrics.forEach((m) => {
        m.y -= m.speedY;
        m.life += 1;
        // Fade in first, then fade out
        if (m.life < 40) {
          m.opacity = Math.min(1, m.opacity + 0.02);
        } else {
          m.opacity = Math.max(0, m.opacity - 0.005);
        }

        if (m.opacity <= 0 || m.y < -30) {
          spawnMetric(m);
        }

        ctx.save();
        ctx.globalAlpha = m.opacity;
        ctx.font = '500 11px "Plus Jakarta Sans", monospace';
        ctx.fillStyle = m.color;
        // Subtle text shadow for digital terminal readability
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      style={{ background: '#0A0E1A' }}
    />
  );
};

export default FinancialCanvasBackground;
