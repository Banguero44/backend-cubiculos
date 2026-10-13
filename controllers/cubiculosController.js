const Cubiculo = require('../models/Cubiculo');
const Reserva = require('../models/Reserva');
const { esFechaValida } = require('../validaciones');

exports.listar = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.capacidadMin) filtro.capacidad = { $gte: Number(req.query.capacidadMin) };
    if (req.query.soloActivos !== 'false') filtro.activo = true;
    const cubiculos = await Cubiculo.find(filtro).sort({ nombre: 1 });
    res.json(cubiculos);
  } catch (error) { next(error); }
};

exports.obtener = async (req, res, next) => {
  try {
    const cub = await Cubiculo.findById(req.params.id);
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });
    res.json(cub);
  } catch (error) { next(error); }
};

exports.crear = async (req, res, next) => {
  try {
    const { nombre, capacidad, ubicacion } = req.body;
    if (!nombre || !capacidad || !ubicacion) {
      return res.status(400).json({ error: 'nombre, capacidad y ubicacion son obligatorios' });
    }
    const nuevo = await Cubiculo.create({ nombre, capacidad, ubicacion });
    res.status(201).json(nuevo);
  } catch (error) { next(error); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const cub = await Cubiculo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });
    res.json(cub);
  } catch (error) { next(error); }
};

exports.desactivar = async (req, res, next) => {
  try {
    const cub = await Cubiculo.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });
    res.status(204).send();
  } catch (error) { next(error); }
};

exports.disponibilidad = async (req, res, next) => {
  try {
    const { fecha } = req.query;
    if (!esFechaValida(fecha)) {
      return res.status(400).json({ error: 'Debe enviar ?fecha=YYYY-MM-DD' });
    }
    const cub = await Cubiculo.findById(req.params.id);
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });
    const reservas = await Reserva.find({ cubiculo: cub._id, fecha, estado: 'ACTIVA' }).sort({ horaInicio: 1 });
    res.json({
      cubiculo: cub.nombre,
      fecha,
      franjasOcupadas: reservas.map(r => ({
        horaInicio: r.horaInicio,
        horaFin: r.horaFin,
        estudiante: r.nombreEstudiante
      }))
    });
  } catch (error) { next(error); }
};