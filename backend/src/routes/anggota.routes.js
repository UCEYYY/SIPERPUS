const express = require('express');
const ctrl = require('../controllers/anggota.controller');
const { protect, requirePustakawan } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, requirePustakawan, ctrl.getAll);
router.get('/:id', protect, requirePustakawan, ctrl.getById);
router.get('/:id/riwayat', protect, requirePustakawan, ctrl.getRiwayat);

module.exports = router;
