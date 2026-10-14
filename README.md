# Backend - Reserva de cubículos de estudio
API REST
Contexto: Biblioteca Universidad del Cauca.
Los estudiantes reservan cubículos de estudio grupal y el sistema impide que dos reservas se crucen.

## Tecnología
Node.js + Express + MongoDB (Mongoose) + Thunder Client.

## Cómo ejecutarlo
1. `npm install`
2. Copiar `.env.example` a `.env` (ajusta `MONGO_URI` si es necesario)
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

## Pruebas
Importar `coleccion_pruebas.json` en Postman o Insomnia.
Cubre 11 endpoints con 17 casos, incluyendo la regla de negocio (409).

## Códigos HTTP
200 OK · 201 Created · 204 No Content · 400 Bad Request ·
404 Not Found · 409 Conflict · 500 Internal Server Error