import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Code, Cpu, Dna, TrendingUp, BookOpen } from 'lucide-react';

const PRESETS = [
  {
    id: 'cs',
    title: 'Computer Science & Software',
    icon: Code,
    color: 'from-rose-900 via-rose-700 to-rose-500',
    description: 'Core sophomore CS semester schedule',
    semesterName: 'CS Semester',
    courses: [
      { name: 'Data Structures & Algorithms', credits: 4, grade: 'A' },
      { name: 'Computer Architecture & Systems', credits: 4, grade: 'A-' },
      { name: 'Discrete Mathematics', credits: 3, grade: 'A' },
      { name: 'Linear Algebra', credits: 3, grade: 'B+' },
      { name: 'Technical Writing & Ethics', credits: 2, grade: 'A' }
    ]
  },
  {
    id: 'eng',
    title: 'Engineering Core',
    icon: Cpu,
    color: 'from-maroon-900 via-rose-800 to-rose-600',
    description: 'Foundational STEM & Engineering semester',
    semesterName: 'Engineering Semester',
    courses: [
      { name: 'Multivariable Calculus (Calc III)', credits: 4, grade: 'A' },
      { name: 'Physics II: Electricity & Magnetism', credits: 4, grade: 'B+' },
      { name: 'Circuit Analysis & Lab', credits: 4, grade: 'A-' },
      { name: 'Engineering Thermodynamics', credits: 3, grade: 'A' },
      { name: 'Engineering Design Workshop', credits: 2, grade: 'A' }
    ]
  },
  {
    id: 'premed',
    title: 'Pre-Med & Biological Sciences',
    icon: Dna,
    color: 'from-rose-950 via-rose-800 to-pink-600',
    description: 'Rigorous life sciences & pre-health coursework',
    semesterName: 'Pre-Med Semester',
    courses: [
      { name: 'Organic Chemistry I', credits: 4, grade: 'A' },
      { name: 'Organic Chemistry Laboratory', credits: 2, grade: 'A' },
      { name: 'Cell & Molecular Biology', credits: 4, grade: 'A-' },
      { name: 'Biostatistics', credits: 3, grade: 'A' },
      { name: 'Human Physiology', credits: 3, grade: 'B+' }
    ]
  },
  {
    id: 'business',
    title: 'Business & Finance',
    icon: TrendingUp,
    color: 'from-maroon-950 via-rose-900 to-amber-600',
    description: 'Commerce, economics and quantitative analysis',
    semesterName: 'Business Semester',
    courses: [
      { name: 'Corporate Financial Management', credits: 3, grade: 'A' },
      { name: 'Managerial Accounting', credits: 3, grade: 'A-' },
      { name: 'Applied Microeconomics', credits: 3, grade: 'A' },
      { name: 'Business Data Analytics', credits: 3, grade: 'B+' },
      { name: 'Marketing Strategy', credits: 3, grade: 'A' }
    ]
  },
  {
    id: 'general',
    title: 'General Education & Humanities',
    icon: BookOpen,
    color: 'from-rose-900 to-rose-600',
    description: 'Freshman exploratory general foundation',
    semesterName: 'Foundation Semester',
    courses: [
      { name: 'Academic Writing & Rhetoric', credits: 3, grade: 'A' },
      { name: 'Introduction to Psychology', credits: 3, grade: 'A' },
      { name: 'World History Since 1500', credits: 3, grade: 'A-' },
      { name: 'Environmental Science', credits: 3, grade: 'A' },
      { name: 'Introduction to Philosophy', credits: 3, grade: 'B+' }
    ]
  }
];

export default function PresetsModal({
  isOpen,
  onClose,
  onApplyPreset,
  scaleGrades,
  isPercentage
}) {
  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    const defaultGrade = isPercentage ? '90' : (scaleGrades[0]?.grade || 'A');
    const defaultPoints = scaleGrades[0]?.points || 4.0;

    const formattedCourses = preset.courses.map((c, i) => {
      let matchedGrade = c.grade;
      let matchedPoints = defaultPoints;

      if (!isPercentage) {
        const found = scaleGrades.find(g => g.grade.startsWith(c.grade));
        if (found) {
          matchedGrade = found.grade;
          matchedPoints = found.points;
        }
      } else {
        matchedGrade = c.grade === 'A' ? '92' : c.grade === 'A-' ? '88' : '82';
        matchedPoints = parseFloat(matchedGrade);
      }

      return {
        id: `preset_${preset.id}_${i}_${Date.now()}`,
        name: c.name,
        credits: c.credits,
        grade: matchedGrade,
        points: matchedPoints,
        qualityPoints: c.credits * matchedPoints
      };
    });

    onApplyPreset(preset.semesterName, formattedCourses);
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                Course Schedule Templates
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-300/60">
                Load a pre-configured curriculum with 1 click
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

        {/* Presets List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="p-4 rounded-2xl glass-card border border-rose-200/80 dark:border-maroon-900/80 hover:border-rose-500 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${preset.color} text-white flex items-center justify-center shadow-md shadow-rose-950/50 flex-shrink-0 group-hover:scale-105 transition-transform border border-rose-600/30`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-rose-100 group-hover:text-rose-400 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-rose-300/60 mt-0.5">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.courses.slice(0, 3).map((c, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100/70 dark:bg-dark-bg text-rose-800 dark:text-rose-300 font-medium">
                          {c.name.split(':')[0]} ({c.credits} cr)
                        </span>
                      ))}
                      {preset.courses.length > 3 && (
                        <span className="text-[10px] text-rose-400/80 self-center">
                          +{preset.courses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-100 dark:bg-maroon-950 text-rose-800 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm flex-shrink-0 ml-3 border border-rose-200 dark:border-maroon-800">
                  Apply
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
