/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Sprout, 
  ClipboardList, 
  Droplets, 
  Database, 
  TrendingUp, 
  Settings, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  openVarietyModal: () => void;
  onAdvanceDay: () => void;
  trialDay: number;
}

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  openVarietyModal, 
  onAdvanceDay,
  trialDay 
}: SidebarProps) {
  
  const progressPercent = Math.min(100, Math.round((trialDay / 120) * 100));

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-[#F3F4F3] p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0 select-none">
      
      {/* Navigation Title */}
      <div className="text-[10px] font-bold text-[#42493E] uppercase tracking-[0.2em] mb-4 px-1">
        Navigation
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 cursor-pointer ${
            currentTab === 'dashboard'
              ? 'bg-[#154212] text-white font-medium shadow-md shadow-[#154212]/20'
              : 'text-[#42493E] hover:bg-[#E1E3E2]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span className="text-sm font-medium">Field Overview</span>
        </button>

        <button
          onClick={() => onChangeTab('datalog')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 cursor-pointer ${
            currentTab === 'datalog'
              ? 'bg-[#154212] text-white font-medium shadow-md shadow-[#154212]/20'
              : 'text-[#42493E] hover:bg-[#E1E3E2]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-sm font-medium">Data Logging</span>
        </button>

        <button
          onClick={() => {
            onChangeTab('dashboard');
            setTimeout(() => {
              const element = document.getElementById('irrigation-panel');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('ring-2', 'ring-[#154212]', 'ring-offset-2');
                setTimeout(() => element.classList.remove('ring-2', 'ring-[#154212]', 'ring-offset-2'), 2500);
              }
            }, 100);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 hover:bg-[#E1E3E2] text-[#42493E] cursor-pointer"
        >
          <Droplets className="w-4 h-4 text-[#42493E]" />
          <span className="text-sm font-medium">Irrigation Control</span>
        </button>

        <button
          onClick={openVarietyModal}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 hover:bg-[#E1E3E2] text-[#42493E] cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#42493E]" />
          <span className="text-sm font-medium">Variety Archive</span>
        </button>

        <button
          onClick={() => onChangeTab('analytics')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 cursor-pointer ${
            currentTab === 'analytics'
              ? 'bg-[#154212] text-white font-medium shadow-md shadow-[#154212]/20'
              : 'text-[#42493E] hover:bg-[#E1E3E2]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Analytics</span>
        </button>

        <div className="pt-4 mt-4 border-t border-outline-variant/50">
          <button
            onClick={() => {
              alert("Settings panel: Simulated database configuration is saved locally. Zone telemetry frequency set to 15s.");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 hover:bg-[#E1E3E2] text-[#42493E] cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Trial Status Widget / Active Plot Widget from Layout */}
      <div className="space-y-4 mt-auto pt-6">
        <div className="p-4 bg-white rounded-xl border border-outline-variant shadow-xs">
          <p className="text-[10px] font-bold text-[#42493E] uppercase mb-1">Active Plot</p>
          <p className="text-sm font-bold text-[#154212]">RCBD-36 / AWD</p>
          <div className="mt-2 w-full bg-[#E1E3E2] h-1.5 rounded-full overflow-hidden">
            <div className="w-3/4 bg-[#154212] h-full rounded-full"></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-outline-variant shadow-xs relative overflow-hidden group">
          <p className="text-[10px] font-bold text-[#42493E] uppercase flex items-center justify-between mb-1.5 font-sans">
            <span>Trial Progress</span>
            <span className="text-[8px] bg-[#154212] text-white px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
              Active
            </span>
          </p>
          
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span className="text-[10px] font-mono font-bold text-[#42493E] uppercase tracking-wider">
              Day {trialDay} of 120
            </span>
          </div>

          <div className="w-full bg-[#E1E3E2] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-[#154212] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/30">
            <button 
              onClick={onAdvanceDay}
              className="text-[10px] text-[#154212] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              title="Advance timeline for testing analytics"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              Advance Day
            </button>
            <span className="text-[9px] font-mono font-bold text-[#42493E]">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
