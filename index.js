require('dotenv').config();
const conectarDB = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

(async () => {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
})();