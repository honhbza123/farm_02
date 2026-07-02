/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, ClipboardList, TrendingUp, Plus } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onFabClick: () => void;
}

export default function BottomNav({ currentTab, onChangeTab, onFabClick }: BottomNavProps) {
  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white border-t border-[#C2C9BB] z-40 flex justify-around items-center px-2 pb-safe shadow-lg select-none">
        
        {/* Dashboard Tab */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'dashboard'
              ? 'bg-[#154212] text-white font-bold px-4 shadow-sm'
              : 'text-[#3F4A3D] hover:bg-[#F3F6F2]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium tracking-wide">Dashboard</span>
        </button>

        {/* Data Log Tab */}
        <button
          onClick={() => onChangeTab('datalog')}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'datalog'
              ? 'bg-[#154212] text-white font-bold px-4 shadow-sm'
              : 'text-[#3F4A3D] hover:bg-[#F3F6F2]'
          }`}
        >
          <ClipboardList className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium tracking-wide">Data Log</span>
        </button>

        {/* Analytics Tab */}
        <button
          onClick={() => onChangeTab('analytics')}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'analytics'
              ? 'bg-[#154212] text-white font-bold px-4 shadow-sm'
              : 'text-[#3F4A3D] hover:bg-[#F3F6F2]'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium tracking-wide">Analytics</span>
        </button>
      </nav>

      {/* Floating Action Button for Mobile Contextual Add */}
      {currentTab !== 'datalog' && (
        <button
          onClick={onFabClick}
          className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-primary text-on-primary shadow-xl flex items-center justify-center z-40 active:scale-95 transition-all hover:bg-primary-container cursor-pointer"
          title="New Observation Log"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
