import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Copy, Check } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import SocialButton from '@/components/SocialButton';
import type { SocialLink } from '@/types';

const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/dylanewe', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dylanewe', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:dylanewe@gmail.com', icon: 'email' },
];

const ContactSection = () => {
  const ufoRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const cowRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [ufoAnimating, setUfoAnimating] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('dylanewe@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = 'dylanewe@gmail.com';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, []);

  const handleUfoClick = useCallback(() => {
    if (ufoAnimating || !ufoRef.current || !beamRef.current || !cowRef.current) return;
    setUfoAnimating(true);

    const tl = gsap.timeline({ onComplete: () => setUfoAnimating(false) });

    tl.to(ufoRef.current, { rotation: -5, duration: 0.06, ease: 'power2.inOut', yoyo: true, repeat: 5 })
      .to(beamRef.current, { opacity: 0.4, duration: 0.5, ease: 'power2.out' }, 0.3)
      .set(cowRef.current, { opacity: 1, y: 80, scale: 0.6 }, 0.5)
      .to(cowRef.current, { y: -100, scale: 1, duration: 1.2, ease: 'power2.inOut' }, 0.5)
      .to(cowRef.current, { opacity: 0, scale: 0.4, duration: 0.3 }, 1.5)
      .to(beamRef.current, { opacity: 0.1, duration: 0.5 }, 1.8)
      .to(ufoRef.current, { rotation: 3, duration: 0.15, ease: 'power2.inOut', yoyo: true, repeat: 3 }, 2)
      .to(ufoRef.current, { rotation: 0, duration: 0.2 }, 2.5);
  }, [ufoAnimating]);

  return (
    <section id="contact" className="section-panel">
      {/* Purple glow behind UFO */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(60,20,100,0.05) 50%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Blue planet */}
      <img
        src="/assets/blue-planet-small.png"
        alt=""
        className="pixel-art absolute float-medium"
        style={{
          width: '50px',
          top: '8%',
          right: '8%',
          opacity: 0.35,
          zIndex: 1,
          filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.2))',
        }}
        draggable={false}
        aria-hidden="true"
      />

      {/* UFO */}
      <div className="absolute left-[6%] md:left-[10%] top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
        <div
          ref={beamRef}
          className="absolute left-1/2 -translate-x-1/2 top-[80%] w-[80px] h-[120px]"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(74,222,128,0.3) 0%, transparent 70%)',
            opacity: 0.1,
          }}
        />
        <div ref={cowRef} className="absolute left-1/2 -translate-x-1/2 top-[100%] opacity-0" style={{ zIndex: 2 }}>
          <div style={{
            width: `${3 * 7}px`,
            height: `${3 * 6}px`,
            position: 'relative',
            imageRendering: 'pixelated',
          }}>
            <div style={{
              width: '3px', height: '3px', background: 'transparent', position: 'absolute', top: 0, left: 0,
              boxShadow: `
                6px 0px 0 0 #555, 9px 0px 0 0 #555, 12px 0px 0 0 #555,
                0px 3px 0 0 #555, 3px 3px 0 0 #fff, 6px 3px 0 0 #fff, 9px 3px 0 0 #555, 12px 3px 0 0 #555, 15px 3px 0 0 #555,
                0px 6px 0 0 #555, 3px 6px 0 0 #fff, 6px 6px 0 0 #555, 9px 6px 0 0 #fff, 12px 6px 0 0 #555, 15px 6px 0 0 #555,
                3px 9px 0 0 #555, 6px 9px 0 0 #555, 9px 9px 0 0 #555, 12px 9px 0 0 #555,
                3px 12px 0 0 #555, 9px 12px 0 0 #555
              `,
            }} />
          </div>
        </div>
        <div
          ref={ufoRef}
          className="ufo-float cursor-pointer relative"
          onClick={handleUfoClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUfoClick(); } }}
          tabIndex={0}
          role="button"
          aria-label="Click the UFO!"
        >
          <img
            src="/assets/ufo-and-alien.png"
            alt="UFO with alien pilot"
            className="pixel-art"
            style={{ width: 'min(22vw, 240px)', filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.25))' }}
            draggable={false}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative ml-auto px-6 md:px-20 max-w-[500px] w-full md:w-auto" style={{ zIndex: 2 }}>
        <SectionLabel text="SECTOR 05" />

        <h2
          className="mt-5 glow-purple"
          style={{
            fontFamily: 'var(--pixel-font)',
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            lineHeight: 1.4,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          CONTACT
        </h2>

        <p
          className="mt-3"
          style={{
            fontFamily: 'var(--pixel-font)',
            fontSize: '9px',
            lineHeight: 1.8,
            color: 'rgba(240, 230, 255, 0.6)',
          }}
        >
          Open to opportunities and collaborations. Let's connect.
        </p>

        {/* Contact card */}
        <div
          className="glass-card mt-6"
          style={{
            background: 'rgba(60, 20, 100, 0.45)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(180, 100, 255, 0.25)',
            boxShadow: '0 8px 40px rgba(180, 100, 255, 0.12)',
            padding: '28px',
          }}
        >
          {/* Email */}
          <div>
            <span
              className="block mb-3"
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'rgba(240, 230, 255, 0.4)',
              }}
            >
              SEND TO
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="glow-cyan"
                style={{
                  fontFamily: 'var(--pixel-font)',
                  fontSize: 'clamp(9px, 1.2vw, 11px)',
                  color: 'var(--neon-cyan)',
                  letterSpacing: '1px',
                }}
              >
                dylanewe@gmail.com
              </span>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 transition-colors duration-200 hover:bg-[rgba(0,240,255,0.1)] relative"
                style={{ background: 'rgba(60, 20, 100, 0.3)', border: '1px solid rgba(0,240,255,0.2)' }}
                aria-label="Copy email"
              >
                {copied ? <Check size={14} color="#4ADE80" /> : <Copy size={14} color="var(--neon-cyan)" />}
                {copied && (
                  <span
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[8px] whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--pixel-font)',
                      color: '#4ADE80',
                      background: 'rgba(10, 5, 20, 0.95)',
                      border: '1px solid rgba(74,222,128,0.3)',
                    }}
                  >
                    COPIED!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-3 mt-6">
            {socialLinks.map(link => (
              <SocialButton key={link.name} {...link} />
            ))}
          </div>

        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center md:text-left"
          style={{
            fontFamily: 'var(--pixel-font)',
            fontSize: '7px',
            letterSpacing: '1px',
            color: 'rgba(240, 230, 255, 0.3)',
          }}
        >
          © 2025 DYLAN EWE
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
