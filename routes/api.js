const express = require('express');
const router = express.Router();
const Exercicio = require('../models/Exercicio');
const multer = require('multer');
const upload = multer(); // Configuração básica do multer para lidar com o upload

// Rota para adicionar um novo exercício
router.post('/adicionar', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, link } = req.body;
        const image = req.file.buffer; // A imagem é armazenada no req.file.buffer

        // Crie um novo objeto Exercicio com os dados recebidos e a imagem
        const novoExercicio = new Exercicio({
            name,
            description,
            category,
            image,
            link
        });

        // Salve o exercício no banco de dados
        await novoExercicio.save();

        res.status(201).send('Exercício adicionado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao adicionar o exercício: ' + error);
    }
});

module.exports = router;
