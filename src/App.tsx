import { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarfieldCanvas from '@/components/StarfieldCanvas';
import LoadingScreen from '@/components/LoadingScreen';
import NavBar from '@/components/NavBar';
import HeroSection from '@/sections/HeroSection';
import SkillsSection from '@/sections/SkillsSection';
import HistorySection from '@/sections/HistorySection';
import ProjectsSection from '@/sections/ProjectsSection';
import ContactSection from '@/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const SECTION_COUNT = 5;
const SECTION_IDS = ['hero', 'skills', 'history', 'projects', 'contact'];

function App() {
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mainSTRef = useRef<ScrollTrigger | null>(null);

  const handleLoadingDismiss = useCallback(() => {
    setLoading(false);
    setTimeout(() => setHeroVisible(true), 250);
  }, []);

  // Horizontal scroll setup
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        wrapper.style.display = 'block';
        wrapper.style.width = '100%';
        return;
      }

      wrapper.style.display = 'flex';
      wrapper.style.width = 'fit-content';

      // Force a layout recalc then get accurate scroll width
      void wrapper.offsetHeight;
      const scrollWidth = wrapper.scrollWidth - window.innerWidth;

      if (scrollWidth <= 0) return;

      // Main horizontal scroll - use function for x to recalc on refresh
      const tween = gsap.to(wrapper, {
        x: () => -(wrapper.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth * 1.2}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => setScrollProgress(self.progress),
        },
      });

      mainSTRef.current = tween.scrollTrigger || null;

      // Parallax: starfield moves slower
      const starfield = document.querySelector('.starfield-canvas') as HTMLElement;
      if (starfield) {
        gsap.to(starfield, {
          x: () => -(wrapper.scrollWidth - window.innerWidth) * 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${scrollWidth * 1.2}`,
            scrub: 1,
          },
        });
      }

      // Refresh after images/fonts settle
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    }, 500);

    const onResize = () => {
      if (window.innerWidth >= 768) {
        ScrollTrigger.refresh(true);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
      mainSTRef.current = null;
    };
  }, [loading]);

  const handleNavigate = useCallback((section: string) => {
    const target = document.getElementById(section);
    if (!target) return;

    if (window.innerWidth < 768) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const st = mainSTRef.current;
    if (!st) return;

    const idx = SECTION_IDS.indexOf(section);
    if (idx === -1) return;

    // Map section index to scroll progress (0-1)
    const targetProgress = idx / (SECTION_COUNT - 1);
    const scrollY = st.start + (st.end! - st.start) * targetProgress;

    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen" style={{
      background: 'linear-gradient(135deg, #0a0514 0%, #1a0b2e 30%, #240e4a 60%, #1a0b2e 100%)',
      backgroundAttachment: 'fixed',
    }}>
      {/* Purple nebula glow overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(180,100,255,0.08) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '60%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255,94,200,0.06) 0%, transparent 60%)',
        }} />
        <StarfieldCanvas />
      </div>

      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0" style={{ zIndex: 100 }}>
          <LoadingScreen onDismiss={handleLoadingDismiss} />
        </div>
      )}

      {/* Navigation */}
      {!loading && (
        <div className="fixed top-0 left-0 right-0" style={{ zIndex: 50 }}>
          <NavBar progress={scrollProgress} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Content */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.8s ease 0.15s',
          display: 'flex',
          width: 'fit-content',
        }}
      >
        <HeroSection visible={heroVisible} onNavigate={handleNavigate} />
        <SkillsSection />
        <HistorySection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </div>
  );
}

export default App;
