const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'behealthy'
});

app.use(session({
  secret: '#@5678avd@31#', // Uma chave secreta para assinar as sessões (deve ser mantida em segredo)
  resave: false,
  saveUninitialized: false,
  store: sessionStore, // Use o mecanismo de armazenamento que você escolheu
}));

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const exerciciosRouter = require('./routes/exercicios');
const apiRouter = require('./routes/api')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/exercicios', exerciciosRouter);
app.use('/api', apiRouter)

// Inicializa o servidor e o banco de dados
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
});
