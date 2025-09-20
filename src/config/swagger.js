const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestor de Abogados API',
      version: '1.0.0',
      description: `
# Guía de la API de Gestión de Abogados

## ¿Qué es esta API?
API REST profesional para la gestión completa de **abogados** y **demandas** en un bufete legal.

## Características Principales
- **Arquitectura Clean** con principios SOLID
- **Autenticación JWT** con roles (admin/operator)  
- **Validación robusta** con reglas de negocio
- **Paginación** y filtros avanzados
- **Error handling** profesional
- **Health checks** completos

## ¿Cómo empezar?

### 1. **Autenticación (OBLIGATORIO)**
Todos los endpoints (excepto login) requieren autenticación:

1. Haz **login** en \`/auth/login\` con:
   - **Admin**: \`admin\` / \`admin123\` (acceso completo)
   - **Operador**: \`operator\` / \`operator123\` (solo lectura)

2. **Autoriza** tu sesión:
   - Copia el token JWT de la respuesta
   - Haz clic en **"Authorize"** arriba
   - Escribe: \`Bearer tu_token_aqui\`

### 2. **Flujo típico de uso**
1. Login → Obtener token
2. Crear/listar abogados
3. Crear demandas
4. Asignar abogados a demandas
5. Generar reportes

## Roles y Permisos
- **Admin**: Puede crear, editar y eliminar todo
- **Operator**: Solo puede ver y crear demandas

## URLs Base
- **Desarrollo**: \`http://localhost:3000/api\`
- **Documentación**: \`http://localhost:3000/api-docs\`
      `,
      contact: {
        name: 'API Support',
        email: 'support@gestorAbogados.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://api.gestorabogados.com' : 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Mensaje de error',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            username: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'operator'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Lawyer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            phone: {
              type: 'string',
            },
            specialization: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Lawsuit: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            case_number: {
              type: 'string',
            },
            plaintiff: {
              type: 'string',
            },
            defendant: {
              type: 'string',
            },
            case_type: {
              type: 'string',
              enum: ['civil', 'criminal', 'labor', 'commercial'],
            },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'resolved'],
            },
            lawyer_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Autenticación',
        description: '**PASO 1**: Inicia sesión para obtener acceso a la API. Todos los demás endpoints requieren autenticación JWT.',
      },
      {
        name: 'Abogados',
        description: '**Gestión completa de abogados**: crear, listar, filtrar y obtener estadísticas. Requiere token JWT.',
      },
      {
        name: 'Demandas',
        description: '**Gestión de casos legales**: crear demandas, asignar abogados y hacer seguimiento de casos.',
      },
      {
        name: 'Reportes',
        description: '**Analytics y estadísticas**: reportes por abogado, carga de trabajo y métricas del bufete.',
      },
      {
        name: 'Sistema',
        description: '**Monitoreo y salud**: endpoints para verificar el estado de la API y sus componentes.',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas a los archivos que contienen las anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};

