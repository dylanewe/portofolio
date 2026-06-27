import { Github, Linkedin, Twitter, Dribbble, Mail } from 'lucide-react';

interface SocialButtonProps {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'dribbble' | 'email';
}

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
  email: Mail,
};

const SocialButton = ({ name, url, icon }: SocialButtonProps) => {
  const Icon = iconMap[icon];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="w-11 h-11 flex items-center justify-center transition-all duration-200"
      style={{
        background: 'rgba(60, 20, 100, 0.5)',
        border: '2px solid rgba(180, 100, 255, 0.25)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = 'var(--neon-purple)';
        el.style.borderColor = 'var(--bright-purple)';
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 0 15px rgba(179, 71, 217, 0.4)';
        const svg = el.querySelector('svg');
        if (svg) svg.style.color = '#fff';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(60, 20, 100, 0.5)';
        el.style.borderColor = 'rgba(180, 100, 255, 0.25)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        const svg = el.querySelector('svg');
        if (svg) svg.style.color = '#f0e6ff';
      }}
    >
      <Icon size={16} color="#f0e6ff" className="transition-colors duration-200" />
    </a>
  );
};

export default SocialButton;
