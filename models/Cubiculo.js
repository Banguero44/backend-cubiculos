const mongoose = require('mongoose');

const CubiculoSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  capacidad: { type: Number, required: [true, 'La capacidad es obligatoria'], min: [1, 'La capacidad debe ser al menos 1'] },
  ubicacion: { type: String, required: [true, 'La ubicación es obligatoria'], trim: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true, collection: 'cubiculos' });

module.exports = mongoose.model('Cubiculo', CubiculoSchema);