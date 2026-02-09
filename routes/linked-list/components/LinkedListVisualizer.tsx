
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ListNode, DatasetType, ListKind } from '../../../types';
import { NODE_STYLES, EDGE_STYLES, TEXT_PRIMARY, ACCENT, BACKGROUND } from '../../../services/theme';

interface Props {
  nodes: ListNode[];
  datasetType: DatasetType;
  listKind: ListKind;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;
const NODE_GAP = 120;
const START_X = 120;
const START_Y = 200;

const LinkedListVisualizer: React.FC<Props> = ({ nodes, datasetType, listKind }) => {
  const isCircular = listKind === 'CSLL' || listKind === 'CDLL';
  const isDoubly = listKind === 'DLL' || listKind === 'CDLL';

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showIndices, setShowIndices] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const contentWidth = Math.max(1200, nodes.length * (NODE_WIDTH + NODE_GAP) + 400);
  const contentHeight = 480;

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const scale = Math.min(width / contentWidth, height / contentHeight, 1) * 0.85;
    setScale(scale);
    setPosition({ x: (width - contentWidth * scale) / 2, y: (height - contentHeight * scale) / 2 });
  }, [contentWidth, contentHeight]);

  useEffect(() => { const t = setTimeout(() => { if (nodes.length > 0) handleFitToScreen(); }, 100); return () => clearTimeout(t); }, [nodes.length, handleFitToScreen]);

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e: React.WheelEvent) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setScale(s => Math.min(Math.max(0.2, s * (e.deltaY > 0 ? 0.9 : 1.1)), 4)); } };

  // 🌿 Soft Mint Learning Theme - Node Styles
  const getStatusStyles = (status: ListNode['status']) => {
    switch (status) {
      case 'searching': return { ...NODE_STYLES.searching, pulseClass: 'animate-pulse-active' };
      case 'runner': return { ...NODE_STYLES.runner, pulseClass: 'animate-pulse-active' };
      case 'found': return { ...NODE_STYLES.found, pulseClass: '' };
      case 'processing': return { ...NODE_STYLES.active, pulseClass: 'animate-pulse-active' };
      case 'new': return { ...NODE_STYLES.new, pulseClass: 'animate-scale-in' };
      default: return { ...NODE_STYLES.default, pulseClass: '' };
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none bg-white rounded-2xl" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>

      {/* 🌿 View Controls (Light Theme) */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={() => setShowIndices(!showIndices)} className={`p-2.5 backdrop-blur-sm rounded-xl border transition-all duration-300 ${showIndices ? 'bg-mint-100 text-mint-700 border-mint-400 shadow-soft' : 'bg-white text-slate-400 border-slate-200 hover:text-mint-600 hover:border-mint-300'}`} title="Indices">
          <i className="fa-solid fa-list-ol text-sm"></i>
        </button>
        <button onClick={() => setScale(s => Math.min(s * 1.25, 4))} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-mint-600 hover:border-mint-300 hover:bg-mint-50 transition-all shadow-soft" title="Zoom In"><i className="fa-solid fa-plus text-sm"></i></button>
        <button onClick={() => setScale(s => Math.max(s / 1.25, 0.2))} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-mint-600 hover:border-mint-300 hover:bg-mint-50 transition-all shadow-soft" title="Zoom Out"><i className="fa-solid fa-minus text-sm"></i></button>
        <button onClick={handleFitToScreen} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-mint-600 hover:border-mint-300 hover:bg-mint-50 transition-all shadow-soft" title="Fit"><i className="fa-solid fa-expand text-sm"></i></button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-200 font-mono shadow-soft">
        {Math.round(scale * 100)}%
      </div>

      <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} className="w-full h-full origin-top-left">
        <svg ref={svgRef} width={contentWidth} height={contentHeight} className="overflow-visible">
          <defs>
            {/* 🌿 Soft Mint Gradient for connectors */}
            <linearGradient id="mintConnector" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.9" />
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#94A3B8" floodOpacity="0.15" />
            </filter>
            <marker id="arrowhead" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L12,5 L0,10 L3,5 Z" fill={ACCENT} />
            </marker>
          </defs>

          {/* Loop Back for Circular Lists */}
          {isCircular && nodes.length > 0 && (
            <path d={`M ${START_X + (nodes.length - 1) * (NODE_WIDTH + NODE_GAP) + NODE_WIDTH + 10} ${START_Y} C ${START_X + (nodes.length - 1) * (NODE_WIDTH + NODE_GAP) + NODE_WIDTH + 120} ${START_Y + 140}, ${START_X - 120} ${START_Y + 140}, ${START_X - 10} ${START_Y}`} fill="none" stroke="url(#mintConnector)" strokeWidth="3" strokeDasharray="8,6" markerEnd="url(#arrowhead)" strokeLinecap="round" opacity="0.6" />
          )}

          {nodes.map((node, index) => {
            const x = START_X + index * (NODE_WIDTH + NODE_GAP);
            const y = START_Y - NODE_HEIGHT / 2;
            const isLast = index === nodes.length - 1;
            const styles = getStatusStyles(node.status);
            const isActive = node.status !== 'idle';
            const isHovered = hoveredNode === node.id;

            return (
              <g key={node.id} className={`transition-all duration-500 ease-out ${styles.pulseClass}`} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
                {/* Connectors */}
                {!isLast && (
                  <g className="connector-group">
                    <path d={`M ${x + NODE_WIDTH} ${START_Y - (isDoubly ? 8 : 0)} C ${x + NODE_WIDTH + NODE_GAP * 0.3} ${START_Y - (isDoubly ? 8 : 0) - 20}, ${x + NODE_WIDTH + NODE_GAP * 0.7} ${START_Y - (isDoubly ? 8 : 0) - 20}, ${x + NODE_WIDTH + NODE_GAP} ${START_Y - (isDoubly ? 8 : 0)}`} fill="none" stroke="url(#mintConnector)" strokeWidth="3" markerEnd="url(#arrowhead)" strokeLinecap="round" opacity={isActive ? 1 : 0.7} />
                    {isDoubly && <path d={`M ${x + NODE_WIDTH + NODE_GAP} ${START_Y + 8} C ${x + NODE_WIDTH + NODE_GAP * 0.7} ${START_Y + 8 + 20}, ${x + NODE_WIDTH + NODE_GAP * 0.3} ${START_Y + 8 + 20}, ${x + NODE_WIDTH} ${START_Y + 8}`} fill="none" stroke="url(#mintConnector)" strokeWidth="3" markerEnd="url(#arrowhead)" strokeLinecap="round" opacity={isActive ? 1 : 0.5} />}
                  </g>
                )}

                {/* 🌿 Soft shadow ring for active nodes */}
                {isActive && <rect x={x - 4} y={y - 4} width={NODE_WIDTH + 8} height={NODE_HEIGHT + 8} rx="22" fill="none" stroke={styles.stroke} strokeWidth="2" opacity="0.3" />}

                {/* Node Body - Clean white with colored border */}
                <rect x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx="18" fill={styles.fill} stroke={styles.stroke} strokeWidth={isActive ? "3" : "2"} className={`transition-all duration-300 ${isHovered ? 'brightness-95' : ''}`} filter="url(#softShadow)" />

                {/* Pointer sections with soft accent */}
                <rect x={isDoubly ? x + 4 : x + NODE_WIDTH - 48} y={y + 4} width={isDoubly ? 32 : 44} height={NODE_HEIGHT - 8} rx="14" fill={`${ACCENT}15`} />
                {isDoubly && <rect x={x + NODE_WIDTH - 36} y={y + 4} width={32} height={NODE_HEIGHT - 8} rx="14" fill={`${ACCENT}15`} />}

                {/* Node Value Text */}
                <text x={x + (isDoubly ? NODE_WIDTH / 2 : (NODE_WIDTH - 48) / 2)} y={y + NODE_HEIGHT / 2} textAnchor="middle" dominantBaseline="central" className="font-black code-font" fill={styles.text} style={{ fontSize: '26px', fontWeight: 800 }}>{node.value}</text>

                {/* Index Badge */}
                {showIndices && (
                  <g className="transition-opacity duration-300">
                    <rect x={x + NODE_WIDTH / 2 - 18} y={y + NODE_HEIGHT + 12} width="36" height="24" rx="8" fill="#F0FDFA" stroke={ACCENT} strokeWidth="1.5" />
                    <text x={x + NODE_WIDTH / 2} y={y + NODE_HEIGHT + 24} textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold code-font" fill={TEXT_PRIMARY}>[{index}]</text>
                  </g>
                )}

                {/* Status Label */}
                {styles.label && (
                  <g transform={`translate(${x + NODE_WIDTH / 2}, ${y - 20})`}>
                    <rect x="-46" y="-13" width="92" height="26" rx="8" fill={styles.stroke} />
                    <text textAnchor="middle" dy="4" className="text-[10px] font-black fill-white uppercase tracking-wider">{styles.label}</text>
                  </g>
                )}

                {/* HEAD indicator */}
                {index === 0 && (
                  <g transform={`translate(${x + NODE_WIDTH / 2}, ${y - 50})`}>
                    <text textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest" fill={TEXT_PRIMARY}>HEAD</text>
                    <path d={`M 0 8 L 0 22`} stroke={ACCENT} strokeWidth="2" markerEnd="url(#arrowhead)" />
                  </g>
                )}
                {/* NULL indicator for tail */}
                {isLast && !isCircular && index > 0 && (
                  <g transform={`translate(${x + NODE_WIDTH + 30}, ${y + NODE_HEIGHT / 2})`}>
                    <rect x="-5" y="-12" width="50" height="24" rx="6" fill="#FEF2F2" stroke="#F87171" strokeWidth="1.5" />
                    <text textAnchor="middle" x="20" dominantBaseline="middle" className="text-[10px] font-black uppercase" fill="#B91C1C">NULL</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
