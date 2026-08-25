import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import GpaGauge from './components/GpaGauge';
import StatsSummary from './components/StatsSummary';
import CourseTable from './components/CourseTable';
import CumulativeModal from './components/CumulativeModal';
import GradeScaleModal from './components/GradeScaleModal';
import HistoryDrawer from './components/HistoryDrawer';
import ExportModal from './components/ExportModal';
import PresetsModal from './components/PresetsModal';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';

import { DEFAULT_SCALES, calculateLocalGpa } from './utils/calculator';
import { ApiService } from './services/api';
import { 
  Target, 
  Download, 
  Layers, 
  BarChart3
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gpaflow_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // User Auth state
  const [user, setUser] = useState(() => ApiService.getCurrentUser());
  const [isGuest, setIsGuest] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Grading Scale state
  const [scaleId, setScaleId] = useState(() => {
    return localStorage.getItem('gpaflow_scale_id') || 'us_4_0';
  });

  const [customScale, setCustomScale] = useState(() => {
    const saved = localStorage.getItem('gpaflow_custom_scale');
    return saved ? JSON.parse(saved) : null;
  });

  // Current active scale object & grades list
  const currentScale = useMemo(() => {
    if (scaleId === 'custom' && customScale) return customScale;
    return DEFAULT_SCALES[scaleId] || DEFAULT_SCALES.us_4_0;
  }, [scaleId, customScale]);

  // Semester metadata & courses
  const [semesterName, setSemesterName] = useState('Semester');
  const [courses, setCourses] = useState(() => {
    const defaultGrade = scaleId === 'percentage' ? '92' : (currentScale.grades?.[0]?.grade || 'A');
    const defaultPts = currentScale.grades?.[0]?.points || 4.0;
    return [
      { id: 'c_1', name: 'Data Structures & Algorithms', credits: 4, grade: defaultGrade, points: defaultPts, qualityPoints: 4 * defaultPts },
      { id: 'c_2', name: 'Computer Architecture', credits: 4, grade: defaultGrade, points: defaultPts, qualityPoints: 4 * defaultPts },
      { id: 'c_3', name: 'Discrete Mathematics', credits: 3, grade: defaultGrade, points: defaultPts, qualityPoints: 3 * defaultPts },
      { id: 'c_4', name: 'Linear Algebra', credits: 3, grade: defaultGrade, points: defaultPts, qualityPoints: 3 * defaultPts },
      { id: 'c_5', name: 'Technical Writing', credits: 2, grade: defaultGrade, points: defaultPts, qualityPoints: 2 * defaultPts }
    ];
  });

  // Cumulative GPA State
  const [isCumulativeActive, setIsCumulativeActive] = useState(false);
  const [cumulativeData, setCumulativeData] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Modals visibility
  const [scaleModalOpen, setScaleModalOpen] = useState(false);
  const [cumulativeModalOpen, setCumulativeModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);

  // Sync Dark Mode with <html> tag
  useEffect(() => {
    localStorage.setItem('gpaflow_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch history for current user/guest
  const fetchUserHistory = useCallback(async () => {
    const data = await ApiService.getHistory();
    if (data) setHistory(data);
  }, []);

  // Validate session token on mount
  useEffect(() => {
    const checkSession = async () => {
      const activeProfile = await ApiService.getMe();
      if (activeProfile) {
        setUser(activeProfile);
      }
      fetchUserHistory();
    };
    checkSession();
  }, [fetchUserHistory]);

  // Auth Handlers
  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setIsGuest(false);
    fetchUserHistory();
  };

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
    setIsGuest(false);
    setHistory([]);
  };

  // Recalculate whenever courses, scale, or cumulative data changes
  const calculation = useMemo(() => {
    return calculateLocalGpa(
      courses,
      scaleId,
      customScale,
      isCumulativeActive ? cumulativeData : null
    );
  }, [courses, scaleId, customScale, isCumulativeActive, cumulativeData]);

  // Scale select handler
  const handleSelectScale = (newScaleId, newCustomScale = null) => {
    setScaleId(newScaleId);
    localStorage.setItem('gpaflow_scale_id', newScaleId);
    if (newCustomScale) {
      setCustomScale(newCustomScale);
    }
  };

  // Save semester handler
  const handleSaveSemester = async () => {
    setIsSaving(true);
    const payload = {
      semesterName,
      scaleId,
      courses: calculation.courses,
      semesterGpa: calculation.semesterGpa,
      totalCredits: calculation.totalCredits,
      totalPoints: calculation.totalQualityPoints,
      academicStanding: calculation.academicStanding,
      cumulative: calculation.cumulative
    };

    const saved = await ApiService.saveSemester(payload);
    if (saved) {
      setHistory(prev => {
        const idx = prev.findIndex(item => item.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    }
    setIsSaving(false);
    return true;
  };

  // Load semester from history
  const handleLoadSemester = (record) => {
    if (record.semesterName) setSemesterName(record.semesterName);
    if (record.scaleId) setScaleId(record.scaleId);
    if (record.courses && record.courses.length > 0) {
      setCourses(record.courses);
    }
    if (record.cumulative) {
      setCumulativeData(record.cumulative);
      setIsCumulativeActive(true);
    } else {
      setIsCumulativeActive(false);
    }
  };

  // Delete semester from history
  const handleDeleteSemester = async (id) => {
    await ApiService.deleteHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Apply course preset
  const handleApplyPreset = (presetName, presetCourses) => {
    setSemesterName(presetName);
    setCourses(presetCourses);
  };

  // Compute grade distribution for breakdown chips
  const gradeDistribution = useMemo(() => {
    const dist = {};
    calculation.courses.forEach(c => {
      if (c.credits > 0) {
        dist[c.grade] = (dist[c.grade] || 0) + 1;
      }
    });
    return dist;
  }, [calculation.courses]);

  // If user is not logged in and hasn't chosen guest mode, show the Auth Sign In/Sign Up Gate
  if (!user && !isGuest) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onContinueAsGuest={() => setIsGuest(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/40 dark:bg-[#070204] text-slate-900 dark:text-rose-100 transition-colors duration-300 relative">
      
      {/* Dark Maroon ambient atmospheric background glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-rose-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-maroon-950/25 rounded-full blur-[140px] pointer-events-none" />

      {/* App Bar Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentScaleName={currentScale.name}
        openScaleModal={() => setScaleModalOpen(true)}
        openHistoryDrawer={() => setHistoryDrawerOpen(true)}
        openCumulativeModal={() => setCumulativeModalOpen(true)}
        openPresetsModal={() => setPresetsModalOpen(true)}
        historyCount={history.length}
        user={user}
        openAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-24 sm:pb-8 relative z-10">
        
        {/* Hero Statistics Summary */}
        <StatsSummary
          totalCredits={calculation.totalCredits}
          totalPoints={calculation.totalQualityPoints}
          courseCount={calculation.courses.filter(c => c.credits > 0).length}
          semesterGpa={calculation.semesterGpa}
          maxGpa={calculation.maxGpa}
          cumulative={calculation.cumulative}
          isCumulativeActive={isCumulativeActive}
        />

        {/* Core Calculation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Dynamic Course Input Table (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <CourseTable
              courses={courses}
              setCourses={setCourses}
              semesterName={semesterName}
              setSemesterName={setSemesterName}
              scaleId={scaleId}
              scaleGrades={currentScale.grades || []}
              isPercentage={scaleId === 'percentage'}
              onSaveSemester={handleSaveSemester}
              onOpenExportModal={() => setExportModalOpen(true)}
              onOpenPresetsModal={() => setPresetsModalOpen(true)}
              isSaving={isSaving}
            />

            {/* Quick Cumulative GPA Bar */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-rose-200/60 dark:border-maroon-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-maroon-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-maroon-800">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-rose-100">
                    Cumulative CGPA Calculator
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-rose-300/60">
                    {isCumulativeActive && cumulativeData
                      ? `Prior: ${cumulativeData.previousCredits} credits @ ${cumulativeData.previousGpa} GPA → New CGPA: ${calculation.cumulative?.newCumulativeGpa || 0}`
                      : 'Factor in past cumulative credits and prior GPA'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCumulativeModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-md shadow-rose-950/40 border border-rose-700/40 transition-all"
                >
                  {isCumulativeActive ? 'Adjust CGPA Settings' : 'Enable Cumulative Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Gauge & Action Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Animated Circular GPA Gauge Card */}
            <GpaGauge
              gpa={calculation.semesterGpa}
              maxGpa={calculation.maxGpa}
              scaleId={scaleId}
              academicStanding={calculation.academicStanding}
              academicBadgeColor={calculation.academicBadgeColor}
              isCumulativeActive={isCumulativeActive}
              cumulativeGpa={calculation.cumulative?.newCumulativeGpa}
            />

            {/* Grade Distribution Pill Cluster */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-200/60 dark:border-maroon-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400/80 dark:text-rose-300/70 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-rose-500" />
                  Grade Distribution
                </span>
                <span className="text-[10px] font-semibold text-rose-300/50">
                  {courses.filter(c => c.credits > 0).length} Enrolled
                </span>
              </div>

              {Object.keys(gradeDistribution).length === 0 ? (
                <p className="text-xs text-rose-400/60 text-center py-2">
                  No grades entered yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                    <div
                      key={grade}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-dark-surface border border-rose-200 dark:border-maroon-900/80 text-xs font-bold text-slate-800 dark:text-rose-200 flex items-center gap-1.5"
                    >
                      <span className="text-rose-500 font-extrabold">{grade}:</span>
                      <span>{count} course{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="glass-card rounded-2xl p-4 border border-rose-200/60 dark:border-maroon-900/60 space-y-2">
              <button
                onClick={() => setExportModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-dark-bg hover:bg-black text-rose-100 border border-maroon-900 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>Export PDF Academic Transcript</span>
              </button>

              <button
                onClick={() => setCumulativeModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-100/60 dark:bg-maroon-950/80 hover:bg-rose-200/70 dark:hover:bg-maroon-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-maroon-800/80 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Target className="w-4 h-4 text-rose-400" />
                <span>Target "What-If" GPA Planner</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Modern Footer */}
      <footer className="mt-12 py-6 border-t border-rose-200/60 dark:border-maroon-900/60 text-center text-xs text-slate-500 dark:text-rose-300/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold bg-gradient-to-r from-rose-700 to-rose-400 dark:from-rose-300 dark:to-rose-500 bg-clip-text text-transparent">
              GPAFlow
            </span>
            <span>— Precision Academic Calculation & Degree Progression Engine</span>
          </div>
          <div className="flex items-center gap-4 text-rose-400/60">
            {user ? (
              <span className="font-semibold text-rose-300">Signed in as @{user.username}</span>
            ) : (
              <span>Self-Hostable • Production Ready</span>
            )}
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      <GradeScaleModal
        isOpen={scaleModalOpen}
        onClose={() => setScaleModalOpen(false)}
        currentScaleId={scaleId}
        onSelectScale={handleSelectScale}
        customScale={customScale}
        setCustomScale={setCustomScale}
      />

      <CumulativeModal
        isOpen={cumulativeModalOpen}
        onClose={() => setCumulativeModalOpen(false)}
        currentSemesterGpa={calculation.semesterGpa}
        currentSemesterCredits={calculation.totalCredits}
        maxGpa={calculation.maxGpa}
        cumulativeData={cumulativeData}
        setCumulativeData={setCumulativeData}
        isCumulativeActive={isCumulativeActive}
        setIsCumulativeActive={setIsCumulativeActive}
      />

      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        history={history}
        onLoadSemester={handleLoadSemester}
        onDeleteSemester={handleDeleteSemester}
        maxGpa={calculation.maxGpa}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        currentCalculation={calculation}
        semesterName={semesterName}
      />

      <PresetsModal
        isOpen={presetsModalOpen}
        onClose={() => setPresetsModalOpen(false)}
        onApplyPreset={handleApplyPreset}
        scaleGrades={currentScale.grades || []}
        isPercentage={scaleId === 'percentage'}
      />

      {/* Mobile Bottom Navigation Tab Bar */}
      <MobileBottomNav
        openCumulativeModal={() => setCumulativeModalOpen(true)}
        openHistoryDrawer={() => setHistoryDrawerOpen(true)}
        openScaleModal={() => setScaleModalOpen(true)}
        openExportModal={() => setExportModalOpen(true)}
        historyCount={history.length}
      />

    </div>
  );
}
