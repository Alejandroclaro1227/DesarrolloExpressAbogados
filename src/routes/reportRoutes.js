const express = require('express');
const { getLawyerLawsuits } = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { getLawyerByIdValidation } = require('../validations/lawyerValidation');

const router = express.Router();

// Proteger todas las rutas
router.use(authenticate);

/**
 * @swagger
 * /reports/lawyers/{id}/lawsuits:
 *   get:
 *     summary: Obtener reporte de demandas por abogado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del abogado
 *     responses:
 *       200:
 *         description: Reporte de demandas del abogado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     lawyer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         specialization:
 *                           type: string
 *                     lawsuits:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           case_number:
 *                             type: string
 *                           status:
 *                             type: string
 *                           case_type:
 *                             type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         pending:
 *                           type: integer
 *                         assigned:
 *                           type: integer
 *                         resolved:
 *                           type: integer
 *       404:
 *         description: Abogado no encontrado
 *       401:
 *         description: No autenticado
 */
router.get('/lawyers/:id/lawsuits', validate(getLawyerByIdValidation), getLawyerLawsuits);

module.exports = router;

