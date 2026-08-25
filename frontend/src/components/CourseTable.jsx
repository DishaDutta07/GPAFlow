import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  RotateCcw, 
  Save, 
  Download, 
  Sparkles, 
  Layers, 
  Check, 
  HelpCircle
} from 'lucide-react';
import CourseRow from './CourseRow';

export default function CourseTable({
  courses,
  setCourses,
  semesterName,
  setSemesterName,
  scaleId,
  scaleGrades,
  isPercentage,
  onSaveSemester,
  onOpenExportModal,
  onOpenPresetsModal,
  isSaving = false
}) {
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  // Add course handler
  const addCourse = () => {
    const defaultGrade = isPercentage ? '85' : (scaleGrades[0]?.grade || 'A');
    const newCourse = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      credits: 3,
      grade: defaultGrade,
      points: scaleGrades[0]?.points || 4.0,
      qualityPoints: 3 * (scaleGrades[0]?.points || 4.0)
    };
    setCourses([...courses, newCourse]);
  };

  // Update course field
  const updateCourse = (id, field, value) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, [field]: value };
          if (field === 'grade') {
            const foundGrade = scaleGrades.find(g => g.grade === value);
            if (foundGrade) {
              updated.points = foundGrade.points;
            }
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Remove course
  const removeCourse = (id) => {
    if (courses.length <= 1) {
      const defaultGrade = isPercentage ? '85' : (scaleGrades[0]?.grade || 'A');
      const defaultPoints = scaleGrades[0]?.points || 4.0;
      setCourses([{
        id: `c_${Date.now()}`,
        name: '',
        credits: 0,
        grade: defaultGrade,
        points: defaultPoints,
        qualityPoints: 0
      }]);
      return;
    }
    setCourses(courses.filter(c => c.id !== id));
  };

  // Reset all courses and fields
  const handleReset = () => {
    const defaultGrade = isPercentage ? '85' : (scaleGrades[0]?.grade || 'A');
    const defaultPoints = scaleGrades[0]?.points || 4.0;
    const now = Date.now();
    setCourses([
      { id: `c_${now}_1`, name: '', credits: 0, grade: defaultGrade, points: defaultPoints, qualityPoints: 0 },
      { id: `c_${now}_2`, name: '', credits: 0, grade: defaultGrade, points: defaultPoints, qualityPoints: 0 },
      { id: `c_${now}_3`, name: '', credits: 0, grade: defaultGrade, points: defaultPoints, qualityPoints: 0 },
      { id: `c_${now}_4`, name: '', credits: 0, grade: defaultGrade, points: defaultPoints, qualityPoints: 0 }
    ]);
    setSemesterName('Semester');
    setResetSuccessMessage(true);
    setTimeout(() => setResetSuccessMessage(false), 2000);
  };

  const handleSaveClick = async () => {
    const success = await onSaveSemester();
    if (success) {
      setSaveSuccessMessage(true);
      setTimeout(() => setSaveSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all duration-300">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-5 border-b border-rose-200/60 dark:border-maroon-900/60">
        
        {/* Semester Title Editor */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-maroon-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-maroon-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              placeholder="e.g. Semester 1"
              className="text-base sm:text-lg font-bold bg-transparent border-b border-dashed border-rose-300 dark:border-maroon-800 hover:border-rose-500 focus:border-rose-500 focus:outline-none text-slate-800 dark:text-rose-100 px-1 py-0.5 transition-colors"
            />
            <div className="text-[11px] text-slate-400 dark:text-rose-300/50 px-1">
              Click to edit semester name
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Quick Presets */}
          <button
            onClick={onOpenPresetsModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-dark-surface hover:bg-rose-100 dark:hover:bg-maroon-950 text-slate-700 dark:text-rose-200 border border-rose-200 dark:border-maroon-900/70 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 border ${
              resetSuccessMessage
                ? 'bg-rose-950 text-rose-200 border-rose-700'
                : 'bg-rose-50 dark:bg-dark-surface hover:bg-rose-100 dark:hover:bg-maroon-950 text-slate-700 dark:text-rose-200 border-rose-200 dark:border-maroon-900/70'
            }`}
            title="Reset all courses"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetSuccessMessage ? 'animate-spin' : ''}`} />
            <span>{resetSuccessMessage ? 'Cleared!' : 'Reset'}</span>
          </button>

          {/* Save Semester */}
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              saveSuccessMessage
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-rose-950/40 border border-rose-700/50'
            }`}
          >
            {saveSuccessMessage ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-dark-bg hover:bg-black text-rose-200 border border-maroon-900 transition-all shadow-sm active:scale-95"
            title="Download PDF or CSV summary"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Export</span>
          </button>

        </div>
      </div>

      {/* Table Column Headers (Desktop) */}
      <div className="hidden sm:flex items-center gap-3 px-3.5 py-3 text-[11px] font-bold uppercase tracking-wider text-rose-400/80 dark:text-rose-300/60">
        <span className="w-6 text-center">#</span>
        <span className="flex-1">Course / Subject Name</span>
        <span className="w-28 text-center">Credits</span>
        <span className="w-36 text-left">Grade Achieved</span>
        <span className="w-24 text-center">Quality Pts</span>
        <span className="w-8 text-center"></span>
      </div>

      {/* Dynamic Courses Rows */}
      <div className="space-y-2.5 mt-3 sm:mt-1">
        <AnimatePresence initial={false}>
          {courses.map((course, index) => (
            <CourseRow
              key={course.id}
              course={course}
              index={index}
              updateCourse={updateCourse}
              removeCourse={removeCourse}
              scaleId={scaleId}
              scaleGrades={scaleGrades}
              isPercentage={isPercentage}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 pt-4 border-t border-rose-200/60 dark:border-maroon-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* + Add Subject Button */}
        <button
          onClick={addCourse}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-100/70 dark:bg-maroon-950 hover:bg-rose-200/80 dark:hover:bg-maroon-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-maroon-800/80 transition-all duration-150 shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Subject</span>
        </button>

        {/* Real-time Math Formula Hint */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-rose-300/60 bg-rose-50/50 dark:bg-dark-bg/60 px-3 py-2 rounded-xl border border-rose-200/50 dark:border-maroon-900/50">
          <HelpCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span>
            Formula: <span className="font-semibold text-slate-700 dark:text-rose-200">GPA = Σ(Credits × Points) / Σ(Credits)</span>
          </span>
        </div>

      </div>

    </div>
  );
}
