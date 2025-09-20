const express = require('express');
const { createLawyer, getLawyers, getLawyerById } = require('../controllers/lawyerController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { 
  createLawyerValidation, 
  getLawyersValidation, 
  getLawyerByIdValidation 
} = require('../validations/lawyerValidation');

const router = express.Router();

// Proteger todas las rutas
router.use(authenticate);

/**
 * @swagger
 * /lawyers:
 *   post:
 *     summary: Crear un nuevo abogado
 *     description: |
 *       **¿Para qué sirve?**
 *       - Registra un nuevo abogado en el sistema
 *       - Permite gestionar el equipo legal del bufete
 *       - Asigna especialización y estado del abogado
 *       
 *       **¿Qué necesitas?**
 *       -  **AUTENTICACIÓN REQUERIDA**: Token JWT válido
 *       -  **ROL ADMIN**: Solo administradores pueden crear abogados
 *       -  **Datos obligatorios**: nombre, email, teléfono, especialización
 *       
 *       **¿Cómo autenticarte?**
 *       1. Haz login en `/auth/login` primero
 *       2. Copia el token JWT
 *       3. Haz clic en "Authorize" 🔒 arriba
 *       4. Escribe: `Bearer tu_token_aqui`
 *       
 *       **Validaciones aplicadas:**
 *       - Email debe ser único en el sistema
 *       - Teléfono debe tener entre 7-15 dígitos
 *       - Especialización se capitaliza automáticamente
 *     tags: [ Abogados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del abogado
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Carlos Pérez González
 *               email:
 *                 type: string
 *                 description: Email único del abogado (se valida formato)
 *                 format: email
 *                 example: carlos.perez@bufete.com
 *               phone:
 *                 type: string
 *                 description: Teléfono (7-15 dígitos, solo números)
 *                 pattern: "^[0-9]{7,15}$"
 *                 example: "3001234567"
 *               specialization:
 *                 type: string
 *                 description: Área de especialización legal
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Derecho Laboral
 *               status:
 *                 type: string
 *                 description: Estado del abogado en el sistema
 *                 enum: [active, inactive]
 *                 default: active
 *                 example: active
 *     responses:
 *       201:
 *         description:  Abogado creado exitosamente
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
 *                   example: Abogado creado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     lawyer:
 *                       $ref: '#/components/schemas/Lawyer'
 *       400:
 *         description:  Datos inválidos o validación fallida
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
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Email ya existe en el sistema
 *       401:
 *         description:  No autenticado - Token requerido
 *       403:
 *         description:  Sin permisos - Solo administradores
 *       409:
 *         description:  Email ya existe en el sistema
 */
router.post('/', authorize('admin'), validate(createLawyerValidation), createLawyer);

/**
 * @swagger
 * /lawyers:
 *   get:
 *     summary:  Obtener lista de abogados (paginada)
 *     description: |
 *       **¿Para qué sirve?**
 *       - Lista todos los abogados registrados en el sistema
 *       - Permite paginación para manejar grandes volúmenes de datos
 *       - Filtra por estado (activo/inactivo) y especialización
 *       
 *       **¿Qué necesitas?**
 *       -  **AUTENTICACIÓN REQUERIDA**: Token JWT válido
 *       - 👀 **ACCESO**: Admins y operadores pueden ver la lista
 *       
 *       **Filtros disponibles:**
 *       - `status=active` - Solo abogados activos
 *       - `specialization=Laboral` - Por especialización específica
 *       
 *       **Paginación:**
 *       - Por defecto muestra 10 abogados por página
 *       - Máximo 100 abogados por página
 *       - Incluye información de navegación (siguiente/anterior)
 *     tags: [ Abogados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página a mostrar
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de abogados por página
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filtrar por estado del abogado
 *         example: active
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filtrar por especialización
 *         example: Laboral
 *     responses:
 *       200:
 *         description:  Lista de abogados obtenida exitosamente
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
 *                   example: Abogados obtenidos exitosamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lawyer'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description:  No autenticado - Token JWT requerido
 */
router.get('/', validate(getLawyersValidation), getLawyers);

/**
 * @swagger
 * /lawyers/{id}:
 *   get:
 *     summary: Obtener abogado por ID
 *     tags: [Abogados]
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
 *         description: Datos del abogado
 *       404:
 *         description: Abogado no encontrado
 *       401:
 *         description: No autenticado
 */
router.get('/:id', validate(getLawyerByIdValidation), getLawyerById);

module.exports = router;

