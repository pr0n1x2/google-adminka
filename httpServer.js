const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('models/user');
const config = require('config');
const session = require('express-session');
const urlParse = require('url-parse');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Настраиваем сессии
app.use(session({
  name: config.get('session:name'),         // Под этим именем будет храниться cookies с Id сессии
  resave: false,                            // Указываем, что не нужно каждый запрос пересохранять сессию
  saveUninitialized: false,
  secret: config.get('session:secret'),     // Этот ключ будет использоваться для хешированния Id сессии
  cookie: {
    maxAge: config.get('session:lifetime'), // Время жизни cookies
    sameSite: true,
    secure: config.get('session:in_prod'),  // Нужно менять на рабочем сервере с https
  }
}));

// Проверяем был ли установлен у пользователя (браузера) cookie token
app.use((req, res, next) => {
  // Получаем cookie из объекта cookies
  const { token } = req.cookies;

  // Если cookie token существует
  if (token) {
    // Ищем в базе данных пользователя с таким token
    User.findOne({token: token})
      .then((user) => {
        // Если в базе данных такой польователь существует,
        // тогда в сессию записываем его идентификатор и
        // переходим к следующему middleware
        req.session.userId = user.id;
        next();
      })
      .catch(() => next());
  } else {
    // Если нету такого cookie, тогда просто переходим к следующему middleware
    next();
  }
});

// Настраиваем доступ к страницам сайта для авторизированных пользователей
// и не для авторизированных пользователей
app.use((req, res, next) => {
  // В этом массиве мы хроним URL по которым пользователи могут ходить не авторизированными
  const notAuthPage = ['/login', '/register'];

  // Парсим url на котором мы сейчас находимся
  // Источник: https://www.npmjs.com/package/url-parse
  const url = urlParse(req.url, true);

  // Проверяем если пользователь не авторизирован
  if (!req.session.userId) {
    // Проверяем зашел ли пользователь на страницу, которая доступна только для авторизированных пользователей
    if (notAuthPage.indexOf(url.pathname) !== -1) {
      // Если нет, тогда идем к следующему middleware
      next();
    } else {
      // Если да, тогда перебрасываем на страницу логина
      return res.redirect('/login');
    }
  } else {
    // Если же пользователь уже авторизирован
    // Проверяем зашел ли пользователь на страницу, которая доступна только для НЕ авторизированных пользователей
    if (notAuthPage.indexOf(req.url) !== -1) {
      // Если да, тогда перебрасываем на страницу /home
      return res.redirect('/home');
    } else {
      // Если нет, тогда идем к следующему middleware
      next();
    }
  }
});

// Проверяем если пользователь авторизирован, тогда мы берем его Id из сессии,
// вытягиваем его из базы данных и сохраняем в res.locals
// Источник: https://expressjs.com/en/api.html#res.locals
app.use((req, res, next) => {
  // Берем значение userId из сессии
  const {userId} = req.session;

  // Если userId существует, тогда вытягиваем его из базы и сохраняем в res.locals
  if (userId) {
    User.findById(userId).populate('person.country').exec()
      .then((user) => {
        // Сохраняем в res.locals и идем к следующему middleware
        res.locals.user = user;
        next();
      });
  } else {
    // Если userId НЕ существует, тогда просто идем к следующему middleware
    next();
  }
});

// Routes prefix
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
