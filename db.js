const mongoose = require('mongoose');

async function conectarDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cubiculos_db';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB conectado:', mongoose.connection.name);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    console.error('¿Está encendido MongoDB? Revisa MONGO_URI en el archivo .env');
    process.exit(1);
  }
}

module.exports = conectarDB;
