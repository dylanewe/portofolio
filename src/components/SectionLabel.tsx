import PixelIcon, { pixelStarSmall } from './PixelIcon';

interface SectionLabelProps {
  text: string;
  className?: string;
}

const SectionLabel = ({ text, className = '' }: SectionLabelProps) => {
  return (
    <div className={`section-label ${className}`}>
      <PixelIcon {...pixelStarSmall} scale={2} />
      <span className="self-center">{text}</span>
    </div>
  );
};

export default SectionLabel;
