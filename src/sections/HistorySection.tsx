import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: '2025 — PRESENT',
    title: 'JUNIOR SOFTWARE ENGINEER',
    org: 'iPiD',
    desc: 'Building high-performance payment validation microservices using Go and Node.js. Designing reliable backend systems for payment processing workflows.',
    type: 'work',
  },
  {
    year: 'MAR 2025 — AUG 2025',
    title: 'SOFTWARE DEVELOPMENT ENGINEER',
    org: 'Waftech Sdn Bhd',
    desc: 'Developed software for custom wafer processing machines using C#. Worked on control systems and automation software for semiconductor manufacturing equipment.',
    type: 'work',
  },
  {
    year: '2022 — 2024',
    title: 'B.S. COMPUTER SCIENCE',
    org: 'University of Wisconsin-Madison',
    desc: 'Coursework: Artificial Intelligence, Big Data Systems, Algorithms, Operating Systems, Computer Security. President of Cooking Club · AI Club Member.',
    type: 'edu',
  },
];

const HistorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = itemsRef.current?.children;
    if (items) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.12,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 75%',
            containerAnimation: ScrollTrigger.getAll().find(st => st.vars.pin)?.animation,
          },
        }
      );
    }

    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 75%',
            containerAnimation: ScrollTrigger.getAll().find(st => st.vars.pin)?.animation,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="history" className="section-panel justify-center">
      {/* Purple glow decoration */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(180,100,255,0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      {/* Small floating pixel star decorations */}
      <div className="absolute top-[12%] left-[8%] pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="twinkle-1"
          style={{
            width: '4px',
            height: '4px',
            background: '#c490ff',
            boxShadow: '0 0 6px rgba(196,144,255,0.5)',
          }}
        />
      </div>
      <div className="absolute bottom-[15%] right-[12%] pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="twinkle-3"
          style={{
            width: '3px',
            height: '3px',
            background: '#00f0ff',
            boxShadow: '0 0 4px rgba(0,240,255,0.4)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative px-6 md:px-20 max-w-[700px] w-full" style={{ zIndex: 2 }}>
        <SectionLabel text="SECTOR 03" />

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
          TIMELINE
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
          My journey through the galaxy
        </p>

        {/* Timeline */}
        <div className="relative mt-8" ref={itemsRef}>
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-[7px] top-0 bottom-0 origin-top"
            style={{
              width: '2px',
              background: 'linear-gradient(to bottom, var(--neon-purple), var(--pixel-pink), transparent)',
              boxShadow: '0 0 8px rgba(179,71,217,0.4)',
              zIndex: 0,
            }}
          />

          {timelineItems.map((item, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 md:gap-5 mb-6 last:mb-0"
              style={{ zIndex: 1 }}
            >
              {/* Node dot */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className="relative"
                  style={{
                    width: '16px',
                    height: '16px',
                  }}
                >
                  {/* Outer glow */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: item.type === 'work'
                        ? 'rgba(179, 71, 217, 0.3)'
                        : 'rgba(0, 240, 255, 0.3)',
                      boxShadow: item.type === 'work'
                        ? '0 0 8px rgba(179,71,217,0.4)'
                        : '0 0 8px rgba(0,240,255,0.4)',
                    }}
                  />
                  {/* Inner pixel */}
                  <div
                    className="absolute"
                    style={{
                      top: '4px',
                      left: '4px',
                      width: '8px',
                      height: '8px',
                      background: item.type === 'work' ? '#b347d9' : '#00f0ff',
                    }}
                  />
                </div>
              </div>

              {/* Card */}
              <div
                className="glass-card flex-1 p-4"
                style={{
                  background: item.type === 'work'
                    ? 'rgba(60, 20, 100, 0.35)'
                    : 'rgba(0, 60, 80, 0.25)',
                  borderColor: item.type === 'work'
                    ? 'rgba(180, 100, 255, 0.2)'
                    : 'rgba(0, 240, 255, 0.15)',
                }}
              >
                {/* Year badge */}
                <span
                  className="inline-block mb-2 px-2 py-1"
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '7px',
                    letterSpacing: '1px',
                    color: item.type === 'work' ? '#d478ff' : '#00f0ff',
                    background: item.type === 'work'
                      ? 'rgba(179,71,217,0.15)'
                      : 'rgba(0,240,255,0.1)',
                    border: item.type === 'work'
                      ? '1px solid rgba(180,100,255,0.2)'
                      : '1px solid rgba(0,240,255,0.15)',
                  }}
                >
                  {item.year}
                </span>

                {/* Title */}
                <h3
                  className="text-white mt-1"
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    lineHeight: 1.6,
                  }}
                >
                  {item.title}
                </h3>

                {/* Organization */}
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '8px',
                    letterSpacing: '1px',
                    color: 'rgba(240, 230, 255, 0.7)',
                  }}
                >
                  {item.org}
                </p>

                {/* Description */}
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '7px',
                    lineHeight: 1.8,
                    color: 'rgba(240, 230, 255, 0.5)',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div style={{ width: '8px', height: '8px', background: '#b347d9' }} />
            <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color: 'rgba(240,230,255,0.5)' }}>
              WORK
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '8px', height: '8px', background: '#00f0ff' }} />
            <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color: 'rgba(240,230,255,0.5)' }}>
              EDUCATION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
