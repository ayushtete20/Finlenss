import React, { useEffect, useRef } from 'react';

export default function FinancialBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Window Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCandles();
      initLineGraph();
    };
    window.addEventListener('resize', handleResize);

    // Color Palette tailored to Light Blue Theme (#EAF2F8)
    const CANDLE_COLORS_BULL = ['#059669', '#0D9488', '#10B981']; // Vibrant Emeralds / Teals
    const CANDLE_COLORS_BEAR = ['#1D4ED8', '#2563EB', '#1E40AF']; // Deep Royal Blues
    const TEXT_COLORS = ['#1E3A8A', '#047857', '#1D4ED8', '#0F766E']; // High-contrast navy & deep teal

    let candles = [];
    let numbers = [];
    let lineNodes = []; // Data points for the new line graph

    // Initialize Candlesticks across 3 Depth Layers
    function initCandles() {
      candles = [];
      const isMobile = width < 768;
      const totalCandles = Math.floor(width / (isMobile ? 55 : 38)); 

      for (let i = 0; i < totalCandles; i++) {
        const x = (i + 0.5) * (width / totalCandles);
        const layer = Math.random() < 0.3 ? 1 : Math.random() < 0.7 ? 2 : 3;
        
        const baseHeight = height * (0.35 + Math.random() * 0.35);
        const bodyHeight = 20 + Math.random() * 60;
        const isBullish = Math.random() > 0.45;

        candles.push({
          x,
          y: baseHeight,
          open: baseHeight,
          close: isBullish ? baseHeight - bodyHeight : baseHeight + bodyHeight,
          targetOpen: baseHeight,
          targetClose: isBullish ? baseHeight - bodyHeight : baseHeight + bodyHeight,
          highOffset: 15 + Math.random() * 25,
          lowOffset: 15 + Math.random() * 25,
          layer, 
          isBullish,
          width: layer === 1 ? 6 : layer === 2 ? 10 : 14,
          speed: 0.02 + Math.random() * 0.03,
          changeTimer: Math.random() * 100,
        });
      }

      numbers = [];
      const numCount = isMobile ? 4 : 10;
      for (let j = 0; j < numCount; j++) {
        spawnNumber();
      }
    }

    // Initialize Dynamic Line Graph Nodes
    function initLineGraph() {
      lineNodes = [];
      const numNodes = 25; // Number of points across the screen
      const spacing = width / (numNodes - 1);
      
      for(let i = 0; i < numNodes; i++) {
         let baseY = height * 0.5;
         lineNodes.push({
           x: i * spacing,
           y: baseY,
           // Random target height for the line graph to move towards
           targetY: baseY + (Math.random() - 0.5) * (height * 0.6),
           speed: 0.005 + Math.random() * 0.015 // Slower, smoother movement
         });
      }
    }

    function spawnNumber() {
      const randomCandle = candles[Math.floor(Math.random() * candles.length)];
      if (!randomCandle) return;

      // Generates a random 10-digit number (between 1,000,000,000 and 9,999,999,999)
      const tenDigitNumber = Math.floor(1000000000 + Math.random() * 9000000000);

      numbers.push({
        x: randomCandle.x + (Math.random() * 20 - 10),
        y: randomCandle.y + (Math.random() * 40 - 20),
        value: tenDigitNumber.toString(),
        prefix: Math.random() > 0.5 ? '+' : '-',
        suffix: '',
        opacity: 0,
        maxOpacity: 0.25 + Math.random() * 0.35,
        speedY: -0.2 - Math.random() * 0.3,
        life: 0,
        maxLife: 150 + Math.random() * 100,
        color: TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)],
        fontSize: 11 + Math.floor(Math.random() * 4),
      });
    }

    initCandles();
    initLineGraph();

    // Main Render Loop
    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Background base light blue fill
      ctx.fillStyle = '#EAF2F8';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Subtle Background Terminal Grid
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.06)';
      ctx.lineWidth = 1;
      const gridSpacing = 80;
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sort candles by layer for depth
      candles.sort((a, b) => a.layer - b.layer);

      // 2. Animate and Draw Candlesticks
      candles.forEach((c) => {
        c.changeTimer += 1;
        if (c.changeTimer > 80 + Math.random() * 120) {
          c.changeTimer = 0;
          c.isBullish = Math.random() > 0.4;
          const shift = (Math.random() - 0.5) * 80;
          const newBody = 15 + Math.random() * 60;
          c.targetOpen = Math.max(100, Math.min(height - 100, c.y + shift));
          c.targetClose = c.isBullish ? c.targetOpen - newBody : c.targetOpen + newBody;
        }

        c.open += (c.targetOpen - c.open) * c.speed;
        c.close += (c.targetClose - c.close) * c.speed;

        const top = Math.min(c.open, c.close);
        const bottom = Math.max(c.open, c.close);
        const high = top - c.highOffset;
        const low = bottom + c.lowOffset;

        let alpha = c.layer === 1 ? 0.25 : c.layer === 2 ? 0.55 : 0.85;

        ctx.save();
        const colorPalette = c.isBullish ? CANDLE_COLORS_BULL : CANDLE_COLORS_BEAR;
        const mainColor = colorPalette[c.layer - 1];

        ctx.strokeStyle = mainColor;
        ctx.globalAlpha = alpha * 0.8;
        ctx.lineWidth = c.layer === 3 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(c.x, high);
        ctx.lineTo(c.x, low);
        ctx.stroke();

        ctx.fillStyle = mainColor;
        ctx.globalAlpha = alpha;
        
        ctx.fillRect(c.x - c.width / 2, top, c.width, Math.max(3, bottom - top));
        ctx.restore();
      });

      // 3. Animate and Draw the Random Line Graph
      ctx.save();
      ctx.beginPath();
      // Move to first point
      ctx.moveTo(lineNodes[0].x, lineNodes[0].y);
      
      for (let i = 0; i < lineNodes.length; i++) {
        let node = lineNodes[i];
        
        // Move current Y towards target Y
        node.y += (node.targetY - node.y) * node.speed;
        
        // Pick new random target if close to the current one
        if (Math.abs(node.targetY - node.y) < 10) {
            node.targetY = (height * 0.5) + (Math.random() - 0.5) * (height * 0.7);
        }

        // Draw smooth bezier curve through points
        if (i < lineNodes.length - 1) {
          const xc = (lineNodes[i].x + lineNodes[i + 1].x) / 2;
          const yc = (lineNodes[i].y + lineNodes[i + 1].y) / 2;
          ctx.quadraticCurveTo(lineNodes[i].x, lineNodes[i].y, xc, yc);
        } else {
          ctx.lineTo(node.x, node.y);
        }
      }
      
      // Style the line graph (Emerald Green, semi-transparent)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // 4. Animate and Draw Floating 10-Digit Numbers
      numbers.forEach((num, index) => {
        num.life += 1;
        num.y += num.speedY;

        if (num.life < 30) {
          num.opacity = (num.life / 30) * num.maxOpacity;
        } else if (num.life > num.maxLife - 30) {
          num.opacity = ((num.maxLife - num.life) / 30) * num.maxOpacity;
        }

        ctx.save();
        ctx.font = `600 ${num.fontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = num.color;
        ctx.globalAlpha = Math.max(0, num.opacity);
        ctx.fillText(`${num.prefix}${num.value}${num.suffix}`, num.x, num.y);
        ctx.restore();

        if (num.life >= num.maxLife) {
          numbers.splice(index, 1);
          spawnNumber();
        }
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
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ backgroundColor: '#EAF2F8' }}
    />
  );
}
