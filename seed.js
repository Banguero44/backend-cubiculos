// seed.js - Carga datos de prueba (cubículos y reservas de ejemplo, NO son personas reales).
// Uso:  npm run seed
// Si la base ya tiene datos no cambia nada. Para borrar y volver a cargar:  npm run seed -- --reset
require('dotenv').config();
const mongoose = require('mongoose');
const Cubiculo = require('./models/Cubiculo');
const Reserva = require('./models/Reserva');

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cubiculos_db';
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('Conectado a MongoDB:', mongoose.connection.name);

  const hayDatos = (await Cubiculo.countDocuments()) > 0;
  if (hayDatos && !process.argv.includes('--reset')) {
    console.log('La base ya tiene datos, no se cambia nada. Para borrar y volver a cargar: npm run seed -- --reset');
    return;
  }
  if (hayDatos) {
    await Reserva.deleteMany({});
    await Cubiculo.deleteMany({});
    console.log('Datos anteriores borrados.');
  }

  const [c1, c2, c3] = await Cubiculo.insertMany([
    { nombre: 'Cubículo 01', capacidad: 4, ubicacion: 'Piso 1 - Sala grupal' },
    { nombre: 'Cubículo 02', capacidad: 6, ubicacion: 'Piso 1 - Sala grupal' },
    { nombre: 'Cubículo 03', capacidad: 8, ubicacion: 'Piso 2 - Ala norte' }
  ]);

  const reserva = (cub, nombre, codigo, fecha, ini, fin, estado = 'ACTIVA') => ({
    cubiculo: cub._id, nombreEstudiante: nombre, codigoEstudiante: codigo,
    fecha, horaInicio: ini, horaFin: fin, estado
  });
  await Reserva.insertMany([
    reserva(c1, 'Mateo Rodríguez', '104622045', '2026-11-03', '08:00', '10:00', 'CANCELADA'),
    reserva(c1, 'Ana María López', '104623017', '2026-11-03', '10:00', '12:00'),
    reserva(c1, 'Diego Pérez', '104621092', '2026-11-03', '12:00', '14:00'),
    reserva(c2, 'Laura Gómez', '104624501', '2026-11-03', '09:00', '11:00'),
    reserva(c1, 'Camila Torres', '104625310', '2026-11-10', '09:00', '11:00'),
    reserva(c3, 'Sebastián Ruiz', '104626728', '2026-11-10', '14:00', '16:00')
  ]);
  console.log('Datos de prueba cargados: 3 cubículos y 6 reservas (fechas 2026-11-03 y 2026-11-10).');
}

main()
  .catch((e) => { console.error('Error en el seed:', e.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
