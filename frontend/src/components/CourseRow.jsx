import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function CourseRow({
  course,
  index,
  updateCourse,
  removeCourse,
  scaleId,
  scaleGrades = [],
  isPercentage = false
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl bg-white/90 dark:bg-dark-card/95 hover:bg-white dark:hover:bg-[#1e0813] border border-rose-200/70 dark:border-maroon-900/70 hover:border-rose-400 dark:hover:border-rose-700/80 transition-all duration-200 shadow-sm p-3 sm:p-3.5"
    >
      {/* Mobile-first Layout: Top Row (Course Name + Delete) */}
      <div className="flex items-center gap-2 mb-2 sm:mb-0 sm:hidden">
        <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-maroon-950 text-rose-600 dark:text-rose-400 text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <input
            type="text"
            value={course.name}
            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
            placeholder={`Subject #${index + 1}`}
            className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-rose-50/60 dark:bg-dark-bg/90 border border-rose-200/80 dark:border-maroon-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30"
          />
        </div>
        <button
          onClick={() => removeCourse(course.id)}
          className="p-2 rounded-xl text-rose-400/80 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-maroon-950 active:scale-95 transition-all flex-shrink-0"
          title="Remove course"
          aria-label="Delete course"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Flex Row / Mobile Bottom Inputs Grid */}
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        
        {/* Desktop Index */}
        <div className="hidden sm:flex items-center text-rose-500/70 flex-shrink-0">
          <span className="w-6 text-center text-xs font-bold">
            {index + 1}
          </span>
        </div>

        {/* Desktop Course Name Input */}
        <div className="hidden sm:block flex-1 min-w-[140px]">
          <input
            type="text"
            value={course.name}
            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
            placeholder={`e.g. ${index === 0 ? 'Data Structures & Algorithms' : index === 1 ? 'Linear Algebra' : index === 2 ? 'Physics II' : 'Course Name'}`}
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200/80 dark:border-maroon-900/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30 transition-all duration-150"
          />
        </div>

        {/* Credits Input (Stepper-friendly) */}
        <div className="flex-1 sm:flex-initial sm:w-28 flex-shrink-0">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={course.credits === 0 ? '' : course.credits}
              onChange={(e) => updateCourse(course.id, 'credits', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
              placeholder="Credits (3)"
              className="w-full px-3 py-2 text-sm rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200/80 dark:border-maroon-900/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30 text-center font-bold"
            />
          </div>
        </div>

        {/* Grade Selector or Percentage Input */}
        <div className="flex-1 sm:flex-initial sm:w-36 flex-shrink-0">
          {isPercentage ? (
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                placeholder="Marks"
                className="w-full px-3 py-2 text-sm rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200/80 dark:border-maroon-900/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-rose-100 text-center font-bold"
              />
              <span className="absolute right-2.5 top-2.5 text-xs font-bold text-rose-400">%</span>
            </div>
          ) : (
            <select
              value={course.grade}
              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200/80 dark:border-maroon-900/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-rose-100 font-bold cursor-pointer"
            >
              {scaleGrades.map((g) => (
                <option key={g.grade} value={g.grade} className="bg-white dark:bg-dark-surface text-slate-900 dark:text-rose-100">
                  {g.label || `${g.grade} (${g.points} pts)`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quality Points Badge */}
        <div className="flex items-center justify-center flex-shrink-0 px-2.5 py-2 rounded-xl bg-rose-100/50 dark:bg-maroon-950/70 border border-rose-200/50 dark:border-maroon-800/50 text-xs min-w-[70px] sm:min-w-[85px]">
          <span className="font-extrabold text-rose-600 dark:text-rose-300">
            {(course.qualityPoints || (course.credits * (course.points || 0))).toFixed(1)}
          </span>
          <span className="text-[10px] text-rose-400 font-normal ml-1 hidden sm:inline">pts</span>
        </div>

        {/* Desktop Delete Row Button */}
        <div className="hidden sm:flex items-center justify-center">
          <button
            onClick={() => removeCourse(course.id)}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-maroon-950/80 transition-all duration-150"
            title="Remove course"
            aria-label="Delete course row"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
