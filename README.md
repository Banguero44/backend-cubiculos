# Backend - Reserva de cubículos de estudio
API REST del proyecto individual de desarrollo de aplicaciones móviles.
Contexto: Biblioteca Universidad del Cauca.
Los estudiantes reservan cubículos de estudio grupal y el sistema impide que dos reservas se crucen.

## Tecnología
Node.js + Express + MongoDB (Mongoose) + Thunder Client.

## Cómo ejecutarlo
1. `npm install`
2. (Opcional) Copiar `.env.example` a `.env` y ajustar `MONGO_URI` (por ejemplo, si usas MongoDB Atlas). Con MongoDB local funciona sin tocar nada.
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
## Datos de prueba (seed)
`npm run seed` carga 3 cubículos y 6 reservas de ejemplo (fechas 2026-11-03 y 2026-11-10).
Si la base ya tiene datos no cambia nada; para borrar y volver a cargar: `npm run seed -- --reset`.

## Despliegue en la nube (MongoDB Atlas + Render)
1. **Base de datos:** crear un cluster gratuito (M0) en MongoDB Atlas, un usuario de base de datos y permitir el
   acceso desde cualquier IP (`0.0.0.0/0`). Copiar la cadena `mongodb+srv://...` y agregar el nombre de la base
   antes del `?` (por ejemplo `/cubiculos_db`).
2. **Datos de prueba:** en tu PC crear un archivo `.env` con `MONGO_URI=<cadena de Atlas>` y ejecutar `npm run seed`.
3. **API:** en Render crear un *Web Service* desde este repositorio de GitHub. Build command: `npm install`.
   Start command: `npm start`. Instance type: Free. En *Environment* agregar `MONGO_URI` con la misma cadena de Atlas.
4. Probar `https://TU-SERVICIO.onrender.com/api/cubiculos`. Esa es la URL que usa la app Android (`RetrofitClient.BASE_URL`).

> El plan gratuito de Render "duerme" el servicio tras 15 minutos sin uso; la primera petición puede tardar hasta 1 minuto.
