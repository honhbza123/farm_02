/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, User, LogOut, Shield, Award } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentTab: string;
  onLogout?: () => void;
}

export default function Header({ onToggleSidebar, currentTab, onLogout }: HeaderProps) {
  const [showProfilePopover, setShowProfilePopover] = useState(false);

  return (
    <header className="w-full top-0 sticky bg-white border-b border-[#C2C9BB] flex items-center justify-between px-4 md:px-8 h-16 z-40 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-[#F3F4F3] rounded-xl transition-colors cursor-pointer text-[#154212]"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#154212] rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#154212] font-sans">AGRI RESEARCH CMS</span>
          <span className="hidden sm:inline-block h-4 w-[1px] bg-[#C2C9BB]"></span>
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-[#42493e] bg-[#F3F4F3] border border-[#C2C9BB] px-2.5 py-0.5 rounded-lg">
            {currentTab === 'dashboard' ? 'Field Overview' : currentTab === 'datalog' ? 'Data Log' : 'Analytics'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#42493e]">Authorized Personnel</p>
          <p className="text-sm font-bold text-[#154212]">Dr. Eleanor Cornwell</p>
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowProfilePopover(!showProfilePopover)}
            className="w-10 h-10 rounded-full bg-[#a1d494] border-2 border-[#154212] flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-sm"
          >
            <img 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              alt="Dr. Cornwell portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmgNiXiqKL0KxUMXdopr2Km742uADpY-vYMkv7YN7-ZsO5C8hWvuol2HNl9eXhoGvdVFnMEVRk5Eq6hDzHy9z5E7pMnZo0Nt-bkJd3chjm3KhwtHB6RqXbt8s9J6p-JGk3O0_K-gmA-cme_2A-P6ZEGWpEAhUeYisH8jKH_B2cHPVsV2vL1oWvhOD1G8ssCO11fT9McaJx1xvb_cs4QhUFiXUkZg4Aiw10dhv135DPLey2UeL1vsB8"
            />
          </button>

          {/* Profile Popover */}
          {showProfilePopover && (
            <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E1E3E2]">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#154212]">
                  <img 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    alt="Dr. Cornwell portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmgNiXiqKL0KxUMXdopr2Km742uADpY-vYMkv7YN7-ZsO5C8hWvuol2HNl9eXhoGvdVFnMEVRk5Eq6hDzHy9z5E7pMnZo0Nt-bkJd3chjm3KhwtHB6RqXbt8s9J6p-JGk3O0_K-gmA-cme_2A-P6ZEGWpEAhUeYisH8jKH_B2cHPVsV2vL1oWvhOD1G8ssCO11fT9McaJx1xvb_cs4QhUFiXUkZg4Aiw10dhv135DPLey2UeL1vsB8"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#154212]">Dr. Eleanor Cornwell</h4>
                  <p className="text-xs text-[#42493E] font-mono">e.cornwell@agri-core.edu</p>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#42493E]">
                  <Shield className="w-3.5 h-3.5 text-[#154212]" />
                  <span>Role: <strong className="text-[#154212]">Principal Investigator</strong></span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#42493E]">
                  <Award className="w-3.5 h-3.5 text-[#154212]" />
                  <span>Affiliation: <strong className="text-[#154212]">Agronomy Research Core</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E1E3E2] mt-1">
                <button 
                  onClick={() => {
                    setShowProfilePopover(false);
                    if (onLogout) {
                      onLogout();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-error hover:bg-error-container/20 rounded-xl transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Lock Workstation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
