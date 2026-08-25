import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, CheckCircle2, Sigma } from 'lucide-react';

export default function StatsSummary({
  totalCredits = 0,
  totalPoints = 0,
  courseCount = 0,
  semesterGpa = 0,
  maxGpa = 4.0,
  cumulative = null,
  isCumulativeActive = false
}) {
  const stats = [
    {
      title: 'Total Credits',
      value: isCumulativeActive && cumulative ? `${cumulative.newTotalCredits}` : `${totalCredits}`,
      subtitle: isCumulativeActive && cumulative ? `Sem: ${totalCredits} | Prior: ${cumulative.previousCredits}` : `${courseCount} courses enrolled`,
      icon: BookOpen,
      color: 'from-rose-600 to-rose-400',
      textColor: 'text-rose-400',
      bgGlow: 'bg-rose-950/80 border border-rose-900/50'
    },
    {
      title: 'Quality / Grade Points',
      value: isCumulativeActive && cumulative ? Number(cumulative.newTotalPoints).toFixed(1) : Number(totalPoints).toFixed(1),
      subtitle: isCumulativeActive && cumulative ? `Sem: ${Number(totalPoints).toFixed(1)} pts` : 'Credits × Grade Points',
      icon: Sigma,
      color: 'from-rose-700 to-pink-500',
      textColor: 'text-rose-400',
      bgGlow: 'bg-rose-950/80 border border-rose-900/50'
    },
    {
      title: 'Average Credit / Course',
      value: courseCount > 0 ? (totalCredits / courseCount).toFixed(1) : '0.0',
      subtitle: 'Credits per subject',
      icon: CheckCircle2,
      color: 'from-rose-500 to-amber-400',
      textColor: 'text-rose-300',
      bgGlow: 'bg-rose-950/80 border border-rose-900/50'
    },
    {
      title: isCumulativeActive ? 'Cumulative CGPA' : 'Semester GPA',
      value: isCumulativeActive && cumulative ? Number(cumulative.newCumulativeGpa).toFixed(2) : Number(semesterGpa).toFixed(2),
      subtitle: `Scale out of ${Number(maxGpa).toFixed(1)}`,
      icon: Award,
      color: 'from-maroon-800 to-rose-500',
      textColor: 'text-rose-400',
      bgGlow: 'bg-rose-950/80 border border-rose-900/50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-rose-700/60"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-rose-300/70">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl ${stat.bgGlow} ${stat.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-rose-100 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-rose-300/50 mt-0.5 truncate">
                {stat.subtitle}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
