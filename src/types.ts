/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VarietyKey = 'PAC789' | 'Suwan 5720' | 'CP S8' | 'DEKALB 8899S';
export type ShortVarietyKey = 'P789' | 'S5720' | 'CPS8' | 'D8899';

export type PlotStatus = 'Healthy' | 'Issue' | 'Irrigating';

export interface Plot {
  id: number;
  variety: VarietyKey;
  shortVariety: ShortVarietyKey;
  status: PlotStatus;
  height: number;
  leafCount: number;
  stage: string;
  moisture: number; // in %
  temperature: number; // in °C
  lastWatered: string; // duration or format
  fertilizer: boolean;
  weedControl: boolean;
  pestControl: boolean;
}

export interface ObservationLog {
  id: string;
  plotId: number;
  variety: VarietyKey;
  irrigationType: 'AWD' | 'Drip' | 'Mini';
  plantHeight: number;
  leafCount: number;
  growthStage: string;
  fertilizer: boolean;
  weedManagement: boolean;
  pestPrevention: boolean;
  timestamp: string;
  photos: string[];
  notes?: string;
}

export interface IrrigationSystem {
  name: string;
  type: 'AWD' | 'Drip' | 'Mini';
  status: 'ON' | 'IDLE' | 'MAINTENANCE';
  details: string;
}
