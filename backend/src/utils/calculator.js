const { GRADING_SCALES } = require('../config/scales');

/**
 * Calculates GPA from an array of courses and scale configuration.
 *
 * @param {Array} courses - [{ name: string, credits: number, grade: string, points?: number }]
 * @param {string} scaleId - 'us_4_0' | 'us_4_33' | 'scale_10' | 'scale_5' | 'percentage' | 'custom'
 * @param {Object} customScale - Optional custom grading scale map { "A": 4.0, ... }
 * @param {Object} cumulativeData - Optional { previousGpa: number, previousCredits: number }
 */
function calculateGpaData(courses = [], scaleId = 'us_4_0', customScale = null, cumulativeData = null) {
  let scale = GRADING_SCALES[scaleId] || GRADING_SCALES.us_4_0;
  const gradePointsMap = {};

  if (scaleId === 'custom' && customScale && Array.isArray(customScale.grades)) {
    scale = customScale;
    customScale.grades.forEach(g => {
      gradePointsMap[g.grade.trim().toUpperCase()] = parseFloat(g.points);
    });
  } else if (scale && scale.grades) {
    scale.grades.forEach(g => {
      // support both exact match and short code like 'O' in 'O (Outstanding)'
      gradePointsMap[g.grade.toUpperCase()] = parseFloat(g.points);
      const shortCode = g.grade.split(' ')[0].toUpperCase();
      gradePointsMap[shortCode] = parseFloat(g.points);
    });
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;
  const processedCourses = [];

  courses.forEach((c, index) => {
    const credits = parseFloat(c.credits) || 0;
    const name = c.name ? c.name.trim() : `Course ${index + 1}`;
    let grade = c.grade ? String(c.grade).trim() : 'A';
    let points = 0;

    if (scaleId === 'percentage') {
      // Grade is a numeric percentage like 88
      const percent = parseFloat(c.grade) || 0;
      points = percent;
    } else if (c.points !== undefined && c.points !== null && !isNaN(parseFloat(c.points))) {
      points = parseFloat(c.points);
    } else {
      const upperGrade = grade.toUpperCase();
      const shortGrade = upperGrade.split(' ')[0];
      if (gradePointsMap[upperGrade] !== undefined) {
        points = gradePointsMap[upperGrade];
      } else if (gradePointsMap[shortGrade] !== undefined) {
        points = gradePointsMap[shortGrade];
      } else {
        // Fallback default
        points = 0;
      }
    }

    const qualityPoints = credits * points;
    if (credits > 0) {
      totalCredits += credits;
      totalQualityPoints += qualityPoints;
    }

    processedCourses.push({
      id: c.id || `c_${index}`,
      name,
      credits,
      grade,
      points: Number(points.toFixed(2)),
      qualityPoints: Number(qualityPoints.toFixed(2))
    });
  });

  const semesterGpa = totalCredits > 0 ? Number((totalQualityPoints / totalCredits).toFixed(2)) : 0.00;
  const maxScaleGpa = scale ? scale.maxGpa : 4.0;

  // Cumulative GPA calculation
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

  // Academic Standing Determination
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
    // 4.0 / 4.33 Scale
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
 * Calculates required GPA for target CGPA planning ("What-If" planner).
 */
function calculateTargetGpa({ currentGpa, currentCredits, targetGpa, remainingCredits }) {
  const cGpa = parseFloat(currentGpa) || 0;
  const cCredits = parseFloat(currentCredits) || 0;
  const tGpa = parseFloat(targetGpa) || 0;
  const rCredits = parseFloat(remainingCredits) || 0;

  if (rCredits <= 0) {
    return { error: 'Remaining credits must be greater than 0' };
  }

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
    isAchievable: requiredGpa <= 4.0 && requiredGpa >= 0,
    requiredPoints: Number(requiredPoints.toFixed(2))
  };
}

module.exports = {
  calculateGpaData,
  calculateTargetGpa
};
