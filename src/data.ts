/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plot, VarietyKey, ShortVarietyKey, ObservationLog, IrrigationSystem } from './types';

export const VARIETIES: { key: VarietyKey; short: ShortVarietyKey; color: string; border: string; bg: string }[] = [
  { key: 'PAC789', short: 'P789', color: 'bg-primary', border: 'border-primary', bg: 'bg-[#154212]' },
  { key: 'Suwan 5720', short: 'S5720', color: 'bg-blue-500', border: 'border-blue-500', bg: 'bg-blue-500' },
  { key: 'CP S8', short: 'CPS8', color: 'bg-[#eab308]', border: 'border-[#eab308]', bg: 'bg-[#eab308]' },
  { key: 'DEKALB 8899S', short: 'D8899', color: 'bg-[#a855f7]', border: 'border-[#a855f7]', bg: 'bg-[#a855f7]' },
];

export const getVarietyColor = (v: VarietyKey): string => {
  switch (v) {
    case 'PAC789': return '#154212';
    case 'Suwan 5720': return '#3a82f6';
    case 'CP S8': return '#eab308';
    case 'DEKALB 8899S': return '#a855f7';
  }
};

export const getVarietyBgClass = (v: VarietyKey): string => {
  switch (v) {
    case 'PAC789': return 'bg-primary text-on-primary';
    case 'Suwan 5720': return 'bg-blue-500 text-white';
    case 'CP S8': return 'bg-[#eab308] text-white';
    case 'DEKALB 8899S': return 'bg-[#a855f7] text-white';
  }
};

// Map exact plot structure from image 3
const mapPlotVarietyAndStatus = (id: number): { variety: VarietyKey; short: ShortVarietyKey; status: 'Healthy' | 'Issue' | 'Irrigating' } => {
  // Mapping precisely as shown in the visual template image 3
  if (id === 1) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 2) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 3) return { variety: 'Suwan 5720', short: 'S5720', status: 'Issue' };
  if (id === 4) return { variety: 'Suwan 5720', short: 'S5720', status: 'Issue' };
  if (id === 5) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 6) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 7) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 8) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 9) return { variety: 'PAC789', short: 'P789', status: 'Issue' };
  if (id === 10) return { variety: 'PAC789', short: 'P789', status: 'Irrigating' };
  if (id === 11) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 12) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 13) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 14) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 15) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 16) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 17) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 18) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 19) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 20) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 21) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 22) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 23) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 24) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 25) return { variety: 'Suwan 5720', short: 'S5720', status: 'Issue' };
  if (id === 26) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  if (id === 27) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 28) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 29) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 30) return { variety: 'DEKALB 8899S', short: 'D8899', status: 'Healthy' };
  if (id === 31) return { variety: 'Suwan 5720', short: 'S5720', status: 'Irrigating' };
  if (id === 32) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 33) return { variety: 'PAC789', short: 'P789', status: 'Healthy' };
  if (id === 34) return { variety: 'Suwan 5720', short: 'S5720', status: 'Healthy' };
  if (id === 35) return { variety: 'CP S8', short: 'CPS8', status: 'Healthy' };
  // Default fallback or final items
  return { variety: 'CP S8', short: 'CPS8', status: 'Issue' };
};

export const INITIAL_PLOTS: Plot[] = Array.from({ length: 36 }, (_, i) => {
  const id = i + 1;
  const mapping = mapPlotVarietyAndStatus(id);
  
  // Height variation based on variety
  let baseHeight = 125.5;
  if (mapping.variety === 'PAC789') baseHeight = 132.4;
  else if (mapping.variety === 'Suwan 5720') baseHeight = 118.9;
  else if (mapping.variety === 'CP S8') baseHeight = 142.1;
  else baseHeight = 105.2;

  const heightOffset = Number((Math.sin(id) * 15).toFixed(1));
  const finalHeight = Number((baseHeight + heightOffset).toFixed(1));

  // Leaf count variation
  const leafCount = Math.floor(12 + (id % 5));

  // Moisture variation based on status
  let moisture = 62;
  if (mapping.status === 'Irrigating') moisture = 85;
  else if (mapping.status === 'Issue') moisture = 38; // Dry soil alert

  return {
    id,
    variety: mapping.variety,
    shortVariety: mapping.short,
    status: mapping.status,
    height: finalHeight,
    leafCount,
    stage: id % 3 === 0 ? 'VT (Tasseling)' : (id % 5 === 0 ? 'R1 (Silking)' : 'V6 (Sixth leaf)'),
    moisture,
    temperature: Number((27.5 + (Math.cos(id) * 1.5)).toFixed(1)),
    lastWatered: mapping.status === 'Irrigating' ? 'Just Now' : `${(id % 6) + 1} hours ago`,
    fertilizer: id % 2 === 0,
    weedControl: id % 3 !== 0,
    pestControl: id % 4 !== 0,
  };
});

// Growth trends over 8 weeks
export const GROWTH_TRENDS = [
  { label: 'Week 1', PAC789: 5, Suwan: 4, CPS8: 6 },
  { label: 'Week 2', PAC789: 12, Suwan: 10, CPS8: 15 },
  { label: 'Week 3', PAC789: 28, Suwan: 24, CPS8: 32 },
  { label: 'Week 4', PAC789: 45, Suwan: 40, CPS8: 52 },
  { label: 'Week 5', PAC789: 78, Suwan: 72, CPS8: 85 },
  { label: 'Week 6', PAC789: 110, Suwan: 102, CPS8: 120 },
  { label: 'Week 7', PAC789: 145, Suwan: 138, CPS8: 158 },
  { label: 'Week 8', PAC789: 182, Suwan: 175, CPS8: 195 },
];

// Irrigation efficiency data (Liters / kg)
export const IRRIGATION_EFFICIENCY = [
  { name: 'AWD System', index: 142, color: '#154212' },
  { name: 'Drip System', index: 185, color: '#4a6549' },
  { name: 'Mini Sprinkler', index: 168, color: '#c2c9bb' },
];

export const INITIAL_LOGS: ObservationLog[] = [
  {
    id: 'log-1',
    plotId: 9,
    variety: 'PAC789',
    irrigationType: 'AWD',
    plantHeight: 122.4,
    leafCount: 13,
    growthStage: 'V6 (Sixth leaf)',
    fertilizer: true,
    weedManagement: false,
    pestPrevention: true,
    timestamp: '2026-07-01 10:15 AM',
    photos: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBgr5HOytEhKRLQIG9HHX0ulNBt5IhErMgFXXnOWRR97Yv5v5R_0NksIRkskLc7i_UuASV4G5XsevGOxsT4Q6uMX0B0R1a2Zg-UvesJiOoEgIbvLjVfGWgpU_y8YtwjajJaaiHufjjgozQso4eqH6IhzzeO17zPsOJITX2-Xj-gQ2MUB_vqSgHAFnFgnYh1zTQmpQBSR2Tb6d_6W3iN4L8XIcJ5WTbqYXfE-flblTkzhQMtEYmJbGCa'],
    notes: 'Mild weed pressure observed in row 3. Height is on track.'
  },
  {
    id: 'log-2',
    plotId: 3,
    variety: 'Suwan 5720',
    irrigationType: 'Drip',
    plantHeight: 110.5,
    leafCount: 12,
    growthStage: 'V6 (Sixth leaf)',
    fertilizer: true,
    weedManagement: true,
    pestPrevention: false,
    timestamp: '2026-06-30 02:40 PM',
    photos: [],
    notes: 'Soil tension slightly high. Monitored drip emitter spacing.'
  }
];

export const INITIAL_IRRIGATION_SYSTEMS: IrrigationSystem[] = [
  { name: 'AWD (Alternate)', type: 'AWD', status: 'ON', details: 'Active Zone 1-4' },
  { name: 'Drip Irrigation', type: 'Drip', status: 'IDLE', details: 'Scheduled for 18:00' },
  { name: 'Mini Sprinkler', type: 'Mini', status: 'MAINTENANCE', details: 'Maintenance Mode' },
];
