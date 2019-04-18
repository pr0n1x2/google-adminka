const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const session = require('express-session');
const authController = require('controllers/auth');

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
// Именно в этом месте после того как сессия прошла процесс настрийки
// происходит проверка, что находится в Cookies.
// А конкретнее объект Session ищет в объекте Cookie значение с Id сессии.
// Обекты Session и Cookie находятся в объекте Request (req в middleware функции)
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

// Проверяем был ли установлен у пользователя (браузера) Cookies с именем token
// Он должен быть установлен если пользоваль поставил на форме логина
// галочку Remember Me
app.use(authController.checkTokenInUserCookies);

// Настраиваем доступ к страницам сайта для авторизированных пользователей
// и не для авторизированных пользователей
app.use(authController.allowUserToPage);

// Проверяем если пользователь авторизирован, тогда мы берем его Id из сессии,
// вытягиваем его из базы данных и сохраняем в res.locals
// Источник: https://expressjs.com/en/api.html#res.locals
app.use(authController.getUserFromDatabaseBySessionUserId);

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
