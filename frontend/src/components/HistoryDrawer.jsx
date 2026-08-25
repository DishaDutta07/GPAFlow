import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  History, 
  Trash2, 
  UploadCloud, 
  Download, 
  TrendingUp, 
  Calendar, 
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';
import { exportClientPdf } from '../utils/pdfExport';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onLoadSemester,
  onDeleteSemester,
  maxGpa = 4.0
}) {
  if (!isOpen) return null;

  // Prepare chart data (chronological)
  const chartData = [...history]
    .reverse()
    .map((item, idx) => ({
      name: item.semesterName || `Sem ${idx + 1}`,
      gpa: item.semesterGpa || 0,
      cgpa: item.cumulative ? item.cumulative.newCumulativeGpa : item.semesterGpa,
      credits: item.totalCredits || 0
    }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md glass-panel border-l border-rose-300 dark:border-maroon-900 shadow-2xl flex flex-col h-full"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-rose-200/60 dark:border-maroon-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-maroon-950 text-rose-400 border border-rose-900/60">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                  Semester History
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300/60">
                  {history.length} saved calculation{history.length === 1 ? '' : 's'}
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

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* GPA Progression Chart */}
            {chartData.length >= 2 && (
              <div className="glass-card rounded-2xl p-4 border border-rose-200/60 dark:border-maroon-900/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                    GPA Progression Timeline
                  </span>
                  <span className="text-[10px] text-rose-400/80 font-semibold">
                    Trend
                  </span>
                </div>
                
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="maroonGpaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#881337" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} stroke="#881337" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#fda4af" />
                      <YAxis domain={[0, maxGpa]} tick={{ fontSize: 10 }} stroke="#fda4af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18080f',
                          borderColor: '#4c0519',
                          borderRadius: '0.75rem',
                          color: '#ffe4e8',
                          fontSize: '12px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="gpa"
                        name="Semester GPA"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#maroonGpaGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* List of Semesters */}
            {history.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-100/50 dark:bg-maroon-950/70 border border-rose-200 dark:border-maroon-800/50 flex items-center justify-center text-rose-500 mb-3">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-rose-200">
                  No Saved Semesters Yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-rose-300/60 mt-1 max-w-[220px]">
                  Calculate your courses and click <strong>Save</strong> on the dashboard to start tracking your academic history!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((sem) => (
                  <div
                    key={sem.id}
                    className="p-4 rounded-2xl glass-card border border-rose-200/80 dark:border-maroon-900/80 hover:border-rose-500 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-rose-100">
                          {sem.semesterName || 'Semester'}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-rose-300/60 mt-0.5">
                          <Calendar className="w-3 h-3 text-rose-400" />
                          <span>{new Date(sem.created_at || Date.now()).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{sem.courses ? sem.courses.length : 0} courses</span>
                        </div>
                      </div>

                      {/* GPA Badge */}
                      <div className="text-right">
                        <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                          {Number(sem.semesterGpa || 0).toFixed(2)}
                        </span>
                        <div className="text-[10px] text-rose-300/60 font-semibold">
                          {sem.totalCredits} credits
                        </div>
                      </div>
                    </div>

                    {/* Academic Standing Pill */}
                    {sem.academicStanding && (
                      <div className="text-[11px] font-bold text-rose-200 bg-rose-950/90 px-2.5 py-1 rounded-lg border border-rose-800/80 inline-flex items-center gap-1.5 self-start">
                        <span>{sem.academicStanding}</span>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-rose-100 dark:border-maroon-950">
                      <button
                        onClick={() => {
                          onLoadSemester(sem);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Load to Calculator</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => exportClientPdf(sem)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-maroon-950 transition-colors"
                          title="Export PDF transcript for this semester"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSemester(sem.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-950 transition-colors"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
