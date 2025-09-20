const express = require('express');
const { createLawsuit, getLawsuits, assignLawyer } = require('../controllers/lawsuitController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { 
  createLawsuitValidation, 
  getLawsuitsValidation, 
  assignLawyerValidation 
} = require('../validations/lawsuitValidation');

const router = express.Router();

// Proteger todas las rutas
router.use(authenticate);

/**
 * @swagger
 * /lawsuits:
 *   post:
 *     summary:  Crear una nueva demanda
 *     description: |
 *       **¿Para qué sirve?**
 *       - Registra una nueva demanda en el sistema legal
 *       - Permite gestionar casos del bufete
 *       - Inicia el proceso de asignación de abogados
 *       
 *       **¿Qué necesitas?**
 *       -  **AUTENTICACIÓN REQUERIDA**: Token JWT válido
 *       -  **ACCESO**: Admins y operadores pueden crear demandas
 *       - 📋 **Datos obligatorios**: número de caso, demandante, demandado, tipo
 *       
 *       **Validaciones de negocio:**
 *       - Número de caso debe seguir formato: ABC-YYYY-001
 *       - Demandante y demandado no pueden ser la misma persona
 *       - El número de caso debe ser único en el sistema
 *       
 *       **Tipos de caso disponibles:**
 *       - `civil` - Derecho civil
 *       - `criminal` - Derecho penal
 *       - `labor` - Derecho laboral
 *       - `commercial` - Derecho comercial
 *     tags: [ Demandas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - case_number
 *               - plaintiff
 *               - defendant
 *               - case_type
 *             properties:
 *               case_number:
 *                 type: string
 *                 description: Número único del caso (formato ABC-YYYY-001)
 *                 pattern: "^[A-Z]{2,4}-\\d{4}-\\d{3,4}$"
 *                 example: DEM-2025-001
 *               plaintiff:
 *                 type: string
 *                 description: Nombre del demandante (persona o empresa)
 *                 minLength: 2
 *                 maxLength: 200
 *                 example: Empresa XYZ S.A.S
 *               defendant:
 *                 type: string
 *                 description: Nombre del demandado (persona o empresa)
 *                 minLength: 2
 *                 maxLength: 200
 *                 example: Juan Carlos Rodríguez
 *               case_type:
 *                 type: string
 *                 description: Tipo de caso legal
 *                 enum: [civil, criminal, labor, commercial]
 *                 example: labor
 *               status:
 *                 type: string
 *                 description: Estado inicial de la demanda
 *                 enum: [pending, assigned, resolved]
 *                 default: pending
 *                 example: pending
 *     responses:
 *       201:
 *         description:  Demanda creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Demanda creada exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     lawsuit:
 *                       $ref: '#/components/schemas/Lawsuit'
 *       400:
 *         description:  Datos inválidos o reglas de negocio violadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Demandante y demandado no pueden ser la misma persona
 *       401:
 *         description:  No autenticado - Token JWT requerido
 *       409:
 *         description:  Número de caso ya existe en el sistema
 */
router.post('/', validate(createLawsuitValidation), createLawsuit);

/**
 * @swagger
 * /lawsuits:
 *   get:
 *     summary: Obtener lista de demandas con filtros
 *     tags: [Demandas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, assigned, resolved]
 *         description: Filtrar por estado
 *       - in: query
 *         name: lawyer_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID del abogado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de demandas
 *       401:
 *         description: No autenticado
 */
router.get('/', validate(getLawsuitsValidation), getLawsuits);

/**
 * @swagger
 * /lawsuits/{id}/assign:
 *   put:
 *     summary: Asignar abogado a una demanda
 *     tags: [Demandas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la demanda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lawyer_id
 *             properties:
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 example: uuid-del-abogado
 *     responses:
 *       200:
 *         description: Abogado asignado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Demanda o abogado no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.put('/:id/assign', authorize('admin'), validate(assignLawyerValidation), assignLawyer);

module.exports = router;

