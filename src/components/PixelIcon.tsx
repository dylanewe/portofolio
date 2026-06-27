import React from 'react';

interface PixelIconProps {
  grid: string[][];
  colors: Record<string, string>;
  scale?: number;
  className?: string;
}

const PixelIcon: React.FC<PixelIconProps> = ({ grid, colors, scale = 1, className }) => {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  const boxShadows: string[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = grid[y][x];
      if (key && key !== '.' && colors[key]) {
        boxShadows.push(`${x * scale}px ${y * scale}px 0 0 ${colors[key]}`);
      }
    }
  }

  return (
    <span
      className={`inline-block align-middle ${className || ''}`}
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        minWidth: `${width * scale}px`,
        minHeight: `${height * scale}px`,
        position: 'relative',
      }}
    >
      <span
        className="absolute top-0 left-0"
        style={{
          width: `${scale}px`,
          height: `${scale}px`,
          backgroundColor: 'transparent',
          boxShadow: boxShadows.join(', '),
          imageRendering: 'pixelated',
        }}
      />
    </span>
  );
};

// Predefined pixel icons
export const pixelStar8pt = {
  grid: [
    ['.', '.', '.', '.', '.', '.', '.', '.', 'W', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', 'W', 'W', 'W', 'W', 'W', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'W', 'W', 'W', 'W', 'W', 'W', 'W', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', 'W', 'W', 'W', 'W', 'C', 'W', 'W', 'W', 'W', '.', '.', '.', '.'],
    ['.', '.', '.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.', '.', '.'],
    ['.', '.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.', '.'],
    ['.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.'],
    ['W', 'W', 'W', 'W', 'C', 'C', 'C', 'C', 'W', 'C', 'C', 'C', 'C', 'W', 'W', 'W', 'W'],
    ['.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.'],
    ['.', '.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.', '.'],
    ['.', '.', '.', 'W', 'W', 'W', 'W', 'C', 'C', 'C', 'W', 'W', 'W', 'W', '.', '.', '.'],
    ['.', '.', '.', '.', 'W', 'W', 'W', 'W', 'C', 'W', 'W', 'W', 'W', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'W', 'W', 'W', 'W', 'W', 'W', 'W', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', 'W', 'W', 'W', 'W', 'W', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', 'W', '.', '.', '.', '.', '.', '.', '.', '.'],
  ],
  colors: { W: '#00D4FF', C: '#FFFFFF' },
};

export const pixelStarSmall = {
  grid: [
    ['.', '.', '.', '.', 'W', '.', '.', '.', '.'],
    ['.', '.', '.', 'W', 'W', 'W', '.', '.', '.'],
    ['.', '.', 'W', 'W', 'C', 'W', 'W', '.', '.'],
    ['.', 'W', 'W', 'C', 'C', 'C', 'W', 'W', '.'],
    ['W', 'W', 'C', 'C', 'W', 'C', 'C', 'W', 'W'],
    ['.', 'W', 'W', 'C', 'C', 'C', 'W', 'W', '.'],
    ['.', '.', 'W', 'W', 'C', 'W', 'W', '.', '.'],
    ['.', '.', '.', 'W', 'W', 'W', '.', '.', '.'],
    ['.', '.', '.', '.', 'W', '.', '.', '.', '.'],
  ],
  colors: { W: '#00D4FF', C: '#FFFFFF' },
};

// Skill icons (5x5 pixel grids)
export const iconJS = {
  grid: [
    ['.', 'C', 'C', 'C', '.'],
    ['C', '.', '.', '.', '.'],
    ['.', 'C', 'C', '.', '.'],
    ['.', '.', '.', 'C', '.'],
    ['C', 'C', 'C', '.', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconReact = {
  grid: [
    ['.', '.', 'N', '.', '.'],
    ['.', 'O', '.', 'O', '.'],
    ['N', '.', 'C', '.', 'N'],
    ['.', 'O', '.', 'O', '.'],
    ['.', '.', 'N', '.', '.'],
  ],
  colors: { N: '#00D4FF', O: '#00D4FF', C: '#00D4FF' },
};

export const iconTS = {
  grid: [
    ['C', 'C', 'C', 'C', '.'],
    ['.', '.', 'C', '.', '.'],
    ['.', '.', 'C', '.', '.'],
    ['.', '.', 'C', '.', '.'],
    ['.', '.', 'S', '.', '.'],
  ],
  colors: { C: '#00D4FF', S: '#00D4FF' },
};

export const iconHTML = {
  grid: [
    ['.', '.', 'C', '.', '.'],
    ['.', 'C', '.', 'C', '.'],
    ['C', 'C', 'C', 'C', 'C'],
    ['.', 'C', '.', 'C', '.'],
    ['.', '.', 'C', '.', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconThree = {
  grid: [
    ['C', 'C', 'C', 'C', '.'],
    ['C', '.', '.', '.', 'C'],
    ['C', '.', '.', '.', 'C'],
    ['C', '.', '.', '.', 'C'],
    ['.', 'C', 'C', 'C', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconNode = {
  grid: [
    ['.', '.', 'C', '.', '.'],
    ['.', 'C', '.', 'C', '.'],
    ['C', '.', '.', '.', 'C'],
    ['.', 'C', '.', 'C', '.'],
    ['.', '.', 'C', '.', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconPython = {
  grid: [
    ['.', 'C', 'C', 'C', '.'],
    ['C', 'C', '.', '.', '.'],
    ['.', 'C', 'C', 'C', '.'],
    ['.', '.', '.', 'C', 'C'],
    ['.', 'C', 'C', 'C', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconGit = {
  grid: [
    ['.', '.', 'C', '.', '.'],
    ['.', 'C', 'C', 'C', '.'],
    ['C', '.', 'C', '.', '.'],
    ['.', '.', 'C', 'C', 'C'],
    ['.', '.', 'C', '.', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconFigma = {
  grid: [
    ['.', 'C', 'C', 'C', '.'],
    ['.', 'C', '.', 'C', '.'],
    ['.', 'C', 'C', '.', '.'],
    ['.', 'C', '.', '.', '.'],
    ['.', 'C', '.', '.', '.'],
  ],
  colors: { C: '#00D4FF' },
};

export const iconGo = {
  grid: [
    ['.', 'C', 'C', 'C', '.'],
    ['C', '.', '.', '.', 'C'],
    ['C', '.', '.', '.', 'C'],
    ['C', '.', '.', '.', 'C'],
    ['.', 'C', 'C', 'C', '.'],
  ],
  colors: { C: '#00ADD8' },
};

export const iconDocker = {
  grid: [
    ['.', 'C', '.', 'C', '.'],
    ['C', 'C', 'C', 'C', 'C'],
    ['C', 'C', 'C', 'C', 'C'],
    ['.', 'C', 'C', 'C', '.'],
    ['.', '.', 'C', '.', '.'],
  ],
  colors: { C: '#2496ED' },
};

export const iconMongo = {
  grid: [
    ['.', '.', 'G', '.', '.'],
    ['.', 'G', 'G', 'G', '.'],
    ['.', 'G', 'G', 'G', '.'],
    ['.', 'G', 'G', 'G', '.'],
    ['.', '.', 'G', '.', '.'],
  ],
  colors: { G: '#47A248' },
};

export const iconKafka = {
  grid: [
    ['K', '.', '.', '.', 'K'],
    ['K', '.', '.', 'K', '.'],
    ['K', 'K', 'K', '.', '.'],
    ['K', '.', '.', 'K', '.'],
    ['K', '.', '.', '.', 'K'],
  ],
  colors: { K: '#ffffff' },
};

export const iconRedis = {
  grid: [
    ['.', 'R', 'R', 'R', '.'],
    ['R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R'],
    ['.', 'R', 'R', 'R', '.'],
  ],
  colors: { R: '#DC382D' },
};

export default PixelIcon;
