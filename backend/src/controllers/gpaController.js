const { GRADING_SCALES } = require('../config/scales');
const Store = require('../db/store');
const { calculateGpaData, calculateTargetGpa } = require('../utils/calculator');
const { generateTranscriptPdf } = require('../utils/pdfGenerator');

// GET /api/scales
exports.getScales = (req, res) => {
  try {
    return res.json({
      success: true,
      scales: GRADING_SCALES
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/calculate
exports.calculate = (req, res) => {
  try {
    const { courses, scaleId, customScale, cumulativeData } = req.body;

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one course in the courses array.'
      });
    }

    const result = calculateGpaData(courses, scaleId, customScale, cumulativeData);
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/calculate/target
exports.targetPlanner = (req, res) => {
  try {
    const { currentGpa, currentCredits, targetGpa, remainingCredits } = req.body;
    const result = calculateTargetGpa({ currentGpa, currentCredits, targetGpa, remainingCredits });
    
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/history (Protected / User-isolated)
exports.getHistory = (req, res) => {
  try {
    const userId = req.user ? req.user.userId : 'guest';
    const history = Store.getAll(userId);
    return res.json({
      success: true,
      data: history
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/save (Protected / User-isolated)
exports.saveSemester = (req, res) => {
  try {
    const userId = req.user ? req.user.userId : 'guest';
    const {
      semesterName,
      scaleId,
      courses,
      semesterGpa,
      totalCredits,
      totalPoints,
      academicStanding,
      cumulative
    } = req.body;

    if (!courses || courses.length === 0) {
      return res.status(400).json({ success: false, error: 'Cannot save empty semester.' });
    }

    const saved = Store.save({
      id: req.body.id,
      userId,
      semesterName: semesterName || 'Semester',
      scaleId: scaleId || 'us_4_0',
      courses,
      semesterGpa: semesterGpa !== undefined ? semesterGpa : 0,
      totalCredits: totalCredits !== undefined ? totalCredits : 0,
      totalPoints: totalPoints !== undefined ? totalPoints : 0,
      academicStanding: academicStanding || 'Good Standing',
      cumulative: cumulative || null
    }, userId);

    return res.json({
      success: true,
      message: 'Semester saved successfully',
      data: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/history/:id (Protected / User-isolated)
exports.deleteHistory = (req, res) => {
  try {
    const userId = req.user ? req.user.userId : 'guest';
    const { id } = req.params;
    const success = Store.delete(id, userId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Semester record not found or unauthorized' });
    }
    return res.json({ success: true, message: 'Semester removed from history' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/export-pdf
exports.exportPdf = (req, res) => {
  try {
    const data = req.body;
    
    // Set response headers for PDF download
    const filename = `GPAFlow_${(data.semesterName || 'Report').replace(/\s+/g, '_')}_Transcript.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generateTranscriptPdf(data, res);
  } catch (err) {
    console.error('PDF generation error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate PDF' });
  }
};
