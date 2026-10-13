const Reserva = require('../models/Reserva');
const Cubiculo = require('../models/Cubiculo');
const { esFechaValida, validarHoras, haySolapamiento } = require('../validaciones');

exports.listar = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.cubiculoId) filtro.cubiculo = req.query.cubiculoId;
    if (req.query.fecha) filtro.fecha = req.query.fecha;
    if (req.query.estado) filtro.estado = req.query.estado.toUpperCase();
    const reservas = await Reserva.find(filtro)
      .populate('cubiculo', 'nombre ubicacion capacidad')
      .sort({ fecha: 1, horaInicio: 1 });
    res.json(reservas);
  } catch (error) { next(error); }
};

exports.obtener = async (req, res, next) => {
  try {
    const r = await Reserva.findById(req.params.id).populate('cubiculo', 'nombre ubicacion');
    if (!r) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(r);
  } catch (error) { next(error); }
};

exports.crear = async (req, res, next) => {
  try {
    const { cubiculoId, nombreEstudiante, codigoEstudiante, fecha, horaInicio, horaFin } = req.body;
    if (!cubiculoId || !nombreEstudiante || !codigoEstudiante || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (!esFechaValida(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha: YYYY-MM-DD' });
    }
    const errorHoras = validarHoras(horaInicio, horaFin);
    if (errorHoras) return res.status(400).json({ error: errorHoras });

    const cub = await Cubiculo.findById(cubiculoId);
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });
    if (!cub.activo) return res.status(409).json({ error: 'El cubículo está desactivado' });

    const reservasDia = await Reserva.find({ cubiculo: cubiculoId, fecha, estado: 'ACTIVA' });
    const cruce = reservasDia.find(r => haySolapamiento(horaInicio, horaFin, r.horaInicio, r.horaFin));
    if (cruce) {
      return res.status(409).json({ error: `Ya existe una reserva activa en ese horario (${cruce.horaInicio} - ${cruce.horaFin})` });
    }

    const nueva = await Reserva.create({ cubiculo: cubiculoId, nombreEstudiante, codigoEstudiante, fecha, horaInicio, horaFin });
    await nueva.populate('cubiculo', 'nombre ubicacion');
    res.status(201).json(nueva);
  } catch (error) { next(error); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const { cubiculoId, nombreEstudiante, codigoEstudiante, fecha, horaInicio, horaFin } = req.body;
    if (!cubiculoId || !nombreEstudiante || !codigoEstudiante || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const errorHoras = validarHoras(horaInicio, horaFin);
    if (errorHoras) return res.status(400).json({ error: errorHoras });

    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    const cub = await Cubiculo.findById(cubiculoId);
    if (!cub) return res.status(404).json({ error: 'Cubículo no encontrado' });

    const reservasDia = await Reserva.find({
      cubiculo: cubiculoId, fecha, estado: 'ACTIVA', _id: { $ne: reserva._id }
    });
    const cruce = reservasDia.find(r => haySolapamiento(horaInicio, horaFin, r.horaInicio, r.horaFin));
    if (cruce) {
      return res.status(409).json({ error: `El nuevo horario se cruza con otra reserva (${cruce.horaInicio} - ${cruce.horaFin})` });
    }

    reserva.cubiculo = cubiculoId;
    reserva.nombreEstudiante = nombreEstudiante;
    reserva.codigoEstudiante = codigoEstudiante;
    reserva.fecha = fecha;
    reserva.horaInicio = horaInicio;
    reserva.horaFin = horaFin;
    await reserva.save();
    await reserva.populate('cubiculo', 'nombre ubicacion');
    res.json(reserva);
  } catch (error) { next(error); }
};

exports.cancelar = async (req, res, next) => {
  try {
    const r = await Reserva.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Reserva no encontrada' });
    if (r.estado === 'CANCELADA') {
      return res.status(409).json({ error: 'La reserva ya estaba cancelada' });
    }
    r.estado = 'CANCELADA';
    await r.save();
    res.status(204).send();
  } catch (error) { next(error); }
};