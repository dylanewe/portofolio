import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  speed: number;
  phase: number;
  color: string;
}

const StarfieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      // Mobile only needs viewport-width canvas; desktop needs extra width for parallax
      const isMobile = window.innerWidth < 768;
      canvas.width = isMobile ? window.innerWidth : window.innerWidth * 5;
      canvas.height = window.innerHeight;
      generateStars();
    };

    const generateStars = () => {
      const count = Math.min(400, Math.floor((canvas.width * canvas.height) / 10000));
      const stars: Star[] = [];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let color = '#FFFFFF';
        if (rand < 0.15) color = '#C490FF';
        else if (rand < 0.25) color = '#A0E8FF';
        else if (rand < 0.3) color = '#FFD4F5';

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.floor(Math.random() * 3), // 1-3px chunky pixels
          baseOpacity: 0.15 + Math.random() * 0.7,
          speed: 0.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          color,
        });
      }
      starsRef.current = stars;
    };

    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      starsRef.current.forEach(star => {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.baseOpacity;
        ctx.fillRect(
          Math.floor(star.x / star.size) * star.size,
          Math.floor(star.y / star.size) * star.size,
          star.size, star.size
        );
      });
      ctx.globalAlpha = 1;
      return () => window.removeEventListener('resize', resize);
    }

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        const twinkle = Math.sin(elapsed * star.speed + star.phase) * 0.35;
        const opacity = Math.max(0.05, Math.min(1, star.baseOpacity + twinkle));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;

        // Snap to pixel grid for chunky pixel look
        const px = Math.floor(star.x / star.size) * star.size;
        const py = Math.floor(star.y / star.size) * star.size;
        ctx.fillRect(px, py, star.size, star.size);
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas w-full h-full block pointer-events-none"
      aria-hidden="true"
      style={{ willChange: 'transform', maxWidth: '100vw' }}
    />
  );
};

export default StarfieldCanvas;
