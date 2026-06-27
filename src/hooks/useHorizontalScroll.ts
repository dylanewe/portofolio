import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

export function useHorizontalScroll(
  onProgress?: (progress: number) => void
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      wrapper.style.width = 'auto';
      wrapper.style.display = 'block';
      return;
    }

    wrapper.style.width = 'fit-content';
    wrapper.style.display = 'flex';

    const scrollWidth = wrapper.scrollWidth - window.innerWidth;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      pin: true,
      scrub: 1,
      end: () => `+=${scrollWidth * 1.5}`,
      onUpdate: (self) => {
        onProgress?.(self.progress);
      },
    });

    gsap.to(wrapper, {
      x: () => -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${scrollWidth * 1.5}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    triggersRef.current.push(st);

    // Parallax layers - planets layer moves at 0.6x
    const planetsLayer = wrapper.querySelector('.parallax-planets') as HTMLElement;
    if (planetsLayer) {
      gsap.to(planetsLayer, {
        x: () => -scrollWidth * 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${scrollWidth * 1.5}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    // Starfield canvas moves at 0.2x
    const starfield = document.querySelector('.starfield-canvas') as HTMLElement;
    if (starfield) {
      gsap.to(starfield, {
        x: () => -scrollWidth * 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${scrollWidth * 1.5}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [onProgress]);

  return wrapperRef;
}
