# Gestor de Abogados - API REST

API REST para la gestión de **abogados** y **demandas** en un bufete legal. Desarrollada con Node.js, Express.js, PostgreSQL y Sequelize.

## 🚀 Características

### 🏗️ **Arquitectura y Calidad de Código (Nivel Senior)**
- ✅ **Arquitectura Clean** - Separación por capas (Controller → Service → Repository)
- ✅ **Principios SOLID** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- ✅ **Patrones de Diseño** - Repository Pattern, Service Layer, Dependency Injection, Factory Pattern, Template Method
- ✅ **Error Handling Profesional** - Clases de error especializadas (ValidationError, BusinessRuleError)
- ✅ **Testing Funcional** - Endpoints probados y validados

### 🔧 **Funcionalidades Core**
- ✅ **Autenticación JWT** con roles (admin/operator)
- ✅ **CRUD completo** para abogados y demandas
- ✅ **Paginación** y filtros en consultas
- ✅ **Validación de datos** con Joi + reglas de negocio
- ✅ **Manejo centralizado de errores** con logging estructurado
- ✅ **Documentación Swagger** interactiva
- ✅ **Rate limiting** para seguridad
- ✅ **Logs estructurados** profesionales
- ✅ **Base de datos PostgreSQL** con Docker
- ✅ **Seeders** con datos de prueba

### 📊 **Características Avanzadas**
- ✅ **Health Checks** completos (base de datos, memoria, dependencias)
- ✅ **Analytics y reportes** avanzados
- ✅ **Sistema de recomendaciones** para asignación de abogados
- ✅ **Response Formatter** consistente
- ✅ **Dependency Injection Container** para desacoplamiento

## 🛠️ Tecnologías

- **Backend**: Node.js v18+, Express.js
- **Base de datos**: PostgreSQL 15 con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Joi + Business Rules
- **Documentación**: Swagger UI
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Containerización**: Docker Compose
- **Arquitectura**: Clean Architecture + SOLID Principles
- **Patrones**: Repository, Service Layer, Dependency Injection

## 🏗️ Arquitectura del Sistema

### **Clean Architecture Implementada**

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│              (Controllers)              │ ← HTTP Requests/Responses
├─────────────────────────────────────────┤
│            BUSINESS LAYER               │
│               (Services)                │ ← Business Logic & Rules
├─────────────────────────────────────────┤
│           DATA ACCESS LAYER             │
│            (Repositories)               │ ← Database Operations
├─────────────────────────────────────────┤
│            DATABASE LAYER               │
│         (PostgreSQL + Sequelize)       │ ← Data Persistence
└─────────────────────────────────────────┘

         CROSS-CUTTING CONCERNS:
    ├── Error Handling (Specialized Classes)
    ├── Logging (Structured & Professional)
    ├── Validation (Joi + Business Rules)
    ├── Response Formatting (Consistent API)
    ├── Health Monitoring (Infrastructure)
    └── Dependency Injection (IoC Container)
```

### **Principios SOLID Aplicados**

- **🔹 Single Responsibility**: Cada clase tiene una única responsabilidad
- **🔹 Open/Closed**: Código abierto para extensión, cerrado para modificación
- **🔹 Liskov Substitution**: Las implementaciones son intercambiables
- **🔹 Interface Segregation**: Interfaces específicas y cohesivas
- **🔹 Dependency Inversion**: Dependencia de abstracciones, no implementaciones

### **Patrones de Diseño Implementados**

- **🔸 Repository Pattern**: Abstrae el acceso a datos
- **🔸 Service Layer Pattern**: Encapsula lógica de negocio
- **🔸 Dependency Injection**: Gestión automática de dependencias
- **🔸 Factory Pattern**: Creación de objetos especializados
- **🔸 Template Method**: Hooks para validaciones personalizadas
- **🔸 Strategy Pattern**: Diferentes estrategias de respuesta

## 📋 Requisitos Previos

- Node.js v18 o superior
- Docker y Docker Compose
- Git

## 🏁 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd GestorAbogadosBack/DesarollobackExpress
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `config.env` y ajusta las variables según tu entorno:
```bash
cp config.env .env
```

### 4. Levantar la base de datos
```bash
docker-compose up -d
```

### 5. Ejecutar migraciones y seeders
```bash
# Crear la base de datos
npx sequelize-cli db:create

# Ejecutar migraciones
npm run db:migrate

# Cargar datos de prueba
npm run db:seed
```

### 6. Iniciar el servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación API

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

**🌐 http://localhost:3000/api-docs**

## 🔐 Usuarios de Prueba

El sistema viene con usuarios predefinidos para testing:

| Usuario | Contraseña | Rol | Descripción |
|---------|------------|-----|-------------|
| `admin` | `admin123` | admin | Acceso completo |
| `operator` | `operator123` | operator | Solo lectura |
| `maria.garcia` | `maria123` | operator | Solo lectura |

## 📌 Endpoints Principales

### 🔑 Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### 👨‍💼 Abogados
- `POST /api/lawyers` - Crear abogado (solo admin)
- `GET /api/lawyers` - Listar abogados (paginado)
- `GET /api/lawyers/:id` - Obtener abogado por ID
- `GET /api/lawyers/:id?includeStats=true` - Abogado con estadísticas completas
- `GET /api/lawyers?status=active` - Filtrar abogados activos
- `GET /api/lawyers?specialization=Laboral` - Filtrar por especialización
- `GET /api/lawyers/workload` - Análisis de carga de trabajo
- `PUT /api/lawyers/:id` - Actualizar abogado
- `DELETE /api/lawyers/:id` - Eliminar abogado (con validaciones de negocio)

### ⚖️ Demandas
- `POST /api/lawsuits` - Crear demanda
- `GET /api/lawsuits` - Listar demandas (con filtros)
- `GET /api/lawsuits?status=pending` - Filtrar por estado
- `GET /api/lawsuits?lawyer_id=UUID` - Filtrar por abogado
- `PUT /api/lawsuits/:id/assign` - Asignar abogado (solo admin)
- `GET /api/lawsuits/:id/recommend` - Recomendar mejor abogado
- `GET /api/lawsuits/analytics` - Analytics y estadísticas

### 📊 Reportes y Analytics
- `GET /api/reports/lawyers/:id/lawsuits` - Demandas por abogado con estadísticas
- `GET /api/info` - Información general de la API

### 🏥 Monitoreo y Salud
- `GET /api/health` - Health check completo (BD, memoria, dependencias)
- `GET /api/health/quick` - Health check rápido para load balancers

## 🧪 Ejemplos de Uso

### 1. Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Crear un abogado
```bash
curl -X POST http://localhost:3000/api/lawyers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Carlos Pérez",
    "email": "carlos.perez@example.com",
    "phone": "3001234567",
    "specialization": "Laboral",
    "status": "active"
  }'
```

### 3. Crear una demanda
```bash
curl -X POST http://localhost:3000/api/lawsuits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "case_number": "DEM-2025-001",
    "plaintiff": "Empresa XYZ",
    "defendant": "Juan Rodríguez",
    "case_type": "labor",
    "status": "pending"
  }'
```

### 4. Asignar abogado a demanda
```bash
curl -X PUT http://localhost:3000/api/lawsuits/LAWSUIT_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "lawyer_id": "LAWYER_UUID"
  }'
```

## 🗄️ Estructura de la Base de Datos

### Usuarios (users)
```sql
- id (UUID, PK)
- username (String, Unique)
- password (String, Hashed)
- role (Enum: admin, operator)
- created_at, updated_at (Timestamps)
```

### Abogados (lawyers)
```sql
- id (UUID, PK)
- name (String)
- email (String, Unique)
- phone (String)
- specialization (String)
- status (Enum: active, inactive)
- created_at, updated_at (Timestamps)
```

### Demandas (lawsuits)
```sql
- id (UUID, PK)
- case_number (String, Unique)
- plaintiff (String)
- defendant (String)
- case_type (Enum: civil, criminal, labor, commercial)
- status (Enum: pending, assigned, resolved)
- lawyer_id (UUID, FK, Nullable)
- created_at, updated_at (Timestamps)
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch
```

## 📦 Scripts NPM

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar tests
npm run db:migrate # Ejecutar migraciones
npm run db:seed    # Cargar datos de prueba
npm run db:reset   # Resetear BD completa
```

## 🔧 Comandos de Base de Datos

```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name create-table-name

# Crear nuevo seeder
npx sequelize-cli seed:generate --name demo-data

# Revertir última migración
npx sequelize-cli db:migrate:undo

# Revertir todos los seeders
npx sequelize-cli db:seed:undo:all
```

## 🚦 Estados de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud inválida |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso no encontrado |
| 429 | Demasiadas solicitudes |
| 500 | Error interno del servidor |

## 🔒 Seguridad

- **JWT** para autenticación con expiración configurable
- **Helmet** para headers de seguridad HTTP
- **Rate Limiting** para prevenir ataques de fuerza bruta
- **CORS** configurado para dominios específicos
- **Validación** estricta de todos los inputs
- **Passwords hasheados** con bcrypt (12 rounds)

## 🌍 Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestor_abogados_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Estructura del Proyecto (Clean Architecture)

```
src/
├── config/              # Configuraciones
│   ├── config.js
│   ├── database.js
│   └── swagger.js
├── controllers/         # Presentation Layer (HTTP Handlers)
│   ├── authController.js
│   ├── lawyerController.js
│   ├── lawsuitController.js
│   └── reportController.js
├── services/            # Business Layer (Business Logic)
│   ├── BaseService.js
│   ├── LawyerService.js
│   └── LawsuitService.js
├── repositories/        # Data Access Layer (Database Operations)
│   ├── BaseRepository.js
│   ├── LawyerRepository.js
│   ├── LawsuitRepository.js
│   └── UserRepository.js
├── interfaces/          # Contracts and Abstractions
│   ├── IRepository.js
│   └── IService.js
├── container/           # Dependency Injection
│   ├── DIContainer.js
│   └── serviceRegistry.js
├── middlewares/         # Cross-cutting Concerns
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── utils/               # Utilities and Helpers
│   ├── errors/          # Specialized Error Classes
│   │   ├── BaseError.js
│   │   ├── ValidationError.js
│   │   ├── BusinessRuleError.js
│   │   └── index.js
│   ├── responseFormatter.js
│   ├── healthCheck.js
│   ├── logger.js
│   ├── catchAsync.js
│   └── jwt.js
├── migrations/          # Database Migrations
├── models/              # Database Models (Sequelize)
│   ├── index.js
│   ├── User.js
│   ├── Lawyer.js
│   └── Lawsuit.js
├── routes/              # API Routes
│   ├── index.js
│   ├── authRoutes.js
│   ├── lawyerRoutes.js
│   ├── lawsuitRoutes.js
│   └── reportRoutes.js
├── seeders/             # Database Seeders
├── validations/         # Input Validation Schemas
│   ├── authValidation.js
│   ├── lawyerValidation.js
│   └── lawsuitValidation.js
└── app.js               # Application Entry Point
```

### **🏗️ Capas de la Arquitectura**

- **📡 Presentation Layer**: Controllers - Manejo de HTTP requests/responses
- **🧠 Business Layer**: Services - Lógica de negocio y reglas de dominio
- **💾 Data Access Layer**: Repositories - Operaciones de base de datos
- **🔗 Cross-cutting**: Middlewares, Utils - Funcionalidades transversales

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor:

1. Revisa la documentación de Swagger en `/api-docs`
2. Verifica que Docker esté corriendo
3. Asegúrate de que las migraciones se ejecutaron correctamente
4. Revisa los logs del servidor para errores específicos

---

## 🏆 **Calidad de Código - Nivel Senior**

Este proyecto implementa las mejores prácticas de desarrollo de software:

### **✅ Clean Code & Architecture**
- Código legible, mantenible y extensible
- Separación clara de responsabilidades
- Arquitectura por capas bien definida
- Principios SOLID aplicados consistentemente

### **✅ Patrones de Diseño Profesionales**
- Repository Pattern para abstracción de datos
- Service Layer para lógica de negocio
- Dependency Injection para desacoplamiento
- Factory Pattern para creación de objetos
- Template Method para extensibilidad

### **✅ Error Handling & Logging**
- Clases de error especializadas por dominio
- Logging estructurado para trazabilidad
- Manejo centralizado de errores
- Response formatting consistente

### **✅ Testing & Validation**
- Endpoints funcionales probados
- Validación multicapa (Joi + Business Rules)
- Health checks completos
- Datos de prueba realistas

### **✅ Security & Performance**
- JWT con roles y expiración
- Rate limiting configurado
- Headers de seguridad (Helmet)
- Validación estricta de inputs
- Passwords hasheados con bcrypt

---

**Proyecto desarrollado siguiendo estándares de la industria y mejores prácticas de desarrollo.**

**Desarrollado para la gestión eficiente de bufetes legales.**

