import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, Code2 } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focusable = containerRef.current?.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusable?.[0] as HTMLElement;
    const lastEl = focusable?.[focusable.length - 1] as HTMLElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key === 'Tab') {
        if (e.shiftKey) { if (document.activeElement === firstEl) { e.preventDefault(); lastEl?.focus(); } }
        else { if (document.activeElement === lastEl) { e.preventDefault(); firstEl?.focus(); } }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline();
    tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to(containerRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }, 0.1)
      .from(contentRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, 0.2);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: () => onClose() });
    tl.to(contentRef.current?.children || [], { y: -10, opacity: 0, stagger: 0.03, duration: 0.2 })
      .to(containerRef.current, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
      .to(overlayRef.current, { opacity: 0, duration: 0.3 }, 0.2);
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay opacity-0"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={containerRef}
        className="glass-card w-full max-w-[700px] max-h-[85vh] overflow-y-auto opacity-0"
        style={{
          transform: 'scale(0.9)', padding: 0, borderRadius: '0px',
          border: '2px solid rgba(180, 100, 255, 0.25)',
          boxShadow: '0 0 40px rgba(180, 100, 255, 0.2)',
        }}
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 transition-colors duration-200 hover:bg-[rgba(255,94,200,0.15)]"
          style={{ border: '1px solid rgba(180,100,255,0.2)' }}
          aria-label="Close"
        >
          <X size={18} color="#f0e6ff" />
        </button>

        <div ref={contentRef}>
          {/* Image or gradient fallback */}
          <div
            className="relative h-[180px] md:h-[260px] overflow-hidden flex items-center justify-center"
            style={{
              background: project.image
                ? 'transparent'
                : 'linear-gradient(135deg, rgba(60,20,100,0.9) 0%, rgba(20,5,40,0.95) 100%)',
            }}
          >
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover pixel-art" />
            ) : (
              <Code2 size={48} color="rgba(180,100,255,0.4)" />
            )}
          </div>

          {/* Content */}
          <div className="p-5 md:p-7">
            <h2
              id="modal-title"
              className="glow-purple"
              style={{ fontFamily: 'var(--pixel-font)', fontSize: '18px', letterSpacing: '2px', color: '#fff' }}
            >
              {project.title}
            </h2>

            <p
              className="mt-4"
              style={{ fontFamily: 'var(--pixel-font)', fontSize: '9px', lineHeight: 2, color: 'rgba(240,230,255,0.7)' }}
            >
              {project.longDescription || project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {project.tags.map(tag => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <ExternalLink size={14} />
                  DEMO
                </a>
              )}
              {project.sourceUrl && (
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Code2 size={14} />
                  CODE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
