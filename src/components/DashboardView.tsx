/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sprout, 
  Droplet, 
  Wrench, 
  AlertTriangle, 
  ClipboardList, 
  Thermometer, 
  Compass, 
  Play, 
  Check, 
  Cpu, 
  Settings,
  X,
  Plus
} from 'lucide-react';
import { Plot, IrrigationSystem, VarietyKey, ShortVarietyKey } from '../types';
import { VARIETIES } from '../data';

interface DashboardViewProps {
  plots: Plot[];
  irrigationSystems: IrrigationSystem[];
  onToggleIrrigation: (type: 'AWD' | 'Drip' | 'Mini') => void;
  onWaterPlot: (plotId: number) => void;
  onAddLogForPlot: (plotId: number) => void;
  onChangeTab: (tab: string) => void;
}

export default function DashboardView({
  plots,
  irrigationSystems,
  onToggleIrrigation,
  onWaterPlot,
  onAddLogForPlot,
  onChangeTab
}: DashboardViewProps) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  // Calculate stats for the 4 varieties based on actual plots state
  const getVarietyStats = (vKey: VarietyKey) => {
    const subset = plots.filter(p => p.variety === vKey);
    const healthyCount = subset.filter(p => p.status === 'Healthy' || p.status === 'Irrigating').length;
    const pct = subset.length > 0 ? Math.round((healthyCount / subset.length) * 100) : 0;
    
    // Fallback or override to match exact visual designs if close
    return pct;
  };

  // Static variety specs mapping
  const varietyCardSpecs = [
    { key: 'PAC789' as VarietyKey, index: 1, colorClass: 'border-primary', icon: Sprout, indicatorBg: 'bg-primary' },
    { key: 'Suwan 5720' as VarietyKey, index: 2, colorClass: 'border-blue-500', icon: Cpu, indicatorBg: 'bg-blue-500' },
    { key: 'CP S8' as VarietyKey, index: 3, colorClass: 'border-[#eab308]', icon: Droplet, indicatorBg: 'bg-[#eab308]' },
    { key: 'DEKALB 8899S' as VarietyKey, index: 4, colorClass: 'border-[#a855f7]', icon: Compass, indicatorBg: 'bg-[#a855f7]' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant">
        <div className="max-w-2xl">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-[#154212] leading-[0.85] uppercase font-sans">
            MAIN <span className="text-[#A1D494]">DASHBOARD</span>
          </h2>
          <p className="mt-4 text-base text-[#42493E] italic font-serif">
            Real-time status, variety adaptation index, and direct water valve control across 36 experimental plots in Zone A.
          </p>
        </div>
        <div className="bg-white px-4 py-2 border-l-4 border-[#154212] shadow-xs shrink-0 self-start md:self-end">
          <span className="block text-[10px] font-bold text-[#42493E] uppercase tracking-widest">Station telemetry</span>
          <span className="text-sm font-mono font-bold text-[#154212]">ZONE_A_LIVE • HANDSHAKE 5s</span>
        </div>
      </div>

      {/* Variety Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {varietyCardSpecs.map((vSpec) => {
          const successRate = getVarietyStats(vSpec.key);
          const IconComponent = vSpec.icon;

          return (
            <div 
              key={vSpec.key}
              className="bg-white border border-[#C2C9BB] p-5 rounded-2xl shadow-xs transition-transform duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${vSpec.indicatorBg}`}>
                  CAT {vSpec.index}
                </span>
                <IconComponent className="w-5 h-5 text-on-surface-variant/60" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#154212] tracking-tight">{vSpec.key}</h3>
              <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-wider mt-0.5">Active Replicates</p>
              
              <div className="h-2 w-full bg-[#E1E3E2] rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${vSpec.indicatorBg}`}
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-wider">Adaptability Index</p>
                <p className="text-sm font-bold text-[#154212]">{successRate}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Experimental Grid and Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plot Grid View */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-[#E1E3E2]">
            <div>
              <h4 className="text-xs font-bold text-[#154212] uppercase tracking-[0.3em]">01. Experimental Plot Map</h4>
              <p className="text-[11px] text-[#42493E] italic font-serif mt-1">Select cell replicates to inspect field telemetry logs</p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 px-2 py-1 bg-[#F9FAF8] border border-[#C2C9BB] rounded text-[#154212]">
                <span className="w-2 h-2 rounded-full bg-[#154212]"></span> 
                Optimal
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-[#F9FAF8] border border-[#C2C9BB] rounded text-error">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> 
                Stress
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-[#F9FAF8] border border-[#C2C9BB] rounded text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> 
                Irrigating
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {plots.map((plot) => {
              const isHealthy = plot.status === 'Healthy';
              const isIssue = plot.status === 'Issue';
              const isIrrigating = plot.status === 'Irrigating';

              const colorClass = isHealthy 
                ? 'bg-white border-[#C2C9BB] text-[#154212] hover:bg-[#F9FAF8]' 
                : isIssue 
                ? 'bg-error-container/30 border-error/40 text-error hover:bg-error-container/50' 
                : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100';

              return (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`${colorClass} aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer relative group p-2 hover:scale-[1.02]`}
                >
                  <span className="font-mono text-[7px] min-[380px]:text-[8px] min-[440px]:text-[9px] font-bold opacity-75 mb-0.5 text-[#42493E] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    REPLICATE {plot.id}
                  </span>
                  <span className="font-sans font-bold text-xs min-[380px]:text-sm tracking-tight truncate max-w-full">
                    {plot.shortVariety}
                  </span>
                  
                  {isIrrigating && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                  )}
                  {isIssue && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                  )}

                  {/* Desktop Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 hidden group-hover:block bg-black text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 pointer-events-none border border-white/10 font-sans">
                    <p className="font-bold border-b border-white/20 pb-1 mb-1">Plot {plot.id} Status</p>
                    <p className="opacity-90">{plot.variety}</p>
                    <p className="mt-1 flex justify-between"><span>Moisture:</span> <strong>{plot.moisture}%</strong></p>
                    <p className="flex justify-between"><span>Status:</span> <strong className="uppercase">{plot.status}</strong></p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side Controls & Irrigation (Segment) */}
        <div id="irrigation-panel" className="lg:col-span-4 space-y-6">
          
          {/* Action Card */}
          <div className="bg-[#154212] text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden h-48">
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 text-[#A1D494]">02. Task Order</h4>
              <p className="text-xs text-white/90 leading-relaxed font-sans mb-4">
                Capture physical height & leaf metrics before 5:00 PM today.
              </p>
            </div>
            
            <button 
              onClick={() => onChangeTab('datalog')}
              className="w-full bg-[#a1d494] hover:bg-white text-[#154212] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-xs relative z-10 shadow-md"
            >
              <ClipboardList className="w-4 h-4" />
              LOG TODAY'S MEASUREMENTS
            </button>
            
            {/* Design accents */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Irrigation Status panel */}
          <div className="bg-white p-6 rounded-2xl border border-[#C2C9BB] shadow-xs">
            <h4 className="text-xs font-bold text-[#154212] uppercase tracking-[0.3em] mb-4">03. Irrigation Control</h4>
            
            <div className="space-y-3">
              {irrigationSystems.map((sys) => {
                const isAwd = sys.type === 'AWD';
                const isDrip = sys.type === 'Drip';
                const isMini = sys.type === 'Mini';
                
                const isOn = sys.status === 'ON';
                const isMaint = sys.status === 'MAINTENANCE';

                return (
                  <div 
                    key={sys.type}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#E1E3E2] bg-[#F9FAF8] hover:bg-white transition-colors duration-150"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${
                      isOn ? 'bg-[#154212] text-white' : 
                      isMaint ? 'bg-error-container text-on-error-container' : 
                      'bg-[#E1E3E2] text-[#42493E]'
                    }`}>
                      {isAwd && <Droplet className="w-5 h-5" />}
                      {isDrip && <Droplet className="w-5 h-5" />}
                      {isMini && (isMaint ? <AlertTriangle className="w-5 h-5" /> : <Wrench className="w-5 h-5" />)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-xs text-[#154212] truncate">{sys.name}</p>
                      <p className="text-[10px] text-[#42493E] font-mono mt-0.5 truncate">{sys.details}</p>
                    </div>

                    {/* Interactive toggles */}
                    <div className="shrink-0">
                      {isMaint ? (
                        <button
                          onClick={() => onToggleIrrigation(sys.type)}
                          className="px-3 py-1.5 bg-white hover:bg-surface-container-high text-[9px] font-bold text-[#154212] rounded border border-outline-variant cursor-pointer uppercase tracking-wider"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleIrrigation(sys.type)}
                          className={`px-4 py-2 text-[10px] font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
                            isOn 
                              ? 'bg-[#154212] text-white shadow-md shadow-[#154212]/20' 
                              : 'bg-white text-[#42493E] border border-[#C2C9BB]'
                          }`}
                        >
                          {isOn && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                          {isOn ? 'Active' : 'Idle'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Plot Detail Drawer / Dialog (Interactive overlay for plot cells) */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedPlot(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          ></div>

          <div className="bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPlot(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#E1E3E2] rounded-full cursor-pointer text-[#42493E]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E1E3E2]">
              <span className={`w-9 h-9 rounded bg-[#154212] text-white font-bold flex items-center justify-center text-sm`}>
                {selectedPlot.id}
              </span>
              <div>
                <h4 className="font-sans font-bold text-lg text-[#154212] tracking-tight">{selectedPlot.variety}</h4>
                <p className="text-[10px] text-[#42493E] font-mono uppercase tracking-wider">Location: Plot RCBD-{30 + selectedPlot.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#E1E3E2]">
                <span className="text-[9px] text-[#42493E] font-bold uppercase tracking-wider block">Stem Height</span>
                <span className="font-sans font-bold text-lg text-[#154212] tracking-tight">{selectedPlot.height} cm</span>
              </div>
              <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#E1E3E2]">
                <span className="text-[9px] text-[#42493E] font-bold uppercase tracking-wider block">Leaf Count</span>
                <span className="font-sans font-bold text-lg text-[#154212] tracking-tight">{selectedPlot.leafCount} Leaves</span>
              </div>
              <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#E1E3E2]">
                <span className="text-[9px] text-[#42493E] font-bold uppercase tracking-wider block">Soil Moisture</span>
                <span className="font-sans font-bold text-lg text-[#154212] tracking-tight flex items-center gap-1">
                  <Droplet className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  {selectedPlot.moisture}%
                </span>
              </div>
              <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#E1E3E2]">
                <span className="text-[9px] text-[#42493E] font-bold uppercase tracking-wider block">Physiology Stage</span>
                <span className="font-sans font-bold text-sm text-[#154212] truncate block" title={selectedPlot.stage}>
                  {selectedPlot.stage}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-xs text-[#42493E] font-sans px-1">
              <div className="flex justify-between">
                <span className="font-medium uppercase tracking-wider text-[10px]">Health Index:</span>
                <strong className={selectedPlot.status === 'Healthy' ? 'text-[#154212] uppercase' : selectedPlot.status === 'Irrigating' ? 'text-blue-600 uppercase' : 'text-error uppercase'}>
                  {selectedPlot.status === 'Healthy' ? 'Optimal (100%)' : selectedPlot.status === 'Irrigating' ? 'Watering' : 'Stress'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="font-medium uppercase tracking-wider text-[10px]">Temperature:</span>
                <strong className="text-[#191c1c]">{selectedPlot.temperature}°C</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-medium uppercase tracking-wider text-[10px]">Last Handshake:</span>
                <strong className="text-[#191c1c]">{selectedPlot.lastWatered}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-medium uppercase tracking-wider text-[10px]">Active Treatments:</span>
                <span className="font-bold text-[#154212] text-right truncate max-w-[200px]">
                  {selectedPlot.fertilizer ? 'Fertilizer ' : ''}
                  {selectedPlot.weedControl ? 'Weed-Mgmt ' : ''}
                  {selectedPlot.pestControl ? 'Pest-Prev' : ''}
                  {!selectedPlot.fertilizer && !selectedPlot.weedControl && !selectedPlot.pestControl ? 'None' : ''}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onWaterPlot(selectedPlot.id);
                  setSelectedPlot({
                    ...selectedPlot,
                    status: 'Irrigating',
                    moisture: 85,
                    lastWatered: 'Just Now'
                  });
                }}
                disabled={selectedPlot.status === 'Irrigating'}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Droplet className="w-4 h-4" />
                {selectedPlot.status === 'Irrigating' ? 'Watering...' : 'Water Now'}
              </button>
              <button
                onClick={() => {
                  onAddLogForPlot(selectedPlot.id);
                  setSelectedPlot(null);
                }}
                className="flex-1 py-3 px-4 bg-[#154212] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#2d5a27] transition-all cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Add Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
