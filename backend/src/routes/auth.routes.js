const express = require('express');
const { body } = require('express-validator');
const { login, getMe, register } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').notEmpty().withMessage('Password tidak boleh kosong')
];

const registerValidation = [
  body('nama').trim().isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.post('/register', registerValidation, validate, register);

module.exports = router;