/**
 * Neural Link Visualization Component
 * Visualizes connections between Intelligence Modules and Pursuit Codes
 * Based on the TEAM Integrated Solutions Group neural network design
 */

import React, { useMemo, useState } from 'react';
import type { NeuralLink, IntelligenceModuleCode, PursuitCode } from '../types';
import { INTELLIGENCE_MODULES, PURSUIT_CODES } from '../constants';

interface NeuralLinkVisualizationProps {
  neuralLinks: NeuralLink[];
  highlightedModule?: IntelligenceModuleCode;
  highlightedCode?: number;
  onModuleClick?: (module: IntelligenceModuleCode) => void;
  onCodeClick?: (code: number) => void;
  compact?: boolean;
}

const MODULE_COLORS: Record<IntelligenceModuleCode, string> = {
  EDP: '#dc2626', // red
  EPL: '#2563eb', // blue
  CRM: '#16a34a', // green
  ECP: '#9333ea', // purple
  SLS: '#ea580c', // orange
  OPS: '#0891b2', // cyan
};

const MODULE_NAMES: Record<IntelligenceModuleCode, string> = {
  EDP: 'EDP Intelligence',
  EPL: 'EPL Intelligence',
  CRM: 'CRM Intelligence',
  ECP: 'ECP Intelligence',
  SLS: 'SLS Intelligence',
  OPS: 'OPS Intelligence',
};

export const NeuralLinkVisualization: React.FC<NeuralLinkVisualizationProps> = ({
  neuralLinks,
  highlightedModule,
  highlightedCode,
  onModuleClick,
  onCodeClick,
  compact = false,
}) => {
  const [hoveredModule, setHoveredModule] = useState<IntelligenceModuleCode | null>(null);
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);

  // Filter to show 57 codes
  const displayCodes = useMemo(() => {
    return PURSUIT_CODES.slice(0, 57);
  }, []);

  const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];

  // Calculate positions
  const modulePositions = useMemo(() => {
    const positions: Record<IntelligenceModuleCode, { x: number; y: number }> = {} as Record<IntelligenceModuleCode, { x: number; y: number }>;
    const height = compact ? 400 : 600;
    const spacing = height / (modules.length + 1);

    modules.forEach((module, index) => {
      positions[module] = {
        x: compact ? 80 : 120,
        y: spacing * (index + 1),
      };
    });
    return positions;
  }, [compact]);

  const codePositions = useMemo(() => {
    const positions: Record<number, { x: number; y: number }> = {};
    const height = compact ? 400 : 600;
    const width = compact ? 500 : 800;
    const codesPerColumn = Math.ceil(57 / 2);

    displayCodes.forEach((code, index) => {
      const column = Math.floor(index / codesPerColumn);
      const row = index % codesPerColumn;
      const columnSpacing = height / (codesPerColumn + 1);

      positions[code.code] = {
        x: width - (compact ? 80 : 120) - (column * (compact ? 60 : 80)),
        y: columnSpacing * (row + 1),
      };
    });
    return positions;
  }, [displayCodes, compact]);

  // Get active links based on hover/highlight state
  const activeLinks = useMemo(() => {
    const activeModule = hoveredModule || highlightedModule;
    const activeCode = hoveredCode || highlightedCode;

    if (activeModule) {
      return neuralLinks.filter(link => link.sourceModule === activeModule);
    }
    if (activeCode) {
      return neuralLinks.filter(link => link.targetPursuitCode === activeCode);
    }
    return neuralLinks;
  }, [neuralLinks, hoveredModule, hoveredCode, highlightedModule, highlightedCode]);

  const width = compact ? 500 : 800;
  const height = compact ? 400 : 600;

  return (
    <div className="bg-white border border-black">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black bg-gray-50">
        <h3 className="text-sm font-bold uppercase tracking-wider">Neural Link Network</h3>
        <p className="text-xs text-gray-600 mt-1">
          57 Pursuit Codes • 6 Intelligence Modules • {neuralLinks.length} Active Links
        </p>
      </div>

      {/* Visualization */}
      <div className="relative overflow-x-auto">
        <svg
          width={width}
          height={height}
          className="block mx-auto"
          style={{ minWidth: width }}
        >
          {/* Title */}
          <text
            x={width / 2}
            y={25}
            textAnchor="middle"
            className="fill-green-800 font-bold text-lg"
            style={{ fontFamily: 'monospace' }}
          >
            PURSUIT CODEs
          </text>
          <text
            x={width / 2}
            y={42}
            textAnchor="middle"
            className="fill-gray-500 text-xs"
          >
            57 Codes
          </text>

          {/* Neural Links (drawn first so they appear behind nodes) */}
          <g className="neural-links">
            {activeLinks.map((link) => {
              const modulePos = modulePositions[link.sourceModule];
              const codePos = codePositions[link.targetPursuitCode];

              if (!modulePos || !codePos) return null;

              const isHighlighted =
                hoveredModule === link.sourceModule ||
                hoveredCode === link.targetPursuitCode ||
                highlightedModule === link.sourceModule ||
                highlightedCode === link.targetPursuitCode;

              const opacity = isHighlighted ? 0.8 : 0.15;
              const strokeWidth = link.linkType === 'primary' ? 2 : link.linkType === 'secondary' ? 1.5 : 1;

              return (
                <line
                  key={link.id}
                  x1={modulePos.x + 60}
                  y1={modulePos.y}
                  x2={codePos.x - 15}
                  y2={codePos.y}
                  stroke={MODULE_COLORS[link.sourceModule]}
                  strokeWidth={strokeWidth * link.linkStrength}
                  opacity={opacity}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </g>

          {/* Intelligence Module Nodes (Left side) */}
          <g className="module-nodes">
            {modules.map((module) => {
              const pos = modulePositions[module];
              const isActive = hoveredModule === module || highlightedModule === module;

              return (
                <g
                  key={module}
                  transform={`translate(${pos.x - 55}, ${pos.y - 12})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredModule(module)}
                  onMouseLeave={() => setHoveredModule(null)}
                  onClick={() => onModuleClick?.(module)}
                >
                  <rect
                    width={110}
                    height={24}
                    fill={isActive ? MODULE_COLORS[module] : 'white'}
                    stroke={MODULE_COLORS[module]}
                    strokeWidth={2}
                    rx={0}
                  />
                  <text
                    x={55}
                    y={16}
                    textAnchor="middle"
                    fill={isActive ? 'white' : MODULE_COLORS[module]}
                    fontSize={compact ? 9 : 10}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {MODULE_NAMES[module]}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Pursuit Code Nodes (Right side) */}
          <g className="code-nodes">
            {displayCodes.map((code) => {
              const pos = codePositions[code.code];
              if (!pos) return null;

              const isActive = hoveredCode === code.code || highlightedCode === code.code;
              const linkedModules = neuralLinks
                .filter(l => l.targetPursuitCode === code.code)
                .map(l => l.sourceModule);
              const primaryModule = linkedModules[0] || 'EDP';

              return (
                <g
                  key={code.code}
                  transform={`translate(${pos.x - 12}, ${pos.y - 8})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCode(code.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  onClick={() => onCodeClick?.(code.code)}
                >
                  <rect
                    width={24}
                    height={16}
                    fill={isActive ? MODULE_COLORS[primaryModule] : 'white'}
                    stroke={MODULE_COLORS[primaryModule]}
                    strokeWidth={1}
                    rx={0}
                  />
                  <text
                    x={12}
                    y={12}
                    textAnchor="middle"
                    fill={isActive ? 'white' : 'black'}
                    fontSize={compact ? 8 : 9}
                    fontFamily="monospace"
                  >
                    {code.code}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Labels */}
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 20, ${height / 2})`}
            className="fill-red-700 font-bold text-sm"
            style={{ fontFamily: 'monospace' }}
          >
            Probable PMs
          </text>

          <text
            x={width - 20}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(90, ${width - 20}, ${height / 2})`}
            className="fill-green-700 font-bold text-sm"
            style={{ fontFamily: 'monospace' }}
          >
            Neural Links Involved
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-black bg-gray-50">
        <div className="flex flex-wrap gap-4 text-xs">
          {modules.map((module) => (
            <div
              key={module}
              className="flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoveredModule(module)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <span
                className="w-3 h-3 inline-block border"
                style={{ backgroundColor: MODULE_COLORS[module], borderColor: MODULE_COLORS[module] }}
              />
              <span>{module}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPACT NEURAL LINK VIEW (for dashboard cards)
// ============================================================================

interface CompactNeuralViewProps {
  moduleCode: IntelligenceModuleCode;
  links: NeuralLink[];
  onClick?: () => void;
}

export const CompactNeuralView: React.FC<CompactNeuralViewProps> = ({
  moduleCode,
  links,
  onClick,
}) => {
  const moduleLinks = links.filter(l => l.sourceModule === moduleCode);
  const avgStrength = moduleLinks.length > 0
    ? moduleLinks.reduce((sum, l) => sum + l.linkStrength, 0) / moduleLinks.length
    : 0;

  return (
    <div
      className="border border-black p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="px-2 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: MODULE_COLORS[moduleCode] }}
        >
          {moduleCode}
        </span>
        <span className="text-xs text-gray-600">
          {moduleLinks.length} links
        </span>
      </div>

      {/* Strength bar */}
      <div className="h-2 bg-gray-200 mt-2">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${avgStrength * 100}%`,
            backgroundColor: MODULE_COLORS[moduleCode],
          }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Avg strength: {(avgStrength * 100).toFixed(0)}%
      </div>
    </div>
  );
};

export default NeuralLinkVisualization;
