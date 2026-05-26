const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/peminjaman.controller');
const { protect, requirePustakawan } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  [body('buku_id').isInt({ min: 1 }).withMessage('buku_id harus berupa angka valid')],
  validate,
  ctrl.pinjamBuku
);

router.patch('/:id/kembalikan', protect, requirePustakawan, ctrl.kembalikanBuku);

module.exports = router;
