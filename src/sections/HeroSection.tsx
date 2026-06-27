import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SectionLabel from '@/components/SectionLabel';

interface HeroSectionProps {
  visible: boolean;
  onNavigate?: (section: string) => void;
}

const HeroSection = ({ visible, onNavigate }: HeroSectionProps) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!visible) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(labelRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
      .to(nameRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.4)
      .to(roleRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.6)
      .to(bioRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
      .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.9)
      .to(planetRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0.3);

    return () => { tl.kill(); };
  }, [visible]);

  return (
    <section id="hero" className="section-panel">
      {/* Purple gradient glow behind planet */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(179,71,217,0.25) 0%, rgba(60,20,100,0.1) 50%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Pink planet */}
      <img
        ref={planetRef}
        src="/assets/pink-planet.png"
        alt=""
        className="pixel-art absolute opacity-0 float-slow"
        style={{
          width: 'min(45vw, 480px)',
          bottom: '-5%',
          right: '-3%',
          transform: 'scale(0.8)',
          zIndex: 1,
          filter: 'drop-shadow(0 0 30px rgba(255,94,200,0.3))',
        }}
        draggable={false}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative px-6 md:px-20 max-w-[600px]" style={{ zIndex: 2 }}>
        <div ref={labelRef} className="opacity-0" style={{ transform: 'translateX(-20px)' }}>
          <SectionLabel text="WELCOME" />
        </div>

        <h1
          ref={nameRef}
          className="opacity-0 mt-6 glow-purple"
          style={{
            transform: 'translateY(30px)',
            fontFamily: 'var(--pixel-font)',
            fontSize: 'clamp(24px, 4vw, 40px)',
            lineHeight: 1.4,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          DYLAN EWE
          <span
            className="block mt-4"
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: 'var(--pixel-pink)',
              boxShadow: '0 0 10px rgba(255,94,200,0.5)',
            }}
          />
        </h1>

        <div ref={roleRef} className="opacity-0 mt-4">
          <span
            className="glow-cyan"
            style={{
              fontFamily: 'var(--pixel-font)',
              fontSize: 'clamp(9px, 1.2vw, 11px)',
              letterSpacing: '1px',
              color: 'var(--neon-cyan)',
              lineHeight: 1.8,
            }}
          >
            SOFTWARE ENGINEER
          </span>
        </div>

        <p
          ref={bioRef}
          className="opacity-0 mt-6"
          style={{
            transform: 'translateY(20px)',
            fontFamily: 'var(--pixel-font)',
            fontSize: '10px',
            lineHeight: 2,
            color: 'rgba(240, 230, 255, 0.7)',
            maxWidth: '420px',
          }}
        >
          UW-Madison CS grad building scalable backend and AI systems. Currently crafting payment validation pipelines and microservices in Go and TypeScript. Into distributed systems, cooking, running, and golf.
        </p>

        <div
          ref={buttonsRef}
          className="opacity-0 mt-8 flex flex-wrap gap-4"
          style={{ transform: 'translateY(15px)' }}
        >
          <button
            onClick={() => onNavigate?.('projects')}
            className="btn-primary"
          >
            EXPLORE
          </button>
          <button
            onClick={() => onNavigate?.('contact')}
            className="btn-secondary"
          >
            CONTACT
          </button>
        </div>
      </div>

      {/* Scroll prompt */}
      <div
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 opacity-40"
        style={{ zIndex: 2 }}
      >
        <span
          style={{
            fontFamily: 'var(--pixel-font)',
            fontSize: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(240, 230, 255, 0.5)',
          }}
        >
          SCROLL
        </span>
        <span
          style={{
            color: 'rgba(240, 230, 255, 0.5)',
            animation: 'arrowPulse 1.5s ease-in-out infinite',
          }}
        >
          →
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
