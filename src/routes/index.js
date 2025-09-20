const express = require('express');
const authRoutes = require('./authRoutes');
const lawyerRoutes = require('./lawyerRoutes');
const lawsuitRoutes = require('./lawsuitRoutes');
const reportRoutes = require('./reportRoutes');
const HealthCheck = require('../utils/healthCheck');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/lawyers', lawyerRoutes);
router.use('/lawsuits', lawsuitRoutes);
router.use('/reports', reportRoutes);

// Professional Health Check endpoints
router.get('/health', catchAsync(async (req, res) => {
  const health = await HealthCheck.getHealthStatus();
  return ResponseFormatter.health(res, health.status, health.checks);
}));

router.get('/health/quick', catchAsync(async (req, res) => {
  const health = await HealthCheck.getQuickHealth();
  return ResponseFormatter.health(res, health.status);
}));

// API Information endpoint
router.get('/info', (req, res) => {
  return ResponseFormatter.success(res, {
    name: 'Gestor de Abogados API',
    version: '1.0.0',
    description: 'API REST para gestión de abogados y demandas',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      lawyers: '/api/lawyers',
      lawsuits: '/api/lawsuits',
      reports: '/api/reports',
      health: '/api/health',
      documentation: '/api-docs',
    },
  }, 'API Information');
});

module.exports = router;

