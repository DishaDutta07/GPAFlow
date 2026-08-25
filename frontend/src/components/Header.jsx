import React from 'react';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  History, 
  Target, 
  Sparkles, 
  SlidersHorizontal,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  currentScaleName,
  openScaleModal,
  openHistoryDrawer,
  openCumulativeModal,
  openPresetsModal,
  historyCount = 0,
  user = null,
  openAuthModal,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-rose-200/50 dark:border-maroon-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-maroon-900 via-rose-700 to-rose-500 flex items-center justify-center shadow-md shadow-rose-900/40 text-white ring-2 ring-rose-500/30 flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-rose-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-rose-800 via-rose-600 to-rose-400 dark:from-rose-200 dark:via-rose-400 dark:to-rose-600 bg-clip-text text-transparent">
                GPAFlow
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-rose-100 dark:bg-maroon-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-maroon-800">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-rose-300/60 hidden md:block">
              Precision Academic GPA & CGPA Engine
            </p>
          </div>
        </div>

        {/* Action Buttons & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Desktop Scale Switcher Badge */}
          <button
            onClick={openScaleModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-dark-card hover:bg-rose-100 dark:hover:bg-maroon-950 text-slate-700 dark:text-rose-200 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-maroon-900/70 transition-all duration-200 shadow-sm"
            title="Configure grading scale"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-semibold">Scale:</span>
            <span className="truncate max-w-[100px] sm:max-w-[140px]">{currentScaleName}</span>
          </button>

          {/* Quick Presets */}
          <button
            onClick={openPresetsModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-dark-card hover:bg-rose-100 dark:hover:bg-maroon-950 text-slate-700 dark:text-rose-200 border border-rose-200 dark:border-maroon-900/70 transition-all shadow-sm"
            title="Load course templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs">Templates</span>
          </button>

          {/* Desktop Target & CGPA Planner */}
          <button
            onClick={openCumulativeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-100/70 dark:bg-maroon-950 hover:bg-rose-200/70 dark:hover:bg-maroon-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-maroon-800/80 transition-all duration-200 shadow-sm"
            title="Cumulative GPA & Target Planner"
          >
            <Target className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Target & CGPA</span>
          </button>

          {/* Desktop Saved History Drawer Trigger */}
          <button
            onClick={openHistoryDrawer}
            className="hidden sm:flex relative items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-dark-card hover:bg-rose-100 dark:hover:bg-maroon-950 text-slate-700 dark:text-rose-200 border border-rose-200 dark:border-maroon-900/70 transition-all duration-200 shadow-sm"
            title="View saved semester history"
          >
            <History className="w-3.5 h-3.5 text-rose-500/70" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Button */}
          {user ? (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950 text-rose-200 border border-rose-800 shadow-sm">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span className="truncate max-w-[80px] sm:max-w-[120px]">@{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/80 border border-rose-900/60 transition-all"
                title="Sign out of GPAFlow"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-md shadow-rose-950/40 border border-rose-700/50 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-rose-600 dark:text-rose-300 dark:hover:text-white bg-rose-50 dark:bg-dark-card hover:bg-rose-100 dark:hover:bg-maroon-950 border border-rose-200 dark:border-maroon-900/70 transition-all duration-200 shadow-sm"
            title={darkMode ? "Switch to Light Theme" : "Switch to Dark Maroon Theme"}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-rose-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-maroon-800 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
