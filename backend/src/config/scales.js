/**
 * GPAFlow Grading Scales Configuration
 * Supports standard US 4.0, US 4.33, 10.0 International/Indian, 5.0 Scale, and Percentage mapping.
 */

const GRADING_SCALES = {
  us_4_0: {
    id: 'us_4_0',
    name: 'Standard US 4.0 Scale',
    maxGpa: 4.0,
    description: 'Most standard US universities (A = 4.0, A- = 3.7, B+ = 3.3, ...)',
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
    description: 'Universities offering A+ as 4.33 points',
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
    description: 'Common in IITs, NITs, VTU, Anna University, and global universities',
    grades: [
      { grade: 'O (Outstanding)', points: 10.0, minPercent: 90 },
      { grade: 'A+ (Excellent)',  points: 9.0, minPercent: 80 },
      { grade: 'A (Very Good)',   points: 8.0, minPercent: 70 },
      { grade: 'B+ (Good)',       points: 7.0, minPercent: 60 },
      { grade: 'B (Above Avg)',   points: 6.0, minPercent: 55 },
      { grade: 'C (Average)',     points: 5.0, minPercent: 50 },
      { grade: 'P (Pass)',        points: 4.0, minPercent: 40 },
      { grade: 'F (Fail)',        points: 0.0, minPercent: 0 }
    ]
  },
  scale_5: {
    id: 'scale_5',
    name: '5.0 Scale',
    maxGpa: 5.0,
    description: 'Used by universities with a 5-point grading system',
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
    name: 'Direct Percentage Mode',
    maxGpa: 100.0,
    description: 'Calculate weighted percentage directly from course marks (0-100%)',
    grades: []
  }
};

module.exports = { GRADING_SCALES };
