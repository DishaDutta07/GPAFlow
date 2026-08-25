const express = require('express');
const router = express.Router();
const gpaController = require('../controllers/gpaController');
const authRouter = require('./auth');
const { optionalAuth, requireAuth } = require('../middleware/auth');

// Mount Auth Sub-router
router.use('/auth', authRouter);

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'GPAFlow API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Grading Scales
router.get('/scales', gpaController.getScales);

// GPA Calculation & Target Planner (Public calculations)
router.post('/calculate', gpaController.calculate);
router.post('/calculate/target', gpaController.targetPlanner);

// User History & Persistence (Supports authenticated user or guest fallback)
router.get('/history', optionalAuth, gpaController.getHistory);
router.post('/save', optionalAuth, gpaController.saveSemester);
router.delete('/history/:id', optionalAuth, gpaController.deleteHistory);

// PDF Export
router.post('/export-pdf', gpaController.exportPdf);

module.exports = router;
