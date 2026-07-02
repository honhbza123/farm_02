/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Trash2, 
  Save, 
  Send, 
  Upload, 
  Sparkles, 
  FileText, 
  Check, 
  X,
  Bug,
  Droplet,
  Flame,
  FileCheck
} from 'lucide-react';
import { Plot, ObservationLog, VarietyKey } from '../types';

interface DataLogViewProps {
  plots: Plot[];
  onAddLog: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
  preselectedPlotId: number | null;
  clearPreselectedPlotId: () => void;
  submittedLogs: ObservationLog[];
}

export default function DataLogView({
  plots,
  onAddLog,
  preselectedPlotId,
  clearPreselectedPlotId,
  submittedLogs
}: DataLogViewProps) {
  
  // Form States
  const [selectedPlotId, setSelectedPlotId] = useState<number>(1);
  const [irrigationType, setIrrigationType] = useState<'AWD' | 'Drip' | 'Mini'>('AWD');
  const [plantHeight, setPlantHeight] = useState<string>('125.5');
  const [leafCount, setLeafCount] = useState<string>('14');
  const [growthStage, setGrowthStage] = useState<string>('VE (Emergence)');
  
  const [fertilizer, setFertilizer] = useState<boolean>(false);
  const [weedManagement, setWeedManagement] = useState<boolean>(false);
  const [pestPrevention, setPestPrevention] = useState<boolean>(false);
  
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBgr5HOytEhKRLQIG9HHX0ulNBt5IhErMgFXXnOWRR97Yv5v5R_0NksIRkskLc7i_UuASV4G5XsevGOxsT4Q6uMX0B0R1a2Zg-UvesJiOoEgIbvLjVfGWgpU_y8YtwjajJaaiHufjjgozQso4eqH6IhzzeO17zPsOJITX2-Xj-gQ2MUB_vqSgHAFnFgnYh1zTQmpQBSR2Tb6d_6W3iN4L8XIcJ5WTbqYXfE-flblTkzhQMtEYmJbGCa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAMo2uDgPn2wquv_y7HLpMjqwiZOs33Fk97-CxERZCA3kq-utSSYxpt9EMDqmIveMn3eG-eyqIfuS29uwB2gMHKqTODl3qJEs5p5g8pjmEJ_k-OT8Y4Ume3ovbTOCpyUrD64SD1_0Xhf_7aCuaV-QZL9Amyh4k1Spa46GypY3bRAMDBy41eWEQmsdyhYb0UCNmfEsJgobvgC1C85WiILE4uSxr8UiXQWksG4FYb_97DYYjzeh2cADx4'
  ]);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If a plot is preselected from Dashboard, populate the form instantly
  useEffect(() => {
    if (preselectedPlotId !== null) {
      const p = plots.find(x => x.id === preselectedPlotId);
      if (p) {
        setSelectedPlotId(p.id);
        setPlantHeight(p.height.toString());
        setLeafCount(p.leafCount.toString());
        setGrowthStage(p.stage);
        setFertilizer(p.fertilizer);
        setWeedManagement(p.weedControl);
        setPestPrevention(p.pestControl);
        
        // Match irrigation style
        if (p.id % 3 === 1) setIrrigationType('AWD');
        else if (p.id % 3 === 2) setIrrigationType('Drip');
        else setIrrigationType('Mini');
        
        showToast(`Loaded metrics for Plot ${p.id}`, 'info');
      }
      clearPreselectedPlotId();
    }
  }, [preselectedPlotId]);

  // Handle changing plot dropdown selection manually
  const handlePlotChange = (id: number) => {
    setSelectedPlotId(id);
    const p = plots.find(x => x.id === id);
    if (p) {
      setPlantHeight(p.height.toString());
      setLeafCount(p.leafCount.toString());
      setGrowthStage(p.stage);
      setFertilizer(p.fertilizer);
      setWeedManagement(p.weedControl);
      setPestPrevention(p.pestControl);
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDiscard = () => {
    // reset form
    setSelectedPlotId(1);
    setIrrigationType('AWD');
    setPlantHeight('125.5');
    setLeafCount('14');
    setGrowthStage('VE (Emergence)');
    setFertilizer(false);
    setWeedManagement(false);
    setPestPrevention(false);
    setNotes('');
    showToast('Observation draft discarded successfully', 'info');
  };

  const handleSaveProgress = () => {
    // save to localStorage
    const draft = {
      selectedPlotId,
      irrigationType,
      plantHeight,
      leafCount,
      growthStage,
      fertilizer,
      weedManagement,
      pestPrevention,
      notes
    };
    localStorage.setItem('agri_log_draft', JSON.stringify(draft));
    showToast('Draft progress saved to scientific cache', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedHeight = parseFloat(plantHeight);
    const parsedLeaves = parseInt(leafCount, 10);

    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      showToast('Please specify a valid physiological plant height', 'error');
      return;
    }
    if (isNaN(parsedLeaves) || parsedLeaves <= 0) {
      showToast('Please specify a valid leaf count', 'error');
      return;
    }

    const currentPlot = plots.find(p => p.id === selectedPlotId);
    if (!currentPlot) return;

    onAddLog({
      plotId: selectedPlotId,
      variety: currentPlot.variety,
      irrigationType,
      plantHeight: parsedHeight,
      leafCount: parsedLeaves,
      growthStage,
      fertilizer,
      weedManagement,
      pestPrevention,
      photos,
      notes: notes || 'Scientific verification completed successfully.'
    });

    // Show success overlay modal
    setShowSuccessModal(true);
    
    // reset notes
    setNotes('');
  };

  // Simulated file upload
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotos([...photos, reader.result]);
          showToast(`File ${file.name} successfully encrypted & uploaded`, 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotos([...photos, reader.result]);
          showToast(`Dropped file ${file.name} successfully uploaded`, 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedPlotDetails = plots.find(p => p.id === selectedPlotId);

  return (
    <div className="space-y-8 select-none">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-top-4 duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-secondary-container/90 border-primary/20 text-[#002201]' 
            : toastMessage.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-error-container border-error/20 text-on-error-container'
        }`}>
          <Check className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C2C9BB]">
        <div className="max-w-2xl">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-[#154212] leading-[0.85] uppercase font-sans">
            NEW <span className="text-[#A1D494]">OBSERVATION</span>
          </h2>
          <p className="mt-4 text-base text-[#42493E] italic font-serif">
            Record physiological height metrics, leaf counts, and treatment verification for plot RCBD-{30 + selectedPlotId}.
          </p>
        </div>
        <div className="bg-white px-4 py-2 border-l-4 border-[#154212] shadow-xs shrink-0 self-start md:self-end">
          <span className="block text-[10px] font-bold text-[#42493E] uppercase tracking-widest">Operator Session</span>
          <span className="text-sm font-mono font-bold text-[#154212]">SOIL_SURVEY_FORM_V3</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Plot Identity (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-[#C2C9BB] rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              01. PLOT IDENTIFICATION
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#42493E] tracking-wider block ml-1 uppercase">
                  Plot ID / Variety
                </label>
                <select 
                  value={selectedPlotId}
                  onChange={(e) => handlePlotChange(parseInt(e.target.value, 10))}
                  className="w-full h-12 bg-[#F9FAF8] border-2 border-[#C2C9BB] rounded-xl px-4 font-sans text-sm font-bold text-[#154212] focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all cursor-pointer"
                >
                  {plots.map(p => (
                    <option key={p.id} value={p.id}>
                      Plot {p.id.toString().padStart(2, '0')} - {p.variety}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#42493E] tracking-wider block ml-1 uppercase">
                  Irrigation Type
                </label>
                <div className="flex h-12 bg-[#F9FAF8] rounded-xl border-2 border-[#C2C9BB] p-1">
                  {(['AWD', 'Drip', 'Mini'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIrrigationType(type)}
                      className={`flex-1 flex items-center justify-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                        irrigationType === type
                          ? 'bg-[#154212] text-white shadow-sm font-sans'
                          : 'text-[#42493E] hover:bg-[#E1E3E2]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#154212] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1D494] font-mono block">
                Research Context
              </span>
              <p className="font-sans font-bold text-2xl mt-2 tracking-tight">Phu Ruea District</p>
              <p className="text-xs opacity-90 font-sans italic font-serif">Loei Province | Zone A</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-mono opacity-80 uppercase tracking-wider">FIELD AREA</p>
                <p className="font-sans font-semibold text-base">~ 800 sq.m.</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono opacity-80 uppercase tracking-wider">EST. YIELD</p>
                <p className="font-sans font-semibold text-xs text-[#A1D494]">Optimized AWD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Physiological Metrics */}
        <div className="bg-white border border-[#C2C9BB] rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            02. PHYSIOLOGICAL MEASUREMENTS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#42493E] tracking-wider block ml-1 uppercase">
                Plant Height (CM)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={plantHeight}
                  onChange={(e) => setPlantHeight(e.target.value)}
                  className="w-full h-12 bg-[#F9FAF8] border-2 border-[#C2C9BB] rounded-xl pl-4 pr-12 text-sm font-mono font-bold focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all text-[#154212]"
                  placeholder="125.5"
                  required
                />
                <span className="absolute right-4 top-3 text-[#42493E] text-xs font-mono font-bold">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#42493E] tracking-wider block ml-1 uppercase">
                Leaf Count
              </label>
              <input 
                type="number" 
                value={leafCount}
                onChange={(e) => setLeafCount(e.target.value)}
                className="w-full h-12 bg-[#F9FAF8] border-2 border-[#C2C9BB] rounded-xl px-4 text-sm font-mono font-bold focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all text-[#154212]"
                placeholder="14"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#42493E] tracking-wider block ml-1 uppercase">
                Growth Stage
              </label>
              <select 
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full h-12 bg-[#F9FAF8] border-2 border-[#C2C9BB] rounded-xl px-4 text-sm font-sans font-bold focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all text-[#154212] cursor-pointer"
              >
                <option>VE (Emergence)</option>
                <option>V1 (First leaf)</option>
                <option>V6 (Sixth leaf)</option>
                <option>VT (Tasseling)</option>
                <option>R1 (Silking)</option>
                <option>R6 (Physiological Maturity)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Treatment Checklist & Photo (Asymmetric Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Column: Checklist */}
          <div className="lg:col-span-3 bg-white border border-[#C2C9BB] rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              03. TREATMENT VERIFICATION
            </h3>
            
            <div className="space-y-3">
              {/* Fertilizer Item */}
              <label className="flex items-center gap-4 p-4 rounded-xl bg-[#F9FAF8] border border-[#C2C9BB] hover:bg-white transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={fertilizer}
                  onChange={(e) => setFertilizer(e.target.checked)}
                  className="w-5 h-5 rounded text-[#154212] border-[#C2C9BB] focus:ring-[#154212] transition-all cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-sans font-bold text-sm text-[#154212]">Fertilizer Applied (15-15-15)</p>
                  <p className="text-[11px] text-[#42493E] font-mono">Dosage: 50 kg / Rai</p>
                </div>
                <Droplet className="w-5 h-5 text-[#C2C9BB] group-hover:text-[#154212] transition-colors" />
              </label>

              {/* Weed Management Item */}
              <label className="flex items-center gap-4 p-4 rounded-xl bg-[#F9FAF8] border border-[#C2C9BB] hover:bg-white transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={weedManagement}
                  onChange={(e) => setWeedManagement(e.target.checked)}
                  className="w-5 h-5 rounded text-[#154212] border-[#C2C9BB] focus:ring-[#154212] transition-all cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-sans font-bold text-sm text-[#154212]">Weed Management</p>
                  <p className="text-[11px] text-[#42493E] font-mono">Pre-emergence (Atrazine)</p>
                </div>
                <Flame className="w-5 h-5 text-[#C2C9BB] group-hover:text-[#154212] transition-colors" />
              </label>

              {/* Pest Prevention Item */}
              <label className="flex items-center gap-4 p-4 rounded-xl bg-[#F9FAF8] border border-[#C2C9BB] hover:bg-white transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={pestPrevention}
                  onChange={(e) => setPestPrevention(e.target.checked)}
                  className="w-5 h-5 rounded text-[#154212] border-[#C2C9BB] focus:ring-[#154212] transition-all cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-sans font-bold text-sm text-[#154212]">Pest Prevention</p>
                  <p className="text-[11px] text-[#42493E] font-mono">FAW Control (Chlorantraniliprole)</p>
                </div>
                <Bug className="w-5 h-5 text-[#C2C9BB] group-hover:text-[#154212] transition-colors" />
              </label>
            </div>

            {/* Scientific Notes Input */}
            <div className="mt-5 space-y-2">
              <label className="text-[10px] font-bold text-[#42493E] tracking-wider block uppercase ml-1">
                Observer Commentary / Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Enter field comments, soil conditions, weather notes, etc..."
                className="w-full bg-[#F9FAF8] border-2 border-[#C2C9BB] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#154212] focus:border-[#154212] text-[#154212] font-medium"
              />
            </div>
          </div>

          {/* Right Column: Visual Evidence */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#C2C9BB] rounded-2xl p-6 shadow-xs h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  04. VISUAL EVIDENCE
                </h3>
                
                <div 
                  onClick={triggerFileUpload}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-[#C2C9BB] hover:border-[#154212] rounded-xl flex flex-col items-center justify-center p-5 bg-[#F9FAF8] hover:bg-white transition-all cursor-pointer group select-none text-center"
                >
                  <Upload className="w-8 h-8 text-[#C2C9BB] group-hover:text-[#154212] mb-2 transition-transform duration-200 group-hover:-translate-y-1" />
                  <p className="text-xs font-bold text-[#154212]">Tap to upload plot photo</p>
                  <p className="text-[10px] text-[#42493E] mt-1 font-mono">Drag &amp; drop PNG/JPG • Max 10MB</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Photos Gallery thumbnails */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {photos.slice(0, 2).map((photoUrl, index) => (
                  <div key={index} className="aspect-square bg-surface-variant rounded-xl overflow-hidden border border-[#C2C9BB] relative group">
                    <img 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      alt={`Corn study evidence ${index + 1}`}
                      src={photoUrl} 
                    />
                    
                    {/* Add visual +2 badge like screenshot for the second item if there are more than 2 photos */}
                    {index === 1 && photos.length > 2 && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="text-white font-bold text-base">+{photos.length - 2}</span>
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotos(photos.filter((_, i) => i !== index));
                        showToast('Photo evidence deleted', 'info');
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-error rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Submission Action bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-[#C2C9BB] mt-6 select-none">
          <button 
            type="button"
            onClick={handleDiscard}
            className="order-2 md:order-1 text-[#42493E] hover:text-error hover:bg-error-container/20 font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          >
            <Trash2 className="w-4 h-4" />
            Discard Draft
          </button>
          
          <div className="order-1 md:order-2 flex gap-4 w-full md:w-auto">
            <button 
              type="button"
              onClick={handleSaveProgress}
              className="flex-1 md:flex-none border-2 border-[#154212] text-[#154212] font-bold hover:bg-[#F9FAF8] px-6 py-3 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </button>
            <button 
              type="submit"
              className="flex-1 md:flex-none bg-[#154212] text-white font-bold hover:shadow-lg active:scale-95 px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              Submit Log
            </button>
          </div>
        </div>

      </form>

      {/* Success Confirmation Overlay Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowSuccessModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>

          <div className="bg-white border-2 border-[#C2C9BB] shadow-2xl rounded-2xl w-full max-w-sm p-6 relative z-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#F9FAF8] text-[#154212] border-2 border-[#C2C9BB] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold animate-bounce">
              ✓
            </div>
            
            <h4 className="font-sans font-bold text-lg text-[#154212] uppercase tracking-tight">Observation Recorded</h4>
            <p className="text-xs text-[#42493E] font-sans mt-2 leading-relaxed">
              Log metrics for <strong>Plot {selectedPlotId.toString().padStart(2, '0')} ({selectedPlotDetails?.variety})</strong> have been encrypted and submitted to the Research database.
            </p>

            <div className="bg-[#F9FAF8] p-3 rounded-xl border border-[#C2C9BB] text-[11px] font-mono text-left space-y-1 mt-4 text-[#42493E]">
              <p><strong>Telemetry Stamp:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Plant Height:</strong> {plantHeight} cm</p>
              <p><strong>Stage:</strong> {growthStage}</p>
              <p><strong>Moisture Update:</strong> Soil sensor synced</p>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-5 py-3 bg-[#154212] text-white font-bold text-xs rounded-xl hover:bg-[#22571d] transition-all cursor-pointer shadow-sm uppercase tracking-wider"
            >
              Confirm Log Sync
            </button>
          </div>
        </div>
      )}

      {/* Observation Logs Feed / History list */}
      {submittedLogs.length > 0 && (
        <div className="bg-white border border-[#C2C9BB] rounded-2xl p-6 shadow-xs mt-8">
          <h3 className="text-xs font-bold text-[#154212] uppercase tracking-[0.2em] mb-4">
            05. RECENT OBSERVATIONS LOGGED
          </h3>
          <div className="divide-y divide-[#E1E3E2] space-y-4">
            {submittedLogs.map((log) => (
              <div key={log.id} className="pt-4 first:pt-0 flex items-start gap-4">
                <span className="w-8 h-8 rounded bg-[#F9FAF8] border border-[#C2C9BB] text-[#154212] text-xs font-bold font-mono flex items-center justify-center shrink-0">
                  {log.plotId}
                </span>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 className="font-bold text-sm text-[#154212] font-sans">
                      {log.variety} — <span className="text-[#42493E] italic font-normal font-serif text-xs">{log.growthStage}</span>
                    </h5>
                    <span className="text-[10px] text-[#42493E] font-mono font-semibold">{log.timestamp}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <span className="bg-[#F9FAF8] border border-[#C2C9BB] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#42493E]">
                      Irrigation: {log.irrigationType}
                    </span>
                    <span className="bg-[#F9FAF8] border border-[#C2C9BB] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#42493E]">
                      Height: {log.plantHeight}cm
                    </span>
                    <span className="bg-[#F9FAF8] border border-[#C2C9BB] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#42493E]">
                      Leaves: {log.leafCount}
                    </span>
                    {log.fertilizer && <span className="bg-[#154212]/10 border border-[#154212]/20 px-2 py-0.5 rounded text-[10px] font-bold text-[#154212]">Fertilizer</span>}
                    {log.weedManagement && <span className="bg-[#154212]/10 border border-[#154212]/20 px-2 py-0.5 rounded text-[10px] font-bold text-[#154212]">Weed Mgmt</span>}
                    {log.pestPrevention && <span className="bg-[#154212]/10 border border-[#154212]/20 px-2 py-0.5 rounded text-[10px] font-bold text-[#154212]">FAW-Prev</span>}
                  </div>

                  <p className="text-xs text-[#42493E] font-serif mt-2.5 italic leading-relaxed">
                    "{log.notes}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
