const express = require('express');
const router = express.Router();
const Exercicio = require('../models/Exercicio');
const User = require('../models/User');
const Favorito = require('../models/Favorito');

router.get('/adicionar', async (req, res) => {
    if ((req.session.user == undefined) || (req.session.user.adm == 0)) {
        res.redirect('/exercicios/inferiores');
    }
    else {
        res.render('adicionar-exercicio');
    }
})

router.get('/mais', async (req, res) => {
    if ((req.session.user == undefined) || (req.session.user.email == null)) {
        res.redirect('/users/entrar');
    }
    else {
        res.render('mais');
    }
})

router.get('/:categoria', async (req, res) => {
    if ((req.session.user == undefined) || (req.session.user.email == null)) {
        res.redirect('/users/entrar');
    }

    else {
        try {
            const consulta = await Exercicio.findAll({
                where: { category: req.params.categoria}
            });

            const exercicios = await Promise.all(consulta.map(async exercicio => {
                if (exercicio.image != null) {
                    const buffer = Buffer.from(exercicio.image, 'binary');
                    exercicio.image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                }

                exercicio.favorito = await verificarFavorito(req.session.user.email, exercicio.id);

                return exercicio;
            }));

            res.render('itens', { exercicios: exercicios, adm: req.session.user.adm });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
});

router.get('/favoritar/:id', async(req, res) => {
    if ((req.session.user == undefined) || (req.session.user.email == null)) {
        res.redirect('/users/entrar');
    }

    else {
        try {
            const user = await User.findOne({
                where: {email: req.session.user.email}
            })

            const exercicio = await Exercicio.findOne({
                where: {id: parseInt(req.params.id)}
            })

            const consulta = await Favorito.findOne({
                where: {exercicioId: exercicio.id, userId: user.id}
            })

            if (consulta == null) {
                Favorito.create({userId: user.id, exercicioId: exercicio.id});
            }
            else {
                Favorito.destroy({
                    where: {id: consulta.id}
                });
            }


            res.redirect(`/exercicios/${exercicio.category}`);
        }

        catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
});

router.get('/info/:id', async(req, res) => {
    if ((req.session.user == undefined) || (req.session.user.email == null)) {
        res.redirect('/users/entrar');
    }
    else {
        try {
            const exercicio = await Exercicio.findOne({
                where: {id: parseInt(req.params.id)}
            });

            res.render('item',{ exercicio, adm: req.session.user.adm });
        }

        catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
})

verificarFavorito = async (email, exercicioId) => {
    const user = await User.findOne({
        where: {email: email}
    })

    const consulta = await Favorito.findOne({
        where: {exercicioId: exercicioId, userId: user.id}
    })

    return consulta != null;
}

module.exports = router;