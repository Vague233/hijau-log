import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ChevronLeft, Plus, List, Download } from 'lucide-react';
import { AddLand } from './AddLand';
import { LandList } from './LandList';
import { ExportData } from './ExportData';

interface DatabaseAccordionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DatabaseAccordion({ isOpen, onClose }: DatabaseAccordionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const stateView = location.state?.view as 'add' | 'list' | 'export' | null;

  const [activeView, setActiveView] = useState<'add' | 'list' | 'export' | null>(stateView || null);
  const [expandingPanel, setExpandingPanel] = useState<'add' | 'list' | 'export' | null>(stateView || null);

  // Reset states when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveView(null);
        setExpandingPanel(null);
      }, 500);
    }
  }, [isOpen]);

  const handlePanelClick = (panel: 'add' | 'list' | 'export') => {
    setExpandingPanel(panel);
    // Wait for the flex transition (0.8s) before showing the view content
    setTimeout(() => {
      setActiveView(panel);
    }, 800);
  };

  const handleBackToAccordion = () => {
    setActiveView(null);
    setExpandingPanel(null);
    if (location.state?.view) {
      navigate('/database', { replace: true, state: {} });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col transition-all duration-500"
    >

      {/* Header / Back button */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        {activeView ? (
          <button 
            onClick={handleBackToAccordion}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all"
          >
            <ChevronLeft className="size-5" />
            Kembali ke Menu
          </button>
        ) : (
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all"
          >
            <ChevronLeft className="size-5" />
            Tutup Database
          </button>
        )}
      </div>

      {/* Internal App View (Fades in over the expanded panel) */}
      <div 
        className={`absolute inset-0 z-40 transition-opacity duration-500 overflow-y-auto pt-24 pb-12 ${
          activeView ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {activeView === 'add' && <AddLand onBack={handleBackToAccordion} onSuccess={() => handlePanelClick('list')} />}
        {activeView === 'list' && <LandList onBack={handleBackToAccordion} />}
        {activeView === 'export' && <ExportData onBack={handleBackToAccordion} />}
      </div>

      {/* Accordion Container */}
      <div 
        className={`flex-1 flex w-full h-full transition-all duration-500 ${
          activeView ? 'opacity-50 blur-md pointer-events-none' : 'opacity-100'
        }`}
      >
        
        {/* Panel 1: Tambah Lahan */}
        <div 
          onClick={() => handlePanelClick('add')}
          className={`accordion-panel group relative overflow-hidden border-r border-white/5 ${
            expandingPanel === 'add' ? 'flex-[10]' : expandingPanel ? 'flex-[0.1]' : 'flex-1 hover:flex-[2]'
          }`}
        >
          <img 
            src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              expandingPanel === 'add' ? 'grayscale-0 brightness-100' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75'
            }`}
            alt="Tambah Lahan"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <div className={`transition-all duration-500 delay-100 ${(!activeView && (expandingPanel === 'add' || expandingPanel === null)) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <span className="font-mono text-sm tracking-widest border border-emerald-400/30 rounded-full px-3 py-1">01</span>
                <Plus className="size-5" />
              </div>
              <h2 className={`font-serif text-3xl md:text-5xl text-white mb-4 whitespace-nowrap transition-all duration-500 ${
                !expandingPanel && 'group-hover:translate-x-4'
              }`}>
                Tambah Lahan / Pohon
              </h2>
              <div className={`overflow-hidden transition-all duration-500 ${
                expandingPanel === 'add' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'
              }`}>
                <p className="text-white/70 max-w-md font-outfit text-sm md:text-base leading-relaxed mb-6">
                  Registrasi poligon lahan baru dan input koordinat GPS pohon secara luring atau daring untuk kepatuhan EUDR.
                </p>

              </div>
            </div>
            
            {/* Collapsed Vertical Text */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              expandingPanel ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}>
              <span className="accordion-text-vertical text-2xl font-serif text-white/50 tracking-widest uppercase whitespace-nowrap">
                Tambah Lahan
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Lihat Semua Lahan */}
        <div 
          onClick={() => handlePanelClick('list')}
          className={`accordion-panel group relative overflow-hidden border-r border-white/5 ${
            expandingPanel === 'list' ? 'flex-[10]' : expandingPanel ? 'flex-[0.1]' : 'flex-1 hover:flex-[2]'
          }`}
        >
          <img 
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              expandingPanel === 'list' ? 'grayscale-0 brightness-100' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75'
            }`}
            alt="Lihat Lahan"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <div className={`transition-all duration-500 delay-100 ${(!activeView && (expandingPanel === 'list' || expandingPanel === null)) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <span className="font-mono text-sm tracking-widest border border-emerald-400/30 rounded-full px-3 py-1">02</span>
                <List className="size-5" />
              </div>
              <h2 className={`font-serif text-3xl md:text-5xl text-white mb-4 whitespace-nowrap transition-all duration-500 ${
                !expandingPanel && 'group-hover:translate-x-4'
              }`}>
                Lihat Semua Lahan
              </h2>
              <div className={`overflow-hidden transition-all duration-500 ${
                expandingPanel === 'list' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'
              }`}>
                <p className="text-white/70 max-w-md font-outfit text-sm md:text-base leading-relaxed mb-6">
                  Pantau seluruh portofolio lahan Anda, periksa status verifikasi, dan manajemen aset hutan berkelanjutan.
                </p>

              </div>
            </div>
            
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              expandingPanel ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}>
              <span className="accordion-text-vertical text-2xl font-serif text-white/50 tracking-widest uppercase whitespace-nowrap">
                Database Lahan
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Ekspor Data */}
        <div 
          onClick={() => handlePanelClick('export')}
          className={`accordion-panel group relative overflow-hidden ${
            expandingPanel === 'export' ? 'flex-[10]' : expandingPanel ? 'flex-[0.1]' : 'flex-1 hover:flex-[2]'
          }`}
        >
          <img 
            src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              expandingPanel === 'export' ? 'grayscale-0 brightness-100' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75'
            }`}
            alt="Ekspor Data"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <div className={`transition-all duration-500 delay-100 ${(!activeView && (expandingPanel === 'export' || expandingPanel === null)) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <span className="font-mono text-sm tracking-widest border border-emerald-400/30 rounded-full px-3 py-1">03</span>
                <Download className="size-5" />
              </div>
              <h2 className={`font-serif text-3xl md:text-5xl text-white mb-4 whitespace-nowrap transition-all duration-500 ${
                !expandingPanel && 'group-hover:translate-x-4'
              }`}>
                Ekspor Data (EUDR)
              </h2>
              <div className={`overflow-hidden transition-all duration-500 ${
                expandingPanel === 'export' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'
              }`}>
                <p className="text-white/70 max-w-md font-outfit text-sm md:text-base leading-relaxed mb-6">
                  Buat paket laporan komprehensif (JSON, CSV, PDF) untuk Due Diligence Statement (DDS) sesuai regulasi Uni Eropa.
                </p>

              </div>
            </div>
            
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              expandingPanel ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}>
              <span className="accordion-text-vertical text-2xl font-serif text-white/50 tracking-widest uppercase whitespace-nowrap">
                Ekspor Data
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
