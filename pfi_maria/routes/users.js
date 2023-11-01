const express = require('express');
const router = express.Router();
const User = require('../models/User');
const session = require('express-session');
const Favorito = require('../models/Favorito');
const Exercicio = require('../models/Exercicio');

// Mostra a página de cadastro
router.get('/cadastrar', (req, res) => {

  if ((req.session.user != undefined) && (req.session.user.email != null)) {
    res.redirect('/exercicios/inferiores');
  }
  else {
    res.render('cadastrar');
  }
})

// Mostra a página de login
router.get('/entrar', (req, res) => {
  if ((req.session.user != undefined) && (req.session.user.email != null)) {
    res.redirect('/exercicios/inferiores');
  }
  else {
    res.render('entrar');
  }
})

// Cria um novo usuário
router.post('/new', async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (password == confirmPassword) {
        await User.create({ name, email, password });
        req.session.user = {name: name, email: email, adm: 0};
        res.redirect('/exercicios/inferiores');
      }
      else {
        res.redirect('/users/cadastrar');
      }
    }

    catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({where: {email: email}});

    if (!user) {
      res.redirect('/entrar');
    }

    else if (password == user.password) {
      req.session.user = {name: user.name, email: user.email, adm: user.adm};
      res.redirect('/exercicios/inferiores');
    }

    else {
      res.redirect('/users/entrar');
    }
  }

  catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

router.get('/favoritos', async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    return res.redirect('/');
  }

  try {
    const usuario = await User.findOne({
      where: { email: req.session.user.email }
    });

    const consulta = await Favorito.findAll({
      where: { userId: usuario.id }
    });

    const exercicioIds = consulta.map((favorito) => favorito.exercicioId);

    const exercicios = await Exercicio.findAll({
      where: { id: exercicioIds }
    });

    // Converter as imagens dos exercícios, se existirem
    exercicios.forEach((exercicio) => {
      if (exercicio.image) {
        const buffer = Buffer.from(exercicio.image, 'binary');
        exercicio.image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
      exercicio.favorito = verificarFavorito(req.session.user.email, exercicio.id);
    });

    console.log("#############");
    console.log(exercicios);

    res.render('itens', { exercicios, adm: req.session.user.adm });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



router.get('/sair', async (req, res) => {
  req.session.user = {name: null, email: null, adm: null}
  res.redirect('/');
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