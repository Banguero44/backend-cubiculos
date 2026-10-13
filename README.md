# Backend - Reserva de cubículos de estudio
API REST del proyecto individual de desarrollo de aplicaciones móviles.
Contexto: Biblioteca Universidad del Cauca.
Los estudiantes reservan cubículos de estudio grupal y el sistema impide que dos reservas se crucen.

## Tecnología
Node.js + Express + MongoDB (Mongoose) + Thunder Client.

## Cómo ejecutarlo
1. `npm install`
2. Configurar `.env` con `MONGO_URI=mongodb://127.0.0.1:27017/cubiculos_db`
3. `npm start` → servidor en http://localhost:3000

## Base de datos
- `cubiculos`: `{ nombre, capacidad, ubicacion, activo }`
- `reservas`: `{ cubiculo (ref), nombreEstudiante, codigoEstudiante, fecha, horaInicio, horaFin, estado }`
- Relación 1:N → un cubículo tiene muchas reservas.

## Endpoints (11)
| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/cubiculos | Listar cubículos |
| GET | /api/cubiculos/:id | Detalle de cubículo |
| POST | /api/cubiculos | Crear cubículo |
| PUT | /api/cubiculos/:id | Actualizar cubículo |
| DELETE | /api/cubiculos/:id | Desactivar cubículo |
| GET | /api/cubiculos/:id/disponibilidad?fecha=YYYY-MM-DD | Franjas ocupadas |
| GET | /api/reservas?cubiculoId=&fecha=&estado= | Filtrar reservas |
| GET | /api/reservas/:id | Detalle de reserva |
| POST | /api/reservas | Crear reserva (aplica regla) |
| PUT | /api/reservas/:id | Reprogramar reserva |
| DELETE | /api/reservas/:id | Cancelar reserva |

## Regla de negocio
No se permite crear ni reprogramar una reserva si su horario se cruza
con otra reserva ACTIVA del mismo cubículo en la misma fecha → 409.