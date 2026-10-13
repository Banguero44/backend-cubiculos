function esFechaValida(fecha) {
  return typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

function esHoraValida(hora) {
  return typeof hora === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

function horaEnMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function validarHoras(horaInicio, horaFin) {
  if (!esHoraValida(horaInicio) || !esHoraValida(horaFin)) {
    return 'Formato de hora inválido. Usa HH:MM';
  }
  if (horaEnMinutos(horaInicio) >= horaEnMinutos(horaFin)) {
    return 'La hora de inicio debe ser menor que la hora de fin';
  }
  return null;
}

function haySolapamiento(inicio1, fin1, inicio2, fin2) {
  return horaEnMinutos(inicio1) < horaEnMinutos(fin2) &&
         horaEnMinutos(fin1) > horaEnMinutos(inicio2);
}

module.exports = { esFechaValida, esHoraValida, horaEnMinutos, validarHoras, haySolapamiento };