import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import PixelIcon, { pixelStarSmall } from './PixelIcon';

interface LoadingScreenProps {
  onDismiss: () => void;
}

const LoadingScreen = ({ onDismiss }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'LOADING...';

  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    gsap.to(progressRef.current, { width: '100%', duration: 1.5, ease: 'power2.inOut' });
    gsap.to(spinnerRef.current, { rotation: 360, duration: 2, repeat: -1, ease: 'linear' });

    const timer = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0, duration: 0.5, ease: 'power2.in',
        onComplete: () => onDismiss(),
      });
    }, 1800);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0a0514 0%, #1a0b2e 50%, #240e4a 100%)' }}
    >
      {/* Pixel planet spinner */}
      <div ref={spinnerRef} className="mb-8">
        <PixelIcon
          grid={[
            ['.', '.', 'P', 'P', 'P', '.', '.'],
            ['.', 'P', 'P', 'P', 'P', 'P', '.'],
            ['P', 'P', 'D', 'P', 'P', 'P', 'P'],
            ['P', 'P', 'P', 'P', 'D', 'P', 'P'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['.', 'P', 'P', 'P', 'P', 'P', '.'],
            ['.', '.', 'P', 'P', 'P', '.', '.'],
          ]}
          colors={{ P: '#ff5ec8', D: '#c43a96' }}
          scale={6}
        />
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2 mb-5">
        <PixelIcon {...pixelStarSmall} scale={1} />
        <span
          className="glow-purple"
          style={{ fontFamily: 'var(--pixel-font)', fontSize: '11px', letterSpacing: '3px', color: '#d478ff' }}
        >
          {displayedText}
          <span className="animate-pulse">_</span>
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-[100px] h-[4px] overflow-hidden"
        style={{ background: 'rgba(180, 100, 255, 0.15)', border: '1px solid rgba(180,100,255,0.1)' }}
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{ width: '0%', background: 'linear-gradient(90deg, #b347d9, #ff5ec8, #00f0ff)' }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
