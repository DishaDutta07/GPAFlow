import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Target, 
  Layers, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { calculateLocalTargetGpa } from '../utils/calculator';

export default function CumulativeModal({
  isOpen,
  onClose,
  currentSemesterGpa = 0,
  currentSemesterCredits = 0,
  maxGpa = 4.0,
  cumulativeData,
  setCumulativeData,
  isCumulativeActive,
  setIsCumulativeActive
}) {
  const [activeTab, setActiveTab] = useState('cumulative'); // 'cumulative' | 'planner'

  // Cumulative Form State
  const [prevGpa, setPrevGpa] = useState(cumulativeData?.previousGpa || '');
  const [prevCredits, setPrevCredits] = useState(cumulativeData?.previousCredits || '');

  // Target Planner State
  const [targetGpa, setTargetGpa] = useState('3.80');
  const [remainingCredits, setRemainingCredits] = useState('15');
  const [plannerResult, setPlannerResult] = useState(null);

  if (!isOpen) return null;

  // Handle Cumulative Save / Apply
  const handleApplyCumulative = (e) => {
    e.preventDefault();
    const gpaNum = parseFloat(prevGpa) || 0;
    const credsNum = parseFloat(prevCredits) || 0;
    
    setCumulativeData({
      previousGpa: gpaNum,
      previousCredits: credsNum
    });
    setIsCumulativeActive(true);
    onClose();
  };

  const handleClearCumulative = () => {
    setPrevGpa('');
    setPrevCredits('');
    setCumulativeData(null);
    setIsCumulativeActive(false);
    onClose();
  };

  // Handle Target Planner Calculate
  const handleCalculateTarget = (e) => {
    e.preventDefault();
    const currentCareerGpa = isCumulativeActive && cumulativeData
      ? (parseFloat(cumulativeData.previousGpa) * parseFloat(cumulativeData.previousCredits) + currentSemesterGpa * currentSemesterCredits) / (parseFloat(cumulativeData.previousCredits) + currentSemesterCredits)
      : currentSemesterGpa;

    const currentTotalCredits = isCumulativeActive && cumulativeData
      ? parseFloat(cumulativeData.previousCredits) + currentSemesterCredits
      : currentSemesterCredits;

    const res = calculateLocalTargetGpa({
      currentGpa: currentCareerGpa,
      currentCredits: currentTotalCredits,
      targetGpa: parseFloat(targetGpa) || 0,
      remainingCredits: parseFloat(remainingCredits) || 0,
      maxScale: maxGpa
    });

    setPlannerResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="glass-panel rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto border-t sm:border border-rose-300 dark:border-maroon-900/90 shadow-2xl transition-all"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-rose-500/40 rounded-full mx-auto mt-2.5 sm:hidden" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/60 dark:border-maroon-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-maroon-950 text-rose-400 border border-rose-900/60">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                Cumulative CGPA & Target Planner
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-300/60">
                Compute career cumulative GPA & plan future goals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-maroon-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-rose-200/60 dark:border-maroon-900/60 bg-rose-50/50 dark:bg-dark-bg/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'cumulative'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cumulative CGPA Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Target "What-If" Planner</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'cumulative' ? (
            <form onSubmit={handleApplyCumulative} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-rose-200/70 leading-relaxed">
                Add your previous academic record (total credits taken so far and previous cumulative GPA). GPAFlow will combine them seamlessly with this semester's grades!
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
                    Previous Total Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={prevCredits}
                    onChange={(e) => setPrevCredits(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <span className="text-[11px] text-rose-300/60">Total earned credits</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
                    Previous Cumulative GPA
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maxGpa}
                    step="0.01"
                    value={prevGpa}
                    onChange={(e) => setPrevGpa(e.target.value)}
                    placeholder={`e.g. ${(maxGpa * 0.85).toFixed(2)}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <span className="text-[11px] text-rose-300/60">Prior CGPA score</span>
                </div>
              </div>

              {/* Current Semester Summary pill */}
              <div className="p-3.5 rounded-2xl bg-rose-100/50 dark:bg-maroon-950/70 border border-rose-200/60 dark:border-maroon-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-rose-300/60">Current Semester:</span>{' '}
                  <span className="font-bold text-rose-700 dark:text-rose-300">{currentSemesterCredits} credits</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-rose-300/60">Semester GPA:</span>{' '}
                  <span className="font-bold text-rose-700 dark:text-rose-300">{Number(currentSemesterGpa).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {isCumulativeActive && (
                  <button
                    type="button"
                    onClick={handleClearCumulative}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-maroon-950 transition-colors"
                  >
                    Disable Cumulative
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-md shadow-rose-950/50 transition-all border border-rose-700/50"
                >
                  Apply Cumulative Mode
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCalculateTarget} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-rose-200/70 leading-relaxed">
                Find out the minimum GPA you must achieve across upcoming semesters/credits to reach your desired target graduation CGPA!
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
                    Target Graduation CGPA
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maxGpa}
                    step="0.01"
                    value={targetGpa}
                    onChange={(e) => setTargetGpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100"
                  />
                  <span className="text-[11px] text-rose-300/60">e.g. 3.80 / 4.0</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
                    Remaining Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={remainingCredits}
                    onChange={(e) => setRemainingCredits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100"
                  />
                  <span className="text-[11px] text-rose-300/60">Credits left until graduation</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-md shadow-rose-950/50 transition-all flex items-center justify-center gap-2 border border-rose-700/50"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Required GPA</span>
              </button>

              {/* Target Calculation Result */}
              {plannerResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border ${
                    plannerResult.isAchievable
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-100'
                      : 'bg-rose-950/80 border-rose-800 text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {plannerResult.isAchievable ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {plannerResult.isAchievable ? 'Target is Achievable!' : 'Target is Statistically Out of Reach'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-rose-200/80">
                      Required Average GPA for remaining {plannerResult.remainingCredits} credits:
                    </span>
                    <span className={`text-xl font-black ${plannerResult.isAchievable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {plannerResult.requiredGpa}
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-300/70 mt-2 leading-relaxed">
                    {plannerResult.isAchievable
                      ? `To reach ${plannerResult.targetGpa} CGPA across ${plannerResult.targetTotalCredits} total credits, you need to maintain an average of ${plannerResult.requiredGpa} GPA in all remaining coursework.`
                      : `A required GPA of ${plannerResult.requiredGpa} exceeds the maximum scale limit of ${maxGpa}. Try aiming for a slightly adjusted target CGPA.`}
                  </p>
                </motion.div>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
