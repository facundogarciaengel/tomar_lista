# Backend de Tomar Lista

Este documento resume la lógica del backend y los endpoints disponibles para consumir la API desde el frontend.

## Stack y configuración
- **Framework**: [Express](https://expressjs.com/) con middlewares para `JSON`, `urlencoded` y [CORS](https://expressjs.com/en/resources/middleware/cors.html).
- **ORM**: [Sequelize](https://sequelize.org/) conectado a MySQL mediante las variables de entorno `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` definidas en `.env`.
- **Autenticación**: JSON Web Tokens firmados con la variable `JWT_SECRET`.
- **Punto de entrada**: `src/server.js`, donde se registran middlewares, rutas y la conexión a la base de datos.

> _Recuerda exponer la cabecera `Authorization: Bearer <token>` en todas las peticiones protegidas._

## Modelos y relaciones
Los modelos se definen en `src/models` y se relacionan en `src/models/index.js`.

| Modelo       | Campos clave | Relaciones relevantes |
|--------------|--------------|-----------------------|
| `Usuario`    | `nombre`, `email`, `contraseña`, `rol` (`admin` \| `docente`) | `Usuario` (docente) tiene muchas `Clase` (`docente_id`). |
| `Alumno`     | `nombre`, `email`, `telefono` | Se relaciona con `Clase` mediante la tabla pivote `AlumnoClase`; tiene muchas `Asistencia`. |
| `Clase`      | `nombre`, `docente_id` | Pertenece a un `Usuario`; se relaciona con `Alumno` y `Asistencia`. |
| `AlumnoClase`| `alumno_id`, `clase_id` | Tabla intermedia para las inscripciones. |
| `Asistencia` | `alumno_id`, `clase_id`, `fecha`, `presente` | Pertenece a un `Alumno` y a una `Clase`. |

## Autenticación y autorización
- **Registro (`POST /api/auth/register`)**: crea usuarios `admin` o `docente`, valida duplicados, cifra contraseñas con `bcrypt` y devuelve un JWT.
- **Login (`POST /api/auth/login`)**: verifica credenciales y devuelve JWT.
- **Middleware `verificarToken`**: valida el JWT (acepta formato `Bearer`).
- **Middleware `esAdmin`**: restringe acceso a rutas administrativas.

## Endpoints principales
### Auth (`/api/auth`)
| Método | Ruta | Descripción | Cuerpo esperado | Respuesta|
|--------|------|-------------|-----------------|----------|
| POST | `/register` | Registro de usuarios (pensado para administradores). | `{ nombre, email, password, rol }` | `201` con `{ msg, token, user }`.
| POST | `/login` | Login de cualquier usuario registrado. | `{ email, password }` | `200` con `{ msg, token, user }`.
| GET | `/perfil` | Devuelve datos del token válido. | — | `200` con `{ msg, usuario }`.
| GET | `/admin` | Prueba de acceso exclusivo para `admin`. | — | `200` con `{ msg }`.

### Usuarios (`/api/usuarios`) — requiere rol `admin`
| Método | Ruta | Descripción | Detalles |
|--------|------|-------------|----------|
| GET | `/` | Lista todos los usuarios. | Devuelve `id`, `nombre`, `email`, `rol`.
| GET | `/:id` | Obtiene un usuario. | `404` si no existe.
| PUT | `/:id` | Actualiza `nombre`, `email`, `rol`. | Devuelve `{ msg, usuario }` actualizado.
| DELETE | `/:id` | Elimina un usuario. | Devuelve `{ msg }` al borrar.

### Alumnos (`/api/alumnos`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista todos los alumnos.
| GET | `/:id` | Obtiene un alumno específico.
| POST | `/` | Crea un alumno con `{ nombre, email, telefono }`.
| PUT | `/:id` | Actualiza los datos de un alumno.
| DELETE | `/:id` | Elimina un alumno.
| GET | `/:alumnoId/clases` | Devuelve las clases donde está inscripto.

### Clases (`/api/clases`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista las clases.
| GET | `/:id` | Obtiene una clase.
| POST | `/` | Crea una clase `{ nombre, docente_id }`.
| PUT | `/:id` | Actualiza una clase.
| DELETE | `/:id` | Elimina una clase.
| POST | `/:claseId/alumnos` | Inscribe un alumno (`{ alumno_id }`).
| GET | `/:claseId/alumnos` | Lista alumnos inscriptos.
| DELETE | `/:claseId/alumnos/:alumnoId` | Desinscribe al alumno.

### Asistencias (`/api/asistencias`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Registra asistencia `{ alumno_id, clase_id, fecha, presente }`. Impide duplicados por alumno/clase/fecha.
| GET | `/` | Lista todas las asistencias.
| GET | `/clase/:claseId` | Filtra por clase. Query opcional: `fecha`, `desde`, `hasta`, `presente` (`true/false`).
| GET | `/alumno/:alumnoId` | Filtra por alumno con las mismas query.

### Reportes (`/api/reportes`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/asistencia/alumno/:alumnoId` | Resumen de asistencias de un alumno (opcional `desde`, `hasta`).
| GET | `/asistencia/clase/:claseId` | Resumen de asistencias de una clase (opcional `desde`, `hasta`).
| GET | `/asistencia/fecha/clase/:claseId?fecha=YYYY-MM-DD` | Presentes y ausentes en una clase en una fecha.
| GET | `/ausencias/fecha?fecha=YYYY-MM-DD` | Alumnos ausentes en cualquier clase ese día.
| GET | `/ausencias/ranking` | Ranking de ausencias (opcional `desde`, `hasta`).
| GET | `/asistencia/mensual/clase/:claseId` | Estadísticas mensuales de asistencia por clase.

## Consideraciones para el frontend
- **Tokens**: persistir el JWT y enviarlo en cada petición protegida.
- **Control de roles**: ocultar funciones administrativas a usuarios `docente`.
- **Manejo de estados**: usar los mensajes y estructuras `{ msg, ... }` devueltos por el backend para notificaciones.
- **Filtros**: construir formularios que aprovechen los parámetros `fecha`, `desde`, `hasta` y `presente` para reportes/asistencias.

Con esta guía se puede construir la capa de presentación alineada con las reglas y datos del backend.
