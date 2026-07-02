/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import VarietyRecordsModal from './components/VarietyRecordsModal';
import DashboardView from './components/DashboardView';
import DataLogView from './components/DataLogView';
import AnalyticsView from './components/AnalyticsView';
import LoginView from './components/LoginView';

import { Plot, ObservationLog, IrrigationSystem } from './types';
import { 
  INITIAL_PLOTS, 
  INITIAL_IRRIGATION_SYSTEMS, 
  INITIAL_LOGS 
} from './data';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('agri_cms_authenticated') === 'true';
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isVarietyModalOpen, setIsVarietyModalOpen] = useState<boolean>(false);

  // Core App State
  const [plots, setPlots] = useState<Plot[]>(() => {
    const saved = localStorage.getItem('agri_plots');
    return saved ? JSON.parse(saved) : INITIAL_PLOTS;
  });

  const [irrigationSystems, setIrrigationSystems] = useState<IrrigationSystem[]>(() => {
    const saved = localStorage.getItem('agri_irrigation');
    return saved ? JSON.parse(saved) : INITIAL_IRRIGATION_SYSTEMS;
  });

  const [submittedLogs, setSubmittedLogs] = useState<ObservationLog[]>(() => {
    const saved = localStorage.getItem('agri_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [trialDay, setTrialDay] = useState<number>(() => {
    const saved = localStorage.getItem('agri_trial_day');
    return saved ? parseInt(saved, 10) : 68; // Matching "Day 68 of 120"
  });

  // Contextual plot selection between views
  const [preselectedPlotId, setPreselectedPlotId] = useState<number | null>(null);

  // Save states to local storage on modification
  useEffect(() => {
    localStorage.setItem('agri_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem('agri_irrigation', JSON.stringify(irrigationSystems));
  }, [irrigationSystems]);

  useEffect(() => {
    localStorage.setItem('agri_logs', JSON.stringify(submittedLogs));
  }, [submittedLogs]);

  useEffect(() => {
    localStorage.setItem('agri_trial_day', trialDay.toString());
  }, [trialDay]);

  // Handler to toggle an irrigation system ON/OFF/RESOLVE
  const handleToggleIrrigation = (type: 'AWD' | 'Drip' | 'Mini') => {
    setIrrigationSystems(prev => prev.map(sys => {
      if (sys.type === type) {
        if (sys.status === 'MAINTENANCE') {
          return {
            ...sys,
            status: 'IDLE',
            details: 'Calibrated & Idle'
          };
        }
        
        const nextOn = sys.status !== 'ON';
        return {
          ...sys,
          status: nextOn ? 'ON' : 'IDLE',
          details: nextOn ? `Active Zones 1-6` : `Scheduled for ${type === 'Drip' ? '18:00' : '22:00'}`
        };
      }
      return sys;
    }));

    // If turned ON, automatically water corresponding plots!
    if (type === 'AWD') {
      setPlots(prevPlots => prevPlots.map(p => {
        // AWD assigned plots
        if (p.id % 3 === 1) {
          return { ...p, status: 'Irrigating', moisture: 85, lastWatered: 'Just Now' };
        }
        return p;
      }));
    } else if (type === 'Drip') {
      setPlots(prevPlots => prevPlots.map(p => {
        // Drip assigned plots
        if (p.id % 3 === 2) {
          return { ...p, status: 'Irrigating', moisture: 88, lastWatered: 'Just Now' };
        }
        return p;
      }));
    }
  };

  // Handlers for plotting actions
  const handleWaterPlot = (plotId: number) => {
    setPlots(prev => prev.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          status: 'Irrigating',
          moisture: 85,
          lastWatered: 'Just Now'
        };
      }
      return p;
    }));
  };

  const handleAddLogForPlot = (plotId: number) => {
    setPreselectedPlotId(plotId);
    setCurrentTab('datalog');
  };

  // Handler when a user submits a completed observation log
  const handleAddLog = (newLogData: Omit<ObservationLog, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newLog: ObservationLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
      timestamp
    };

    setSubmittedLogs(prev => [newLog, ...prev]);

    // Also update the physical plot measurements in real-time plot list state!
    setPlots(prev => prev.map(p => {
      if (p.id === newLogData.plotId) {
        return {
          ...p,
          height: newLogData.plantHeight,
          leafCount: newLogData.leafCount,
          stage: newLogData.growthStage,
          fertilizer: newLogData.fertilizer,
          weedControl: newLogData.weedManagement,
          pestControl: newLogData.pestPrevention,
          status: 'Healthy', // resolves dry alerts upon submission
          moisture: Math.min(95, p.moisture + 10) // raises moisture slightly as treatment
        };
      }
      return p;
    }));
  };

  const handleAdvanceDay = () => {
    if (trialDay < 120) {
      setTrialDay(prev => prev + 1);
      
      // Randomly trigger dry stress issue on 1-2 plots upon advancing, simulating scientific changes!
      const randomPlotIndex = Math.floor(Math.random() * 36) + 1;
      setPlots(prev => prev.map(p => {
        if (p.id === randomPlotIndex) {
          return {
            ...p,
            status: 'Issue',
            moisture: 32 // dry tension alert
          };
        }
        return p;
      }));
    } else {
      alert("Trial has completed the full 120-day test timeline! Final yield metrics are ready for export.");
    }
  };

  const handleFabClick = () => {
    setCurrentTab('datalog');
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-sans overflow-x-hidden pb-20 md:pb-0">
      
      {/* Top Main Navigation Bar */}
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        currentTab={currentTab} 
        onLogout={() => {
          localStorage.removeItem('agri_cms_authenticated');
          setIsAuthenticated(false);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Navigation Sidebar Drawer (Desktop Only) */}
        {isSidebarOpen && (
          <Sidebar 
            currentTab={currentTab} 
            onChangeTab={setCurrentTab}
            openVarietyModal={() => setIsVarietyModalOpen(true)}
            onAdvanceDay={handleAdvanceDay}
            trialDay={trialDay}
          />
        )}

        {/* Main Content Canvas with grid pattern background */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 plot-grid-pattern pb-24 md:pb-12 min-h-[calc(100vh-64px)]">
          <div className="max-w-5xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView 
                plots={plots}
                irrigationSystems={irrigationSystems}
                onToggleIrrigation={handleToggleIrrigation}
                onWaterPlot={handleWaterPlot}
                onAddLogForPlot={handleAddLogForPlot}
                onChangeTab={setCurrentTab}
              />
            )}

            {currentTab === 'datalog' && (
              <DataLogView 
                plots={plots}
                onAddLog={handleAddLog}
                preselectedPlotId={preselectedPlotId}
                clearPreselectedPlotId={() => setPreselectedPlotId(null)}
                submittedLogs={submittedLogs}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView 
                plots={plots}
                trialDay={trialDay}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <BottomNav 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        onFabClick={handleFabClick} 
      />

      {/* Variety specs reference Modal */}
      <VarietyRecordsModal 
        isOpen={isVarietyModalOpen} 
        onClose={() => setIsVarietyModalOpen(false)} 
      />

    </div>
  );
}
