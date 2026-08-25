export const DEFAULT_SCALES = {
  us_4_0: {
    id: 'us_4_0',
    name: 'Standard US 4.0 Scale',
    maxGpa: 4.0,
    description: 'A = 4.0, A- = 3.7, B+ = 3.3, ...',
    grades: [
      { grade: 'A+', points: 4.0, minPercent: 97 },
      { grade: 'A',  points: 4.0, minPercent: 93 },
      { grade: 'A-', points: 3.7, minPercent: 90 },
      { grade: 'B+', points: 3.3, minPercent: 87 },
      { grade: 'B',  points: 3.0, minPercent: 83 },
      { grade: 'B-', points: 2.7, minPercent: 80 },
      { grade: 'C+', points: 2.3, minPercent: 77 },
      { grade: 'C',  points: 2.0, minPercent: 73 },
      { grade: 'C-', points: 1.7, minPercent: 70 },
      { grade: 'D+', points: 1.3, minPercent: 67 },
      { grade: 'D',  points: 1.0, minPercent: 60 },
      { grade: 'F',  points: 0.0, minPercent: 0 }
    ]
  },
  us_4_33: {
    id: 'us_4_33',
    name: 'US 4.33 Scale (Honors / Weighted)',
    maxGpa: 4.33,
    description: 'A+ = 4.33, A = 4.0, ...',
    grades: [
      { grade: 'A+', points: 4.33, minPercent: 97 },
      { grade: 'A',  points: 4.0, minPercent: 93 },
      { grade: 'A-', points: 3.7, minPercent: 90 },
      { grade: 'B+', points: 3.3, minPercent: 87 },
      { grade: 'B',  points: 3.0, minPercent: 83 },
      { grade: 'B-', points: 2.7, minPercent: 80 },
      { grade: 'C+', points: 2.3, minPercent: 77 },
      { grade: 'C',  points: 2.0, minPercent: 73 },
      { grade: 'C-', points: 1.7, minPercent: 70 },
      { grade: 'D+', points: 1.3, minPercent: 67 },
      { grade: 'D',  points: 1.0, minPercent: 60 },
      { grade: 'F',  points: 0.0, minPercent: 0 }
    ]
  },
  scale_10: {
    id: 'scale_10',
    name: '10.0 Scale (India / International)',
    maxGpa: 10.0,
    description: 'O = 10, A+ = 9, A = 8, B+ = 7, ...',
    grades: [
      { grade: 'O', points: 10.0, label: 'O (Outstanding)', minPercent: 90 },
      { grade: 'A+', points: 9.0, label: 'A+ (Excellent)', minPercent: 80 },
      { grade: 'A', points: 8.0, label: 'A (Very Good)', minPercent: 70 },
      { grade: 'B+', points: 7.0, label: 'B+ (Good)', minPercent: 60 },
      { grade: 'B', points: 6.0, label: 'B (Above Avg)', minPercent: 55 },
      { grade: 'C', points: 5.0, label: 'C (Average)', minPercent: 50 },
      { grade: 'P', points: 4.0, label: 'P (Pass)', minPercent: 40 },
      { grade: 'F', points: 0.0, label: 'F (Fail)', minPercent: 0 }
    ]
  },
  scale_5: {
    id: 'scale_5',
    name: '5.0 Scale',
    maxGpa: 5.0,
    description: 'A = 5.0, B = 4.0, C = 3.0, ...',
    grades: [
      { grade: 'A', points: 5.0, minPercent: 80 },
      { grade: 'B', points: 4.0, minPercent: 70 },
      { grade: 'C', points: 3.0, minPercent: 60 },
      { grade: 'D', points: 2.0, minPercent: 50 },
      { grade: 'E', points: 1.0, minPercent: 40 },
      { grade: 'F', points: 0.0, minPercent: 0 }
    ]
  },
  percentage: {
    id: 'percentage',
    name: 'Direct Percentage Mode (0-100%)',
    maxGpa: 100.0,
    description: 'Calculate weighted percentage directly from marks',
    grades: []
  }
};

/**
 * Calculates GPA from courses on frontend
 */
export function calculateLocalGpa(courses, scaleId = 'us_4_0', customScale = null, cumulativeData = null) {
  let scale = DEFAULT_SCALES[scaleId] || DEFAULT_SCALES.us_4_0;
  const gradePointsMap = {};

  if (scaleId === 'custom' && customScale && Array.isArray(customScale.grades)) {
    scale = customScale;
    customScale.grades.forEach(g => {
      gradePointsMap[g.grade.trim().toUpperCase()] = parseFloat(g.points) || 0;
    });
  } else if (scale && scale.grades) {
    scale.grades.forEach(g => {
      gradePointsMap[g.grade.toUpperCase()] = parseFloat(g.points);
      const shortCode = g.grade.split(' ')[0].toUpperCase();
      gradePointsMap[shortCode] = parseFloat(g.points);
    });
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;

  const processedCourses = courses.map((c, idx) => {
    const credits = parseFloat(c.credits) || 0;
    const name = c.name || `Course ${idx + 1}`;
    let grade = c.grade ? String(c.grade).trim() : 'A';
    let points = 0;

    if (scaleId === 'percentage') {
      points = parseFloat(c.grade) || 0;
    } else if (c.points !== undefined && c.points !== null && !isNaN(parseFloat(c.points))) {
      points = parseFloat(c.points);
    } else {
      const upper = grade.toUpperCase();
      const short = upper.split(' ')[0];
      if (gradePointsMap[upper] !== undefined) {
        points = gradePointsMap[upper];
      } else if (gradePointsMap[short] !== undefined) {
        points = gradePointsMap[short];
      } else {
        points = 0;
      }
    }

    const qualityPoints = credits * points;
    if (credits > 0) {
      totalCredits += credits;
      totalQualityPoints += qualityPoints;
    }

    return {
      ...c,
      name,
      credits,
      grade,
      points: Number(points.toFixed(2)),
      qualityPoints: Number(qualityPoints.toFixed(2))
    };
  });

  const semesterGpa = totalCredits > 0 ? Number((totalQualityPoints / totalCredits).toFixed(2)) : 0.00;
  const maxScaleGpa = scale ? (scale.maxGpa || 4.0) : 4.0;

  // Cumulative calculation
  let cumulative = null;
  if (cumulativeData && (parseFloat(cumulativeData.previousCredits) > 0 || parseFloat(cumulativeData.previousGpa) > 0)) {
    const prevGpa = parseFloat(cumulativeData.previousGpa) || 0;
    const prevCredits = parseFloat(cumulativeData.previousCredits) || 0;
    const prevPoints = prevGpa * prevCredits;

    const newTotalCredits = prevCredits + totalCredits;
    const newTotalPoints = prevPoints + totalQualityPoints;
    const newCumulativeGpa = newTotalCredits > 0 ? Number((newTotalPoints / newTotalCredits).toFixed(2)) : 0.00;

    cumulative = {
      previousGpa: prevGpa,
      previousCredits: prevCredits,
      previousPoints: Number(prevPoints.toFixed(2)),
      newTotalCredits,
      newTotalPoints: Number(newTotalPoints.toFixed(2)),
      newCumulativeGpa
    };
  }

  // Academic Standing
  const effectiveGpa = cumulative ? cumulative.newCumulativeGpa : semesterGpa;
  let academicStanding = 'Good Standing';
  let academicBadgeColor = 'emerald';

  if (scaleId === 'scale_10') {
    if (effectiveGpa >= 9.0) {
      academicStanding = 'First Class with Distinction (Outstanding)';
      academicBadgeColor = 'purple';
    } else if (effectiveGpa >= 7.5) {
      academicStanding = 'First Class';
      academicBadgeColor = 'emerald';
    } else if (effectiveGpa >= 6.0) {
      academicStanding = 'Second Class';
      academicBadgeColor = 'blue';
    } else if (effectiveGpa >= 4.0) {
      academicStanding = 'Pass Division';
      academicBadgeColor = 'amber';
    } else {
      academicStanding = 'Academic Warning / Fail';
      academicBadgeColor = 'rose';
    }
  } else if (scaleId === 'percentage') {
    if (effectiveGpa >= 85) {
      academicStanding = 'Distinction (High Honors)';
      academicBadgeColor = 'purple';
    } else if (effectiveGpa >= 70) {
      academicStanding = 'First Division';
      academicBadgeColor = 'emerald';
    } else if (effectiveGpa >= 50) {
      academicStanding = 'Second Division';
      academicBadgeColor = 'blue';
    } else {
      academicStanding = 'Academic Probation';
      academicBadgeColor = 'rose';
    }
  } else {
    const ratio = effectiveGpa / maxScaleGpa;
    if (ratio >= 0.95) {
      academicStanding = "Summa Cum Laude (Dean's List)";
      academicBadgeColor = 'purple';
    } else if (ratio >= 0.88) {
      academicStanding = "Magna Cum Laude (High Honors)";
      academicBadgeColor = 'indigo';
    } else if (ratio >= 0.80) {
      academicStanding = "Cum Laude (Dean's Honor Roll)";
      academicBadgeColor = 'emerald';
    } else if (ratio >= 0.65) {
      academicStanding = 'Good Academic Standing';
      academicBadgeColor = 'blue';
    } else if (ratio >= 0.50) {
      academicStanding = 'Satisfactory Standing';
      academicBadgeColor = 'amber';
    } else {
      academicStanding = 'Academic Warning / Probation';
      academicBadgeColor = 'rose';
    }
  }

  return {
    scaleId,
    scaleName: scale ? scale.name : 'Custom Scale',
    maxGpa: maxScaleGpa,
    courses: processedCourses,
    totalCredits: Number(totalCredits.toFixed(2)),
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    semesterGpa,
    cumulative,
    academicStanding,
    academicBadgeColor,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Calculates target GPA for planner
 */
export function calculateLocalTargetGpa({ currentGpa, currentCredits, targetGpa, remainingCredits, maxScale = 4.0 }) {
  const cGpa = parseFloat(currentGpa) || 0;
  const cCredits = parseFloat(currentCredits) || 0;
  const tGpa = parseFloat(targetGpa) || 0;
  const rCredits = parseFloat(remainingCredits) || 0;

  if (rCredits <= 0) return null;

  const currentPoints = cGpa * cCredits;
  const targetTotalCredits = cCredits + rCredits;
  const targetTotalPoints = tGpa * targetTotalCredits;
  const requiredPoints = targetTotalPoints - currentPoints;
  const requiredGpa = Number((requiredPoints / rCredits).toFixed(2));

  return {
    currentGpa: cGpa,
    currentCredits: cCredits,
    targetGpa: tGpa,
    remainingCredits: rCredits,
    targetTotalCredits,
    requiredGpa,
    isAchievable: requiredGpa <= maxScale && requiredGpa >= 0,
    requiredPoints: Number(requiredPoints.toFixed(2))
  };
}
