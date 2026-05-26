const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/buku.controller');
const { protect, requirePustakawan } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const bukuValidation = [
  body('judul').trim().isLength({ min: 3, max: 255 }).withMessage('Judul harus 3-255 karakter'),
  body('penulis').trim().notEmpty().withMessage('Penulis tidak boleh kosong'),
  body('tahun').optional().isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Tahun tidak valid'),
  body('isbn').optional().matches(/^97[89]\d{10}$/).withMessage('Format ISBN tidak valid'),
  body('stok').optional().isInt({ min: 0 }).withMessage('Stok harus bilangan bulat positif')
];

router.get('/', ctrl.getAll);
router.get('/statistik', ctrl.getStatistik);
router.get('/:id', ctrl.getById);
router.post('/', protect, requirePustakawan, bukuValidation, validate, ctrl.create);
router.put('/:id', protect, requirePustakawan, bukuValidation, validate, ctrl.update);
router.delete('/:id', protect, requirePustakawan, ctrl.remove);

module.exports = router;