const express = require('express');
const { login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { loginValidation } = require('../validations/authValidation');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     description: |
 *       **¿Para qué sirve?**
 *       - Autentica usuarios en el sistema de gestión de abogados
 *       - Genera un token JWT válido por 24 horas
 *       - Identifica el rol del usuario (admin/operator)
 *       
 *       **¿Qué necesitas?**
 *       - Username y password válidos
 *       - Los usuarios están precargados en la base de datos
 *       
 *       **Usuarios disponibles:**
 *       - `admin` / `admin123` (acceso completo)
 *       - `operator` / `operator123` (solo lectura)
 *       
 *       **¿Cómo usar el token?**
 *       1. Copia el token de la respuesta
 *       2. Haz clic en "Authorize" arriba
 *       3. Escribe: `Bearer tu_token_aqui`
 *       4. Ya puedes usar todos los endpoints protegidos
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del sistema
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso - Token JWT generado
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
 *                     token:
 *                       type: string
 *                       description: Token JWT válido por 24 horas
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: ID único del usuario
 *                         username:
 *                           type: string
 *                           description: Nombre de usuario
 *                         role:
 *                           type: string
 *                           description: Rol del usuario (admin/operator)
 *       401:
 *         description: Credenciales inválidas
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
 *                   example: Usuario o contraseña incorrectos
 */
router.post('/login', validate(loginValidation), login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autenticado
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;

