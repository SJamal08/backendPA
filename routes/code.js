const express = require('express');
const router = express.Router();

const compilateur = require('../controllers/code');

router.use('/submit', compilateur.compile);

module.exports = router;