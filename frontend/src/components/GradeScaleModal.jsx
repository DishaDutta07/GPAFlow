import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sliders, Plus, Trash2, Check } from 'lucide-react';
import { DEFAULT_SCALES } from '../utils/calculator';

export default function GradeScaleModal({
  isOpen,
  onClose,
  currentScaleId,
  onSelectScale,
  customScale,
  setCustomScale
}) {
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'custom'

  // Editable custom scale state
  const [customName, setCustomName] = useState(customScale?.name || 'My Custom University Scale');
  const [customMaxGpa, setCustomMaxGpa] = useState(customScale?.maxGpa || 4.0);
  const [customGrades, setCustomGrades] = useState(
    customScale?.grades || [
      { grade: 'A', points: 4.0 },
      { grade: 'B', points: 3.0 },
      { grade: 'C', points: 2.0 },
      { grade: 'D', points: 1.0 },
      { grade: 'F', points: 0.0 }
    ]
  );

  if (!isOpen) return null;

  const handleAddCustomGrade = () => {
    setCustomGrades([...customGrades, { grade: 'New', points: 3.5 }]);
  };

  const handleUpdateCustomGrade = (index, field, value) => {
    const next = [...customGrades];
    next[index] = {
      ...next[index],
      [field]: field === 'points' ? parseFloat(value) || 0 : value
    };
    setCustomGrades(next);
  };

  const handleRemoveCustomGrade = (index) => {
    setCustomGrades(customGrades.filter((_, i) => i !== index));
  };

  const handleSaveCustomScale = () => {
    const scaleObj = {
      id: 'custom',
      name: customName || 'Custom Scale',
      maxGpa: parseFloat(customMaxGpa) || 4.0,
      description: 'User-configured custom grading scale',
      grades: customGrades
    };
    setCustomScale(scaleObj);
    onSelectScale('custom', scaleObj);
    localStorage.setItem('gpaflow_custom_scale', JSON.stringify(scaleObj));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="glass-panel rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-rose-300 dark:border-maroon-900/90 shadow-2xl transition-all"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-rose-500/40 rounded-full mx-auto mt-2.5 sm:hidden" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/60 dark:border-maroon-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-maroon-950 text-rose-400 border border-rose-900/60">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                Grading System & Scale
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-300/60">
                Choose a standard system or customize your university's scale
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

        {/* Tab Nav */}
        <div className="flex border-b border-rose-200/60 dark:border-maroon-900/60 bg-rose-50/50 dark:bg-dark-bg/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preset'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            Standard Preset Scales
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            Custom Scale Builder
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'preset' ? (
            <div className="grid gap-3">
              {Object.values(DEFAULT_SCALES).map((scale) => {
                const isSelected = currentScaleId === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      onSelectScale(scale.id, scale);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/30'
                        : 'bg-white/60 dark:bg-dark-card/80 border-rose-200 dark:border-maroon-900/70 hover:border-rose-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-rose-100">
                          {scale.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-maroon-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-maroon-800">
                          Max: {scale.maxGpa}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-rose-300/60 mt-1">
                        {scale.description}
                      </p>

                      {scale.grades && scale.grades.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {scale.grades.slice(0, 8).map((g) => (
                            <span
                              key={g.grade}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100/70 dark:bg-dark-bg text-rose-800 dark:text-rose-300 font-medium"
                            >
                              {g.grade}: {g.points}
                            </span>
                          ))}
                          {scale.grades.length > 8 && (
                            <span className="text-[10px] text-rose-400 self-center">
                              +{scale.grades.length - 8} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-900/50">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Scale Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-dark-bg border border-rose-200 dark:border-maroon-900 text-xs font-semibold text-rose-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Max GPA Limit
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMaxGpa}
                    onChange={(e) => setCustomMaxGpa(parseFloat(e.target.value) || 4.0)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-dark-bg border border-rose-200 dark:border-maroon-900 text-xs font-semibold text-center text-rose-100"
                  />
                </div>
              </div>

              {/* Custom Grade Mappings */}
              <div className="border border-rose-200 dark:border-maroon-900 rounded-2xl p-3 bg-rose-50/50 dark:bg-dark-bg/60 space-y-2">
                <div className="flex justify-between items-center px-1 text-[11px] font-bold uppercase text-rose-400">
                  <span>Grade Symbol</span>
                  <span>Point Value</span>
                  <span></span>
                </div>

                {customGrades.map((cg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cg.grade}
                      onChange={(e) => handleUpdateCustomGrade(idx, 'grade', e.target.value)}
                      className="w-28 px-3 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-rose-200 dark:border-maroon-800 text-xs font-bold text-center text-rose-100"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={cg.points}
                      onChange={(e) => handleUpdateCustomGrade(idx, 'points', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-rose-200 dark:border-maroon-800 text-xs font-bold text-center text-rose-100"
                    />
                    <button
                      onClick={() => handleRemoveCustomGrade(idx)}
                      className="p-2 text-rose-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleAddCustomGrade}
                  className="w-full mt-2 py-2 rounded-xl border border-dashed border-rose-400 dark:border-maroon-700 text-xs font-bold text-rose-400 hover:bg-maroon-950 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Grade Level</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleSaveCustomScale}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-md shadow-rose-950/50 transition-all border border-rose-700/50"
                >
                  Save & Apply Custom Scale
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
