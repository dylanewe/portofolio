import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import PixelIcon from '@/components/PixelIcon';
import {
  iconGo, iconTS, iconPython, iconDocker,
  iconMongo, iconKafka, iconRedis, iconGit,
} from '@/components/PixelIcon';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'GOLANG', icon: iconGo, proficiency: 95 },
  { name: 'TYPESCRIPT', icon: iconTS, proficiency: 95 },
  { name: 'PYTHON', icon: iconPython, proficiency: 75 },
  { name: 'MONGODB', icon: iconMongo, proficiency: 80 },
  { name: 'KAFKA', icon: iconKafka, proficiency: 80 },
  { name: 'REDIS', icon: iconRedis, proficiency: 80 },
  { name: 'DOCKER', icon: iconDocker, proficiency: 80 },
  { name: 'GIT', icon: iconGit, proficiency: 90 },
];

const tools = ['KUBERNETES', 'AZURE', 'POSTGRESQL', 'CLICKHOUSE', 'TEMPORAL', 'OTEL'];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsRef.current?.children;
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 80%',
            containerAnimation: ScrollTrigger.getAll().find(st => st.vars.pin)?.animation,
          },
        }
      );
    }

    if (planetRef.current) {
      gsap.fromTo(
        planetRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 80%',
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
    <section ref={sectionRef} id="skills" className="section-panel">
      {/* Purple glow behind ringed planet */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          width: '500px',
          height: '500px',
          top: '0%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(212,120,255,0.15) 0%, rgba(60,20,100,0.05) 50%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Ringed planet */}
      <img
        ref={planetRef}
        src="/assets/ringed-planet.png"
        alt=""
        className="pixel-art absolute opacity-0 float-slow hidden md:block"
        style={{
          width: 'min(32vw, 360px)',
          top: '8%',
          left: '-6%',
          zIndex: 1,
          filter: 'drop-shadow(0 0 25px rgba(255,180,60,0.2))',
        }}
        draggable={false}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative ml-auto px-6 md:px-20 max-w-[560px] w-full md:w-auto" style={{ zIndex: 2 }}>
        <SectionLabel text="SECTOR 02" />

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
          MY ARSENAL
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
          Languages, tools, and infrastructure I work with
        </p>

        {/* Skills grid */}
        <div ref={cardsRef} className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map(skill => (
            <div
              key={skill.name}
              className="glass-card flex flex-col items-center text-center p-4"
            >
              <PixelIcon {...skill.icon} scale={4} className="mb-2" />
              <span
                className="text-white mt-1"
                style={{
                  fontFamily: 'var(--pixel-font)',
                  fontSize: '7px',
                  letterSpacing: '1px',
                }}
              >
                {skill.name}
              </span>
              {/* Proficiency bar */}
              <div className="prof-track mt-2">
                <div className="prof-fill" style={{ width: `${skill.proficiency}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tools row */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tools.map(tool => (
            <span key={tool} className="tool-pill">{tool}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
