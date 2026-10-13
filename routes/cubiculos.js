const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cubiculosController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.desactivar);
router.get('/:id/disponibilidad', ctrl.disponibilidad);

module.exports = router;