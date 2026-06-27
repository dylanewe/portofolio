import { useState, useCallback } from 'react';
import PixelIcon, { pixelStarSmall } from './PixelIcon';

interface NavBarProps {
  progress: number;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { label: 'ABOUT', section: 'hero' },
  { label: 'SKILLS', section: 'skills' },
  { label: 'HISTORY', section: 'history' },
  { label: 'PROJECTS', section: 'projects' },
  { label: 'CONTACT', section: 'contact' },
];

const NavBar = ({ progress, onNavigate }: NavBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = useCallback((section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  }, [onNavigate]);

  return (
    <nav
      style={{
        background: 'rgba(10, 5, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '2px solid rgba(180, 100, 255, 0.15)',
      }}
    >
      <div className="flex items-center justify-between px-5 md:px-10 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav('hero')}
        >
          <PixelIcon {...pixelStarSmall} scale={1} />
          <span
            className="text-white glow-purple hidden sm:inline"
            style={{ fontFamily: 'var(--pixel-font)', fontSize: '10px', letterSpacing: '2px' }}
          >
            DYLAN EWE
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.section}
              onClick={() => handleNav(link.section)}
              className="transition-all duration-200 hover:text-[#d478ff]"
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '8px',
                letterSpacing: '1px',
                color: 'rgba(240, 230, 255, 0.7)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 8px rgba(212,120,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.textShadow = 'none'; }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[4px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-[2px] bg-white transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <span className="block w-5 h-[2px] bg-white transition-opacity duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-[2px] bg-white transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col items-center gap-4 py-5"
          style={{ background: 'rgba(10, 5, 20, 0.97)', borderTop: '1px solid rgba(180,100,255,0.1)' }}
        >
          {navLinks.map(link => (
            <button
              key={link.section}
              onClick={() => handleNav(link.section)}
              className="transition-colors duration-200 hover:text-[#d478ff]"
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '10px',
                letterSpacing: '1px',
                color: 'rgba(240, 230, 255, 0.8)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="nav-progress" style={{ width: `${progress * 100}%` }} />
    </nav>
  );
};

export default NavBar;
