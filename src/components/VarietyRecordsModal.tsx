/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Sprout, Award, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import { VARIETIES } from '../data';

interface VarietyRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VarietyRecordsModal({ isOpen, onClose }: VarietyRecordsModalProps) {
  if (!isOpen) return null;

  const specs = [
    {
      name: 'PAC789',
      fullName: 'Pacific Seeds PAC789 Hybrid',
      type: 'Single-cross Hybrid Field Corn',
      daysToMaturity: '110 - 115 Days',
      gddTarget: '1,450 °C-day',
      irrigationPref: 'Alternate Wetting & Drying (AWD)',
      strengths: ['Drought tolerance', 'Exceptional stalk strength', 'High shell percentage'],
      description: 'PAC789 is the industry standard for dry-zone agronomy. It exhibits superior resistance to stalk rot and has optimized performance under water-saving AWD scheduling, showing only 3% yield loss with 25% water conservation.',
      avatarBg: 'bg-primary'
    },
    {
      name: 'Suwan 5720',
      fullName: 'Suwan 5720 Golden Quality',
      type: 'Open Pollinated / Synthetic Variety',
      daysToMaturity: '115 - 120 Days',
      gddTarget: '1,500 °C-day',
      irrigationPref: 'Drip Irrigation',
      strengths: ['Downy mildew resistance', 'Adaptability to poor soils', 'Low seed cost'],
      description: 'Developed locally for tropical clay-loams, Suwan 5720 is highly stable across changing weather conditions. It thrives under steady localized drip lines where nutrient fertigation can be precisely delivered.',
      avatarBg: 'bg-blue-500'
    },
    {
      name: 'CP S8',
      fullName: 'Charoen Pokphand CP-S8 Elite',
      type: 'Triple-cross Industrial Hybrid',
      daysToMaturity: '105 - 110 Days',
      gddTarget: '1,380 °C-day',
      irrigationPref: 'Mini Sprinkler & Rainfed',
      strengths: ['Rapid early vigor', 'Large ear sizes', 'Excellent fodder potential'],
      description: 'CP S8 is renowned for fast seedling emergence and robust foliage formation. It is highly suited for high-density planting and responsive to short-interval micro-sprinklers in sandy-loam soils.',
      avatarBg: 'bg-[#eab308]'
    },
    {
      name: 'DEKALB 8899S',
      fullName: 'Bayer DEKALB 8899S Premium',
      type: 'Bt-Trait Advanced Hybrid',
      daysToMaturity: '118 - 125 Days',
      gddTarget: '1,520 °C-day',
      irrigationPref: 'Drip Irrigation / AWD',
      strengths: ['Fall Armyworm protection', 'Fodder yield', 'Starch density'],
      description: 'Equipped with transgenic protection against lepidopteran pests, DEKALB 8899S significantly lowers pesticide expenses. Highly recommended for zones experiencing seasonal pest pressure.',
      avatarBg: 'bg-[#a855f7]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Content */}
      <div className="bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl w-full max-w-3xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F3F4F3] border-b-2 border-[#C2C9BB]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#154212]" />
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em]">Variety Specification Reference</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#E1E3E2] rounded-full text-[#42493E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <p className="text-xs text-[#42493E] font-sans font-medium leading-relaxed bg-[#F9FAF8] p-3.5 rounded-xl border border-[#C2C9BB] italic">
            ℹ️ These agricultural specifications guide crop monitoring, GDD calculation targets, and treatment responses for the current experimental trial period in Phu Ruea, Loei Province.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specs.map((item) => {
              const staticVar = VARIETIES.find(v => v.key === item.name);
              return (
                <div 
                  key={item.name} 
                  className="bg-white rounded-xl p-5 border-2 border-[#C2C9BB] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3 pb-2 border-b border-[#E1E3E2]">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-white uppercase ${item.avatarBg}`}>
                          {item.name}
                        </span>
                        <h4 className="font-sans font-bold text-sm text-[#154212] mt-1.5">{item.fullName}</h4>
                      </div>
                      <Sprout className="w-5 h-5 text-[#154212] shrink-0 ml-2" />
                    </div>

                    <div className="space-y-2 text-xs text-[#42493E] font-sans pb-3 border-b border-[#E1E3E2]">
                      <p><strong>Class:</strong> {item.type}</p>
                      <p><strong>Days to Harvest:</strong> {item.daysToMaturity}</p>
                      <p><strong>Accumulative GDD:</strong> {item.gddTarget}</p>
                      <p><strong>Watering Standard:</strong> {item.irrigationPref}</p>
                    </div>

                    <p className="text-xs text-[#42493E] font-serif mt-3 leading-relaxed italic">
                      "{item.description}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E1E3E2]">
                    <p className="text-[9px] font-bold text-[#154212] mb-2 tracking-wider uppercase">Key Strengths</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.strengths.map((str, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center gap-1 bg-[#154212]/5 text-[#154212] text-[10px] px-2 py-0.5 rounded-lg font-bold border border-[#154212]/15"
                        >
                          <CheckCircle className="w-2.5 h-2.5 text-[#154212]" />
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F3F4F3] border-t-2 border-[#C2C9BB] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-[#154212] text-white font-bold text-xs rounded-xl hover:bg-[#20521c] transition-all cursor-pointer shadow-md uppercase tracking-wider"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
