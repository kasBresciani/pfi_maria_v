const express = require('express');
const router = express.Router();

// Mostrar página inicial
router.get('/', async (req, res) => {
    res.render('index');
});


module.exports = router;