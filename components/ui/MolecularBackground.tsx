'use client';

/**
 * MolecularBackground — Animated molecular nodes and connecting lines
 * Uses logo brand colors (navy, blue, green) on transparent background.
 * Renders floating spherical nodes connected by faint lines,
 * evoking peptide chains, molecular structures, and DNA.
 */
export default function MolecularBackground({ density = 'normal' }: { density?: 'sparse' | 'normal' | 'dense' }) {
  const nodes = density === 'sparse' ? sparseNodes : density === 'dense' ? denseNodes : normalNodes;
  const lines = density === 'sparse' ? sparseLines : density === 'dense' ? denseLines : normalLines;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Subtle hex grid overlay */}
      <div className="absolute inset-0 hex-pattern opacity-40" />

      {/* Molecular dot grid */}
      <div className="absolute inset-0 molecular-bg" />

      {/* Radial glow accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Connecting lines */}
      {lines.map((line, i) => (
        <div
          key={`line-${i}`}
          className={`mol-line ${line.color}`}
          style={{
            left: line.x,
            top: line.y,
            width: line.length,
            transform: `rotate(${line.angle}deg)`,
          }}
        />
      ))}

      {/* Animated molecular nodes */}
      {nodes.map((node, i) => (
        <div
          key={`node-${i}`}
          className={`mol-node ${node.color} ${node.animation}`}
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
            opacity: node.opacity,
            animationDelay: node.delay,
            animationDuration: node.duration,
          }}
        />
      ))}

      {/* DNA helix decorative element — right side */}
      <svg className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 opacity-[0.04] animate-spin-slow hidden md:block" width="120" height="300" viewBox="0 0 120 300">
        <path d="M60 0 Q100 75 60 150 Q20 225 60 300" fill="none" stroke="#5b9bd5" strokeWidth="1.5" />
        <path d="M60 0 Q20 75 60 150 Q100 225 60 300" fill="none" stroke="#6ab04c" strokeWidth="1.5" />
        {[30, 60, 90, 120, 150, 180, 210, 240, 270].map((y) => (
          <line key={y} x1="35" y1={y} x2="85" y2={y} stroke="#1e4d8c" strokeWidth="0.8" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

interface MolNode {
  x: string; y: string; size: number; color: string; animation: string; opacity: number; delay: string; duration: string;
}

interface MolLine {
  x: string; y: string; length: string; angle: number; color: string;
}

const sparseNodes: MolNode[] = [
  { x: '8%', y: '15%', size: 10, color: 'mol-node-blue', animation: 'animate-float-slow', opacity: 0.5, delay: '0s', duration: '7s' },
  { x: '85%', y: '25%', size: 7, color: 'mol-node-green', animation: 'animate-drift', opacity: 0.4, delay: '1s', duration: '9s' },
  { x: '20%', y: '75%', size: 8, color: 'mol-node-navy', animation: 'animate-float-slow', opacity: 0.35, delay: '2s', duration: '8s' },
  { x: '75%', y: '80%', size: 6, color: 'mol-node-blue', animation: 'animate-drift', opacity: 0.3, delay: '3s', duration: '10s' },
  { x: '50%', y: '50%', size: 5, color: 'mol-node-green', animation: 'animate-pulse-soft', opacity: 0.25, delay: '0.5s', duration: '6s' },
];

const sparseLines: MolLine[] = [
  { x: '10%', y: '18%', length: '120px', angle: 25, color: 'mol-line-blue' },
  { x: '70%', y: '75%', length: '100px', angle: -15, color: 'mol-line-green' },
];

const normalNodes: MolNode[] = [
  { x: '5%', y: '12%', size: 12, color: 'mol-node-blue', animation: 'animate-float-slow', opacity: 0.5, delay: '0s', duration: '7s' },
  { x: '15%', y: '30%', size: 7, color: 'mol-node-green', animation: 'animate-drift', opacity: 0.4, delay: '1.5s', duration: '9s' },
  { x: '88%', y: '18%', size: 9, color: 'mol-node-navy', animation: 'animate-float-slow', opacity: 0.45, delay: '0.5s', duration: '8s' },
  { x: '78%', y: '35%', size: 6, color: 'mol-node-blue', animation: 'animate-pulse-soft', opacity: 0.35, delay: '2s', duration: '5s' },
  { x: '92%', y: '55%', size: 8, color: 'mol-node-green', animation: 'animate-drift', opacity: 0.4, delay: '3s', duration: '10s' },
  { x: '10%', y: '70%', size: 10, color: 'mol-node-blue', animation: 'animate-float-slow', opacity: 0.45, delay: '1s', duration: '7s' },
  { x: '25%', y: '85%', size: 5, color: 'mol-node-navy', animation: 'animate-drift', opacity: 0.3, delay: '4s', duration: '11s' },
  { x: '65%', y: '80%', size: 7, color: 'mol-node-green', animation: 'animate-float-slow', opacity: 0.35, delay: '2.5s', duration: '8s' },
  { x: '45%', y: '45%', size: 5, color: 'mol-node-blue', animation: 'animate-pulse-soft', opacity: 0.25, delay: '0s', duration: '6s' },
  { x: '55%', y: '15%', size: 6, color: 'mol-node-green', animation: 'animate-drift', opacity: 0.3, delay: '3.5s', duration: '9s' },
];

const normalLines: MolLine[] = [
  { x: '7%', y: '15%', length: '140px', angle: 30, color: 'mol-line-blue' },
  { x: '15%', y: '32%', length: '100px', angle: -20, color: 'mol-line-green' },
  { x: '80%', y: '20%', length: '120px', angle: 45, color: 'mol-line-blue' },
  { x: '85%', y: '55%', length: '90px', angle: -35, color: 'mol-line-green' },
  { x: '12%', y: '72%', length: '110px', angle: 15, color: 'mol-line-blue' },
  { x: '60%', y: '78%', length: '80px', angle: -25, color: 'mol-line-green' },
];

const denseNodes: MolNode[] = [
  ...normalNodes,
  { x: '35%', y: '20%', size: 4, color: 'mol-node-navy', animation: 'animate-pulse-soft', opacity: 0.2, delay: '1s', duration: '5s' },
  { x: '70%', y: '50%', size: 6, color: 'mol-node-blue', animation: 'animate-float-slow', opacity: 0.3, delay: '2s', duration: '7s' },
  { x: '40%', y: '65%', size: 8, color: 'mol-node-green', animation: 'animate-drift', opacity: 0.35, delay: '0.5s', duration: '8s' },
  { x: '95%', y: '85%', size: 5, color: 'mol-node-navy', animation: 'animate-pulse-soft', opacity: 0.25, delay: '3s', duration: '6s' },
  { x: '3%', y: '50%', size: 7, color: 'mol-node-blue', animation: 'animate-float-slow', opacity: 0.3, delay: '4s', duration: '9s' },
];

const denseLines: MolLine[] = [
  ...normalLines,
  { x: '35%', y: '22%', length: '100px', angle: 50, color: 'mol-line-blue' },
  { x: '68%', y: '48%', length: '90px', angle: -40, color: 'mol-line-green' },
  { x: '38%', y: '63%', length: '75px', angle: 20, color: 'mol-line-blue' },
];
