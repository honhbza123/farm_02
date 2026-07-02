/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  Filter, 
  Calendar, 
  BarChart2, 
  CloudSun, 
  Droplet, 
  Cpu, 
  AlertTriangle, 
  Thermometer,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  X
} from 'lucide-react';
import { GROWTH_TRENDS, IRRIGATION_EFFICIENCY } from '../data';

interface AnalyticsViewProps {
  plots: Plot[];
  trialDay: number;
}

interface Plot {
  id: number;
  variety: string;
  status: string;
}

export default function AnalyticsView({ plots, trialDay }: AnalyticsViewProps) {
  // Filter states
  const [selectedVariety, setSelectedVariety] = useState<string>('All Varieties');
  const [selectedIrrigation, setSelectedIrrigation] = useState<string>('Combined');
  
  // Applied filters (active states)
  const [appliedVariety, setAppliedVariety] = useState<string>('All Varieties');
  const [appliedIrrigation, setAppliedIrrigation] = useState<string>('Combined');

  // Legend visibility toggles
  const [showPAC, setShowPAC] = useState<boolean>(true);
  const [showSuwan, setShowSuwan] = useState<boolean>(true);
  const [showCPS8, setShowCPS8] = useState<boolean>(true);

  // Modals / popovers
  const [showOutlookModal, setShowOutlookModal] = useState<boolean>(false);
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [inspectedSensor, setInspectedSensor] = useState<{ id: string; type: string; status: 'Optimal' | 'Alert' } | null>(null);

  const handleApplyFilters = () => {
    setAppliedVariety(selectedVariety);
    setAppliedIrrigation(selectedIrrigation);
  };

  // Line chart coordinates calculator (Weeks 1 to 8, Height up to 200)
  const chartHeight = 240;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getCoordinates = (datasetKey: 'PAC789' | 'Suwan' | 'CPS8') => {
    return GROWTH_TRENDS.map((item, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2) / (GROWTH_TRENDS.length - 1));
      const value = item[datasetKey];
      const y = chartHeight - paddingY - (value * (chartHeight - paddingY * 2) / 200);
      return { x, y, label: item.label, value };
    });
  };

  const pacCoords = getCoordinates('PAC789');
  const suwanCoords = getCoordinates('Suwan');
  const cpCoords = getCoordinates('CPS8');

  // SVG Path generator helper
  const makePath = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, coord, i) => {
      return i === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
    }, '');
  };

  // Area path generator (closes the shape at the bottom)
  const makeAreaPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    const start = coords[0];
    const end = coords[coords.length - 1];
    const linePath = makePath(coords);
    return `${linePath} L ${end.x} ${chartHeight - paddingY} L ${start.x} ${chartHeight - paddingY} Z`;
  };

  // Filter line plot states based on dropdown
  const isPacVisible = showPAC && (appliedVariety === 'All Varieties' || appliedVariety === 'PAC789');
  const isSuwanVisible = showSuwan && (appliedVariety === 'All Varieties' || appliedVariety === 'Suwan 5720');
  const isCpVisible = showCPS8 && (appliedVariety === 'All Varieties' || appliedVariety === 'CP S8');

  // Filter bar chart metrics
  const getFilteredEfficiency = () => {
    if (appliedIrrigation === 'Combined') return IRRIGATION_EFFICIENCY;
    if (appliedIrrigation === 'AWD (Alternate Wetting/Drying)') {
      return IRRIGATION_EFFICIENCY.filter(e => e.name === 'AWD System');
    }
    if (appliedIrrigation === 'Drip Irrigation') {
      return IRRIGATION_EFFICIENCY.filter(e => e.name === 'Drip System');
    }
    return IRRIGATION_EFFICIENCY.filter(e => e.name === 'Mini Sprinkler');
  };

  const currentEfficiency = getFilteredEfficiency();

  // Grid sensors (6 x 3 layout as requested for W1-P1 to W3-P6)
  const sensorGrid = [
    // AWD Row (W1)
    { id: 'W1-P1', row: 'W1', type: 'AWD System', status: 'Optimal' as const },
    { id: 'W1-P2', row: 'W1', type: 'AWD System', status: 'Optimal' as const },
    { id: 'W1-P3', row: 'W1', type: 'AWD System', status: 'Alert' as const }, // Alert sensor from reference design
    { id: 'W1-P4', row: 'W1', type: 'AWD System', status: 'Optimal' as const },
    { id: 'W1-P5', row: 'W1', type: 'AWD System', status: 'Optimal' as const },
    { id: 'W1-P6', row: 'W1', type: 'AWD System', status: 'Optimal' as const },
    // Drip Row (W2)
    { id: 'W2-P1', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    { id: 'W2-P2', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    { id: 'W2-P3', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    { id: 'W2-P4', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    { id: 'W2-P5', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    { id: 'W2-P6', row: 'W2', type: 'Drip System', status: 'Optimal' as const },
    // Mini Sprinkler Row (W3)
    { id: 'W3-P1', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
    { id: 'W3-P2', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
    { id: 'W3-P3', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
    { id: 'W3-P4', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
    { id: 'W3-P5', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
    { id: 'W3-P6', row: 'W3', type: 'Mini Sprinkler', status: 'Optimal' as const },
  ];

  // Dynamic GDD based on active Day
  const currentGDD = Number((1410.3 + (trialDay * 18.2)).toFixed(1));

  return (
    <div className="space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C2C9BB]">
        <div className="max-w-2xl">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-[#154212] leading-[0.85] uppercase font-sans">
            YIELD <span className="text-[#A1D494]">ANALYTICS</span>
          </h2>
          <p className="mt-4 text-base text-[#42493E] italic font-serif">
            Deep dive into experimental crop variety adaptation indices, cumulative thermal units (GDD), and comparative irrigation efficiency indices.
          </p>
        </div>
        <div className="bg-white px-4 py-2 border-l-4 border-[#154212] shadow-xs shrink-0 self-start md:self-end">
          <span className="block text-[10px] font-bold text-[#42493E] uppercase tracking-widest">Station telemetry</span>
          <span className="text-sm font-mono font-bold text-[#154212]">STATION_DAY_{trialDay}_STATS</span>
        </div>
      </div>

      {/* Dynamic Filters panel */}
      <div className="flex flex-wrap items-center gap-4 bg-[#F3F4F3] p-5 rounded-2xl border border-[#C2C9BB] shadow-xs">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#42493E] uppercase tracking-wider mb-1.5 block ml-1">
            Crop Variety filter
          </span>
          <select 
            value={selectedVariety}
            onChange={(e) => setSelectedVariety(e.target.value)}
            className="bg-white border-2 border-[#C2C9BB] rounded-xl font-sans text-xs font-bold text-[#154212] pr-10 h-11 focus:ring-[#154212] focus:border-[#154212] cursor-pointer"
          >
            <option>All Varieties</option>
            <option>PAC789</option>
            <option>Suwan 5720</option>
            <option>CP S8</option>
            <option>DEKALB 8899S</option>
          </select>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#42493E] uppercase tracking-wider mb-1.5 block ml-1">
            Irrigation System filter
          </span>
          <select 
            value={selectedIrrigation}
            onChange={(e) => setSelectedIrrigation(e.target.value)}
            className="bg-white border-2 border-[#C2C9BB] rounded-xl font-sans text-xs font-bold text-[#154212] pr-10 h-11 focus:ring-[#154212] focus:border-[#154212] cursor-pointer"
          >
            <option>Combined</option>
            <option>AWD (Alternate Wetting/Drying)</option>
            <option>Drip Irrigation</option>
            <option>Mini Sprinkler</option>
          </select>
        </div>

        <button 
          onClick={handleApplyFilters}
          className="h-11 px-6 bg-[#154212] hover:bg-[#285c24] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs cursor-pointer shadow-md uppercase tracking-wider self-end"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Growth Trend Line Chart */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#E1E3E2]">
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-[#154212]" />
              01. COMPARATIVE GROWTH TREND
            </h3>

            {/* Interactive Legend triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowPAC(!showPAC)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border-2 transition-all cursor-pointer uppercase tracking-wider ${
                  showPAC ? 'border-[#154212] bg-[#154212]/5 text-[#154212]' : 'border-[#C2C9BB] text-[#42493E] opacity-55'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#154212]"></span>
                PAC789
              </button>
              <button 
                onClick={() => setShowSuwan(!showSuwan)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border-2 transition-all cursor-pointer uppercase tracking-wider ${
                  showSuwan ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-[#C2C9BB] text-[#42493E] opacity-55'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Suwan
              </button>
              <button 
                onClick={() => setShowCPS8(!showCPS8)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border-2 transition-all cursor-pointer uppercase tracking-wider ${
                  showCPS8 ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-[#C2C9BB] text-[#42493E] opacity-55'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                CP S8
              </button>
            </div>
          </div>

          {/* Custom SVG Line Graph */}
          <div className="w-full relative overflow-x-auto custom-scrollbar">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-[280px] min-w-[460px] select-none"
            >
              {/* Y Axis Gridlines & Labels */}
              {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((val) => {
                const y = chartHeight - paddingY - (val * (chartHeight - paddingY * 2) / 200);
                return (
                  <g key={val} className="opacity-45">
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={chartWidth - paddingX} 
                      y2={y} 
                      stroke="#e1e3e2" 
                      strokeWidth="0.8" 
                    />
                    <text 
                      x={paddingX - 10} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="font-mono text-[9px] fill-on-surface-variant font-bold"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Stem Height vertical label */}
              <text 
                x={12} 
                y={chartHeight / 2} 
                transform={`rotate(-90 12 ${chartHeight / 2})`}
                textAnchor="middle" 
                className="font-sans text-[9px] fill-on-surface-variant font-bold uppercase tracking-wider"
              >
                Stem Height (cm)
              </text>

              {/* X Axis Weeks labels */}
              {GROWTH_TRENDS.map((item, i) => {
                const x = paddingX + (i * (chartWidth - paddingX * 2) / (GROWTH_TRENDS.length - 1));
                return (
                  <g key={item.label} className="opacity-60">
                    <line 
                      x1={x} 
                      y1={paddingY} 
                      x2={x} 
                      y2={chartHeight - paddingY} 
                      stroke="#e1e3e2" 
                      strokeWidth="0.5" 
                      strokeDasharray="2,2"
                    />
                    <text 
                      x={x} 
                      y={chartHeight - 6} 
                      textAnchor="middle" 
                      className="font-mono text-[9px] fill-on-surface-variant font-semibold"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}

              {/* PAC789 Plot (Solid curve with Area fill below) */}
              {isPacVisible && (
                <>
                  <path 
                    d={makeAreaPath(pacCoords)} 
                    fill="url(#gradient-pac)" 
                    opacity="0.15" 
                  />
                  <path 
                    d={makePath(pacCoords)} 
                    fill="none" 
                    stroke="#154212" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Suwan 5720 (Dashed Curve) */}
              {isSuwanVisible && (
                <path 
                  d={makePath(suwanCoords)} 
                  fill="none" 
                  stroke="#3b6934" 
                  strokeWidth="2" 
                  strokeDasharray="4,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* CP S8 Plot (Light Green Solid) */}
              {isCpVisible && (
                <path 
                  d={makePath(cpCoords)} 
                  fill="none" 
                  stroke="#a1d494" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Hover Indicators */}
              {GROWTH_TRENDS.map((item, index) => {
                const x = paddingX + (index * (chartWidth - paddingX * 2) / (GROWTH_TRENDS.length - 1));
                return (
                  <rect
                    key={index}
                    x={x - 15}
                    y={paddingY}
                    width={30}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                    className="cursor-pointer hover:fill-black/[0.02]"
                    onMouseEnter={() => setHoveredTrend(index)}
                    onMouseLeave={() => setHoveredTrend(null)}
                  />
                );
              })}

              {/* Hover dot highlights & values */}
              {hoveredTrend !== null && (
                <g>
                  {/* Vertical rule overlay */}
                  {(() => {
                    const x = paddingX + (hoveredTrend * (chartWidth - paddingX * 2) / (GROWTH_TRENDS.length - 1));
                    return (
                      <line 
                        x1={x} 
                        y1={paddingY} 
                        x2={x} 
                        y2={chartHeight - paddingY} 
                        stroke="#72796e" 
                        strokeWidth="1" 
                        strokeDasharray="1,1"
                      />
                    );
                  })()}

                  {/* Draw circular indicator anchors */}
                  {isPacVisible && (
                    <circle 
                      cx={pacCoords[hoveredTrend].x} 
                      cy={pacCoords[hoveredTrend].y} 
                      r="4.5" 
                      fill="#154212" 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                    />
                  )}
                  {isSuwanVisible && (
                    <circle 
                      cx={suwanCoords[hoveredTrend].x} 
                      cy={suwanCoords[hoveredTrend].y} 
                      r="4" 
                      fill="#3b6934" 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                    />
                  )}
                  {isCpVisible && (
                    <circle 
                      cx={cpCoords[hoveredTrend].x} 
                      cy={cpCoords[hoveredTrend].y} 
                      r="4" 
                      fill="#a1d494" 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                    />
                  )}
                </g>
              )}

              {/* SVG Gradients definition */}
              <defs>
                <linearGradient id="gradient-pac" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#154212" />
                  <stop offset="100%" stopColor="#154212" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Custom Tooltip overlay */}
            {hoveredTrend !== null && (
              <div 
                className="absolute bg-inverse-surface text-inverse-on-surface text-[10px] p-2 rounded shadow-lg border border-outline/30 z-10 pointer-events-none w-36 font-sans"
                style={{
                  left: `${Math.min(chartWidth - 150, Math.max(50, paddingX + (hoveredTrend * (chartWidth - paddingX * 2) / (GROWTH_TRENDS.length - 1)) - 70))}px`,
                  top: '10px'
                }}
              >
                <p className="font-bold border-b border-white/20 pb-0.5 mb-1 text-center">
                  {GROWTH_TRENDS[hoveredTrend].label} Metrics
                </p>
                {isPacVisible && <p className="flex justify-between"><span>PAC789:</span> <strong>{GROWTH_TRENDS[hoveredTrend].PAC789} cm</strong></p>}
                {isSuwanVisible && <p className="flex justify-between"><span>Suwan:</span> <strong>{GROWTH_TRENDS[hoveredTrend].Suwan} cm</strong></p>}
                {isCpVisible && <p className="flex justify-between"><span>CP S8:</span> <strong>{GROWTH_TRENDS[hoveredTrend].CPS8} cm</strong></p>}
              </div>
            )}
          </div>
        </div>

        {/* GDD & Forecast Panel (Right column) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* GDD Card */}
          <div className="bg-[#154212] text-white p-6 rounded-2xl shadow-md relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-[#A1D494] uppercase tracking-widest font-mono">
                Current Cumulative GDD
              </p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-4xl font-bold tracking-tight font-sans">{currentGDD.toLocaleString()}</span>
                <span className="text-xs font-mono opacity-90">°C-day</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[#A1D494]">
                <TrendingUp className="w-4 h-4 text-[#A1D494] animate-bounce" />
                <span className="text-xs font-semibold">+18.2 GDD thermal unit accumulation</span>
              </div>
            </div>
            
            {/* abstract ambient circle */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-300"></div>
          </div>

          {/* Harvest Forecast Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs">
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#154212]" />
              02. HARVEST ESTIMATES
            </h3>

            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#F9FAF8] border border-[#C2C9BB]">
                <div className="w-12 h-12 rounded-lg bg-[#154212] text-white flex flex-col items-center justify-center leading-none">
                  <span className="text-[9px] font-bold uppercase font-mono tracking-wider">Oct</span>
                  <span className="text-lg font-bold font-sans mt-0.5">24</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#42493E] uppercase tracking-wider font-mono">Est. Flowering</p>
                  <p className="text-xs font-bold text-[#154212] font-sans">PAC789 / Variety 1</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-center gap-4 p-3 rounded-xl border border-[#C2C9BB] border-dashed">
                <div className="w-12 h-12 rounded bg-[#E1E3E2] text-[#42493E] flex flex-col items-center justify-center leading-none">
                  <span className="text-[9px] font-bold uppercase font-mono tracking-wider">Dec</span>
                  <span className="text-lg font-bold font-sans mt-0.5">12</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#42493E] uppercase tracking-wider font-mono">Est. Maturity</p>
                  <p className="text-xs font-bold text-[#42493E] font-sans">Bulk Harvest Phase</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowOutlookModal(true)}
              className="w-full mt-4 py-3 border-2 border-[#154212] text-[#154212] hover:bg-[#F9FAF8] transition-all rounded-xl font-bold text-xs cursor-pointer text-center uppercase tracking-wider"
            >
              View Seasonal Outlook
            </button>
          </div>
        </div>

      </div>

      {/* Second Row: Irrigation Efficiency & Sensor plot network */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Irrigation Efficiency index */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] flex items-center gap-2">
              <Droplet className="w-4.5 h-4.5 text-[#154212]" />
              03. WATER COST EFFICIENCY
            </h3>
            <span className="bg-[#154212] text-white px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase">
              LITERS / KG
            </span>
          </div>

          {/* Interactive Custom SVG Bar Graph */}
          <div className="w-full relative">
            <svg viewBox="0 0 300 180" className="w-full h-[200px] select-none">
              {/* Gridlines */}
              {[0, 50, 100, 150, 200].map((val) => {
                const y = 150 - (val * 120 / 200);
                return (
                  <g key={val} className="opacity-40">
                    <line x1="30" y1={y} x2="280" y2={y} stroke="#e1e3e2" strokeWidth="0.8" strokeDasharray="1,2" />
                    <text x="24" y={y + 3} textAnchor="end" className="font-mono text-[8px] fill-on-surface-variant font-bold">{val}</text>
                  </g>
                );
              })}

              {/* Bars */}
              {currentEfficiency.map((item, index) => {
                // AWD System, Drip System, Mini Sprinkler
                const barWidth = 32;
                const barSpacing = (250 - (barWidth * currentEfficiency.length)) / (currentEfficiency.length + 1);
                const x = 30 + barSpacing + index * (barWidth + barSpacing);
                const barHeight = item.index * 120 / 200;
                const y = 150 - barHeight;

                const isHovered = hoveredBar === index;

                return (
                  <g key={item.name}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={item.color}
                      rx="4"
                      ry="4"
                      className="cursor-pointer transition-all duration-200"
                      opacity={isHovered ? 0.9 : 1}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    
                    {/* labels on bottom axis */}
                    <text
                      x={x + barWidth / 2}
                      y="162"
                      textAnchor="middle"
                      className="font-sans text-[8px] fill-on-surface-variant font-bold"
                    >
                      {item.name.replace(' System', '')}
                    </text>
                  </g>
                );
              })}

              <line x1="30" y1="150" x2="280" y2="150" stroke="#72796e" strokeWidth="1" />
            </svg>

            {/* Micro tooltip */}
            {hoveredBar !== null && (
              <div 
                className="absolute bg-inverse-surface text-inverse-on-surface text-[10px] p-2 rounded shadow-md border border-outline/20 font-sans pointer-events-none"
                style={{
                  left: `${80 + hoveredBar * 70}px`,
                  bottom: '70px'
                }}
              >
                <p className="font-bold">{currentEfficiency[hoveredBar].name}</p>
                <p className="text-[10px] opacity-90 mt-0.5">Water Cost: <strong>{currentEfficiency[hoveredBar].index} L/kg</strong></p>
              </div>
            )}
          </div>
        </div>

        {/* Live physical physical grid map layout (W1-P1 to W3-P6) */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-[#E1E3E2]">
            <div>
              <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em]">04. TELEMETRY FIELD MAP</h3>
              <p className="text-[11px] text-[#42493E] italic font-serif mt-1">Sensor network health by physical row</p>
            </div>
            
            <div className="flex gap-3 text-[9px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#154212]"></span> Optimal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-error animate-pulse"></span> Alert
              </span>
            </div>
          </div>

          {/* 6 columns, 3 rows physical grid */}
          <div className="grid grid-cols-6 gap-2 h-[200px] select-none">
            {sensorGrid.map((cell) => {
              const isAlert = cell.status === 'Alert';
              const isAwd = cell.row === 'W1';
              const isDrip = cell.row === 'W2';

              const bgClass = isAwd 
                ? 'bg-primary-container/20 border border-primary/30 text-primary hover:bg-primary-container/30' 
                : isDrip 
                ? 'bg-secondary-container/20 border border-secondary/30 text-secondary hover:bg-secondary-container/30' 
                : 'bg-tertiary-container/20 border border-tertiary/30 text-tertiary hover:bg-tertiary-container/30';

              return (
                <div 
                  key={cell.id}
                  onClick={() => setInspectedSensor({ id: cell.id, type: cell.type, status: cell.status })}
                  className={`${bgClass} rounded-md flex items-center justify-center relative cursor-pointer transition-colors duration-150 p-1`}
                >
                  <span className="text-[9px] font-bold font-mono tracking-tighter">{cell.id}</span>
                  
                  {/* Status dot in corner */}
                  <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                    isAlert ? 'bg-error animate-pulse' : 'bg-primary'
                  }`}></span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold font-sans">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary-container/30 border border-primary/20"></span> AWD Row (W1)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary-container/30 border border-secondary/20"></span> Drip Row (W2)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-tertiary-container/30 border border-tertiary/20"></span> Sprinkler Row (W3)</div>
          </div>
        </div>

      </div>

      {/* Inspected Sensor Modal Overlay */}
      {inspectedSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setInspectedSensor(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          ></div>

          <div className="bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl w-full max-w-sm p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setInspectedSensor(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#E1E3E2] rounded-full cursor-pointer text-[#42493E]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E1E3E2]">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                inspectedSensor.status === 'Alert' ? 'bg-error-container text-[#ba1a1a]' : 'bg-[#154212]/10 text-[#154212]'
              }`}>
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-sans font-bold text-lg text-[#154212] tracking-tight">Sensor node {inspectedSensor.id}</h4>
                <p className="text-[10px] text-[#42493E] font-mono uppercase tracking-wider">{inspectedSensor.type} Line</p>
              </div>
            </div>

            <div className="bg-[#F9FAF8] p-4 rounded-xl space-y-3 text-xs font-sans border border-[#E1E3E2] text-[#42493E]">
              <div className="flex justify-between border-b border-[#E1E3E2] pb-1.5">
                <span className="font-medium uppercase tracking-wider text-[10px]">Telemetry Link Status:</span>
                <span className={`font-bold uppercase ${inspectedSensor.status === 'Alert' ? 'text-error' : 'text-[#154212]'}`}>
                  {inspectedSensor.status === 'Alert' ? 'Packet Dropout' : 'Online'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E1E3E2] pb-1.5">
                <span className="font-medium uppercase tracking-wider text-[10px]">Battery Telemetry:</span>
                <span className="font-mono font-bold text-[#154212]">{inspectedSensor.status === 'Alert' ? '12% (Low Warning)' : '88% (Healthy)'}</span>
              </div>
              <div className="flex justify-between border-b border-[#E1E3E2] pb-1.5">
                <span className="font-medium uppercase tracking-wider text-[10px]">Soil Tension Sensor:</span>
                <span className="font-mono font-bold text-[#154212]">{inspectedSensor.status === 'Alert' ? '320 cbar (Critical Dry)' : '24 cbar (Favorable)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium uppercase tracking-wider text-[10px]">Last Handshake packet:</span>
                <span className="font-mono font-bold text-[#154212]">{inspectedSensor.status === 'Alert' ? '14 mins ago' : '5 secs ago'}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setInspectedSensor(null)}
                className="flex-1 py-3 bg-[#F9FAF8] border border-[#C2C9BB] text-[#42493E] font-bold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider hover:bg-[#E1E3E2]"
              >
                Close Trace
              </button>
              {inspectedSensor.status === 'Alert' && (
                <button
                  onClick={() => {
                    alert("Sending high-priority soil hydration pulse to Plot line W1-P3 emitter node.");
                    setInspectedSensor(null);
                  }}
                  className="flex-1 py-3 bg-[#154212] text-white font-bold text-xs rounded-xl cursor-pointer transition-all hover:bg-[#20521b] uppercase tracking-wider"
                >
                  Water Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Outlook Dialog */}
      {showOutlookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowOutlookModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>

          <div className="bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl w-full max-w-lg p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5 pb-3 border-b border-[#E1E3E2]">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-[#154212]" />
                <h4 className="font-sans font-bold text-lg text-[#154212] tracking-tight uppercase">Phu Ruea Seasonal Outlook</h4>
              </div>
              <button 
                onClick={() => setShowOutlookModal(false)}
                className="p-1.5 hover:bg-[#E1E3E2] rounded-full cursor-pointer text-[#42493E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#42493E] leading-relaxed">
              <p className="font-serif italic text-sm">
                The Loei provincial crop advisory predicts an extended rainfall corridor in the Phu Ruea region. This will aid final vegetative maturity for late-planted replicates.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#C2C9BB]">
                  <span className="text-[9px] uppercase font-bold text-[#154212] block tracking-wider">Avg Temp</span>
                  <span className="text-sm font-bold text-[#154212] mt-1 block">28.8°C</span>
                </div>
                <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#C2C9BB]">
                  <span className="text-[9px] uppercase font-bold text-[#154212] block tracking-wider">Precipitation</span>
                  <span className="text-sm font-bold text-[#154212] mt-1 block">64% Chance</span>
                </div>
                <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#C2C9BB]">
                  <span className="text-[9px] uppercase font-bold text-[#154212] block tracking-wider">Solar Lux</span>
                  <span className="text-sm font-bold text-on-surface mt-1 block">Optimized</span>
                </div>
              </div>

              <div className="bg-[#F9FAF8] p-4 rounded-xl border border-[#C2C9BB]">
                <p className="font-bold text-xs text-[#154212] mb-1.5 uppercase tracking-wide">Agronomy Guideline:</p>
                <p className="text-[11px] font-medium leading-relaxed">
                  Maintain AWD (Alternate Wetting/Drying) trigger thresholds at 18 cbar sensor tension. Check Bt-trait leaf margins on DEKALB varieties for late lepidopteran pupation flags by mid-October.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOutlookModal(false)}
              className="w-full mt-6 py-3 bg-[#154212] text-white font-bold text-xs rounded-xl hover:bg-[#20501c] transition-all cursor-pointer shadow-md text-center uppercase tracking-wider"
            >
              Acknowledge Advisory
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
