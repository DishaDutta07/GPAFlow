import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GpaGauge({
  gpa = 0,
  maxGpa = 4.0,
  scaleId = 'us_4_0',
  academicStanding = 'Good Standing',
  academicBadgeColor = 'emerald',
  isCumulativeActive = false,
  cumulativeGpa = null
}) {
  const prevGpaRef = useRef(gpa);
  const displayGpa = isCumulativeActive && cumulativeGpa !== null ? cumulativeGpa : gpa;
  const percentage = Math.min(Math.max((displayGpa / (maxGpa || 4.0)) * 100, 0), 100);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Dark Maroon & Ruby palette mapping
  const getColorStyles = () => {
    switch (academicBadgeColor) {
      case 'purple':
        return {
          stroke: 'url(#maroonRubyGradient)',
          glow: 'glow-maroon',
          badgeBg: 'bg-rose-950/80 text-rose-200 border-rose-700/80 shadow-rose-950/50',
          textGradient: 'from-rose-500 via-rose-300 to-amber-200 dark:from-rose-300 dark:via-rose-400 dark:to-rose-100',
          iconColor: 'text-rose-400'
        };
      case 'indigo':
        return {
          stroke: 'url(#maroonCrimsonGradient)',
          glow: 'glow-maroon',
          badgeBg: 'bg-maroon-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/50',
          textGradient: 'from-rose-400 to-rose-200 dark:from-rose-300 dark:to-rose-100',
          iconColor: 'text-rose-400'
        };
      case 'emerald':
        return {
          stroke: 'url(#emeraldGradient)',
          glow: 'glow-emerald',
          badgeBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-800/80',
          textGradient: 'from-emerald-400 to-teal-200',
          iconColor: 'text-emerald-400'
        };
      case 'blue':
        return {
          stroke: 'url(#maroonRubyGradient)',
          glow: 'glow-maroon',
          badgeBg: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
          textGradient: 'from-rose-400 to-rose-200',
          iconColor: 'text-rose-400'
        };
      case 'amber':
        return {
          stroke: '#f59e0b',
          glow: '',
          badgeBg: 'bg-amber-950/70 text-amber-200 border-amber-800/60',
          textGradient: 'from-amber-400 to-orange-200',
          iconColor: 'text-amber-400'
        };
      case 'rose':
      default:
        return {
          stroke: '#e11d48',
          glow: '',
          badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-800',
          textGradient: 'from-rose-500 to-rose-300',
          iconColor: 'text-rose-500'
        };
    }
  };

  const colors = getColorStyles();

  // Trigger celebration confetti on achieving top standing
  useEffect(() => {
    const isTopTier = (maxGpa === 4.0 && displayGpa >= 3.8) || (maxGpa === 10.0 && displayGpa >= 9.0) || (maxGpa === 100.0 && displayGpa >= 88.0);
    const wasLower = prevGpaRef.current < (maxGpa === 4.0 ? 3.8 : maxGpa === 10.0 ? 9.0 : 88.0);
    
    if (isTopTier && wasLower && displayGpa > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#be123c', '#fb7185', '#f59e0b', '#ffd700']
        });
      } catch (e) {
        // Safe fail
      }
    }
    prevGpaRef.current = displayGpa;
  }, [displayGpa, maxGpa]);

  return (
    <div className={`glass-card rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 ${colors.glow}`}>
      
      {/* Background ambient dark maroon glow */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-rose-900/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-maroon-900/35 rounded-full blur-3xl pointer-events-none" />

      {/* Header Label */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80 dark:text-rose-400/80 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
          {isCumulativeActive ? 'Cumulative CGPA' : 'Semester GPA'}
        </span>
        <span className="text-[11px] font-semibold text-rose-400/90 bg-rose-950/70 px-2 py-0.5 rounded-md border border-rose-900/60">
          Max: {maxGpa}
        </span>
      </div>

      {/* Radial Gauge Visual */}
      <div className="relative my-3 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="maroonRubyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <linearGradient id="maroonCrimsonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-rose-200/50 dark:text-maroon-950/80"
          />

          {/* Animated Gauge Ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            key={displayGpa}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <span className={`text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>
              {Number(displayGpa).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-rose-300/60 dark:text-rose-400/60 mt-0.5">
              out of {Number(maxGpa).toFixed(1)}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Academic Standing Badge */}
      <div className="w-full mt-2">
        <motion.div
          key={academicStanding}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${colors.badgeBg}`}
        >
          <Award className={`w-4 h-4 flex-shrink-0 ${colors.iconColor}`} />
          <span className="truncate">{academicStanding}</span>
        </motion.div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[10px] text-rose-300/70 dark:text-rose-400/70 mb-1 font-medium">
          <span>Performance Efficiency</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-rose-200/50 dark:bg-maroon-950 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-maroon-800 via-rose-600 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

    </div>
  );
}
