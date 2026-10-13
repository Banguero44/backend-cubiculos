const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  cubiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cubiculo', required: true },
  nombreEstudiante: { type: String, required: [true, 'El nombre del estudiante es obligatorio'], trim: true },
  codigoEstudiante: { type: String, required: [true, 'El código del estudiante es obligatorio'], trim: true },
  fecha: { type: String, required: true, match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha: YYYY-MM-DD'] },
  horaInicio: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato: HH:MM (24h)'] },
  horaFin: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato: HH:MM (24h)'] },
  estado: { type: String, enum: ['ACTIVA', 'CANCELADA'], default: 'ACTIVA' }
}, { timestamps: true, collection: 'reservas' });

ReservaSchema.index({ cubiculo: 1, fecha: 1, estado: 1 });

module.exports = mongoose.model('Reserva', ReservaSchema);