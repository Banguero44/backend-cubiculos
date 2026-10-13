const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cubiculos', require('./routes/cubiculos'));
app.use('/api/reservas', require('./routes/reservas'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Reserva de Cubículos - Biblioteca Unicauca' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  if (error.name === 'ValidationError') {
    const mensajes = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({ error: mensajes.join(', ') });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'ID con formato inválido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;