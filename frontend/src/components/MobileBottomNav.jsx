import React from 'react';
import { 
  Calculator, 
  Target, 
  History, 
  SlidersHorizontal, 
  Download 
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab = 'calc',
  openCumulativeModal,
  openHistoryDrawer,
  openScaleModal,
  openExportModal,
  historyCount = 0
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-rose-200/60 dark:border-maroon-900/80 bg-white/95 dark:bg-[#0d0408]/95 backdrop-blur-xl px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Calculator Tab */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-rose-600 dark:text-rose-400 font-bold transition-all active:scale-95"
        >
          <div className="p-1 rounded-lg bg-rose-100 dark:bg-maroon-950">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Calc</span>
        </button>

        {/* 2. Target & CGPA Tab */}
        <button
          onClick={openCumulativeModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-rose-200/70 hover:text-rose-500 transition-all active:scale-95"
        >
          <div className="p-1">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Target</span>
        </button>

        {/* 3. History Tab */}
        <button
          onClick={openHistoryDrawer}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-rose-200/70 hover:text-rose-500 transition-all active:scale-95"
        >
          <div className="p-1 relative">
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">History</span>
        </button>

        {/* 4. Grade Scale Tab */}
        <button
          onClick={openScaleModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-rose-200/70 hover:text-rose-500 transition-all active:scale-95"
        >
          <div className="p-1">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Scale</span>
        </button>

        {/* 5. Export Tab */}
        <button
          onClick={openExportModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-rose-200/70 hover:text-rose-500 transition-all active:scale-95"
        >
          <div className="p-1">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Export</span>
        </button>

      </div>
    </nav>
  );
}
