import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  FileText, 
  Download, 
  FileSpreadsheet
} from 'lucide-react';
import { exportClientPdf, exportCsv } from '../utils/pdfExport';
import { ApiService } from '../services/api';

export default function ExportModal({
  isOpen,
  onClose,
  currentCalculation,
  semesterName
}) {
  const [studentName, setStudentName] = useState(localStorage.getItem('gpaflow_student_name') || 'Alex Johnson');
  const [institution, setInstitution] = useState(localStorage.getItem('gpaflow_institution') || 'University Academic Dept.');
  const [exporting, setExporting] = useState(false);

  if (!isOpen || !currentCalculation) return null;

  const getPayload = () => ({
    studentName,
    institution,
    semesterName: semesterName || 'Semester',
    scaleName: currentCalculation.scaleName,
    scaleId: currentCalculation.scaleId,
    maxGpa: currentCalculation.maxGpa,
    courses: currentCalculation.courses,
    semesterGpa: currentCalculation.semesterGpa,
    totalCredits: currentCalculation.totalCredits,
    totalQualityPoints: currentCalculation.totalQualityPoints,
    academicStanding: currentCalculation.academicStanding,
    cumulative: currentCalculation.cumulative
  });

  const handleDownloadPdf = async () => {
    setExporting(true);
    localStorage.setItem('gpaflow_student_name', studentName);
    localStorage.setItem('gpaflow_institution', institution);

    const payload = getPayload();
    const serverSuccess = await ApiService.exportServerPdf(payload);
    if (!serverSuccess) {
      exportClientPdf(payload);
    }
    setExporting(false);
    onClose();
  };

  const handleDownloadCsv = () => {
    localStorage.setItem('gpaflow_student_name', studentName);
    localStorage.setItem('gpaflow_institution', institution);
    exportCsv(getPayload());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="glass-panel rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden border-t sm:border border-rose-300 dark:border-maroon-900/90 shadow-2xl transition-all"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-rose-500/40 rounded-full mx-auto mt-2.5 sm:hidden" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/60 dark:border-maroon-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-maroon-950 text-rose-400 border border-rose-900/60">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                Export Academic Transcript
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-300/60">
                Generate a verified PDF report or CSV spreadsheet
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

        {/* Content Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                University / Institution Name
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Transcript Preview Snippet */}
          <div className="p-4 rounded-2xl bg-rose-100/50 dark:bg-maroon-950/70 border border-rose-200/60 dark:border-maroon-800/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-800 dark:text-rose-100">{semesterName}</div>
              <div className="text-[11px] text-slate-500 dark:text-rose-300/60">
                {currentCalculation.courses.length} Courses • {currentCalculation.totalCredits} Credits
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                {Number(currentCalculation.semesterGpa).toFixed(2)} GPA
              </div>
              <div className="text-[10px] font-semibold text-rose-300">
                {currentCalculation.academicStanding}
              </div>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPdf}
              disabled={exporting}
              className="py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all border border-rose-700/50"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="py-3 px-4 rounded-2xl font-bold text-xs bg-rose-50 dark:bg-dark-bg hover:bg-rose-100 dark:hover:bg-dark-surface text-slate-800 dark:text-rose-200 border border-rose-200 dark:border-maroon-900 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4 text-rose-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
