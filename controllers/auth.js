// Подключаем модель Country
const Country = require('models/country');

// Подключаем модель User
const User = require('models/user');

// Подключаем модель Token
const Token = require('models/token');

// Подключаем модуль ajv
const Ajv = require('ajv');

// Подключаем модуль bcrypt для хеширования паролей
const bcrypt = require('bcrypt');

// Подключаем модуль url-parse
const urlParse = require('url-parse');

// Подключаем модуль config
const config = require('config');

// Подключаем модуль json схемы profileJsonSchema
const ProfileJsonSchema = require('schemes/profile');

// Подключаем модуль json схемы passwordJsonSchema
const PasswordJsonSchema = require('schemes/password');

// Подключаем модуль json схемы loginJsonSchema
const LoginJsonSchema = require('schemes/login');

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /register методом GET
const registerView = async (req, res, next) => {
    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    // Передаем в шаблон название страницы, массив стран, данные из формы, текст ошибки
    res.render('register', { title: 'Register page', countries: countries, data: {}, error: false });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /register методом POST
const registerAction = async (req, res, next) => {
    // Получаем данные их формы, которые храняться в объекте req свойстве body
    const { name, surname, email, countryId, phone, birthday, password, passwordRetype } = req.body;

    // Формируем объекты, которые будем сравнивать с JSON Схемами
    const personObj = {
        name: name,
        surname: surname,
        email: email,
        countryId: countryId,
        phone: phone,
        birthday: birthday
    };

    const passwordObj = {
        password: password,
        passwordRetype: passwordRetype
    };

    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    try {
        // Создаем объект Ajv, который будет проверять данных из формы с json схемами
        let ajv = new Ajv({verbose: true});

        // Проверяем объект personObj на то, что он соответствует схеме ProfileJsonSchema
        // и результат true или false записываем в константу validProfile
        const validProfile = ajv.validate(ProfileJsonSchema, personObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validProfile) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Создаем новый объект Ajv, который будет валидировать пароль
        ajv = new Ajv({verbose: true, $data: true});

        // Проверяем объект passwordObj на то, что он соответствует схеме PasswordJsonSchema
        // и результат true или false записываем в константу validPassword
        const validPassword = ajv.validate(PasswordJsonSchema, passwordObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validPassword) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Ищем в БД пользователя с E-mail который ввел пользователь
        const emailUser = await User.findOne({'person.email': email});

        // Проверяем, если в базе есть другой пользователь с таким E-mail,
        // тогда выбрасываем исключение и показываем ошибку, так как нам
        // нельзя вставлять в базу пользователей с одинакомыми E-mail
        if (emailUser) {
            throw new Error('A user with this E-mail already exists');
        }

        // Хешируем пароль, чтобы он не хранился в базе в оригинальном виде
        const passwordHash = await bcrypt.hash(password, 10);

        // Создает объект Date из строки birthday
        const birthdayDate = birthday.length ? new Date(birthday) : null;

        // Создаем нового пользователя
        const newUser = new User({
            person: {
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                birthday: birthdayDate,
                password: passwordHash
            },
            role: 'user'
        });

        // Проверяем если пользователь выбрал страну, тогда в объект newUser
        // добавляем идентификатор выбранной страны
        if (countryId.length) {
            newUser.person.country = countryId;
        }

        // Сохраняем в базу нового пользователя
        // После сохранения в константу user будет записан объект User, который храниться в базе данных
        const user = await newUser.save();

        res.render('success', { title: 'Registration Сompleted', user: user });
    } catch (error) {
        res.render('register', { title: 'Register page', countries: countries, data: personObj, error: error.message });
    }
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /login методом GET
const loginView = async (req, res, next) => {
    // Передаем в шаблон название страницы, данные из формы и текст ошибки
    res.render('login', { title: 'Register page', data: {}, error: false });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /login методом POST
const loginAction = async (req, res, next) => {
    // Получаем данные их формы, которые храняться в объекте req свойстве body
    const { email, password, remember } = req.body;

    // Формируем объекты, которые будем сравнивать с JSON Схемами
    const loginObj = {
        email: email,
        password: password
    };

    try {
        // Создаем объект Ajv, который будет проверять данных из формы с json схемами
        const ajv = new Ajv({verbose: true});

        // Проверяем объект loginObj на то, что он соответствует схеме LoginJsonSchema
        // и результат true или false записываем в константу validLogin
        const validLogin = ajv.validate(LoginJsonSchema, loginObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validLogin) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Ищем пользователя в базе данных по полю E-mail
        // Источник: https://mongoosejs.com/docs/api.html#model_Model.find
        const user = await User.findOne({'person.email': email});

        // Если пользователя не нашли, выбрасываем исключение с текстом ошибки
        if (!user) {
            throw new Error('User with such E-mail was not found');
        }

        // Сравниваем пароли, тот который ввел пользователь и тот который храниться в базе данных
        // Модуль bcrypt возвращает true или false
        const comparePassword = await bcrypt.compare(password, user.person.password);

        // Если пароли не совпадают, выбрасываем исключение с текстом ошибки
        if (!comparePassword) {
            throw new Error('Wrong password');
        }

        // Если же пароли совпадают, тогда создаем сессию и перенаправляем на страницу /home
        req.session.userId = user.id;

        user.lastSessionId = req.sessionID;
        await user.save();

        // Проверяем, если пользователь нажал галочку Remember Me
        if (remember !== undefined) {
            await generateNewToken(res, user.id);
        }

        res.redirect('/home');
    } catch (error) {
        res.render('login', { title: 'Register page', data: loginObj, error: error.message });
    }
};

const generateNewToken = async (res, userId, oldToken = false) => {
    const secret = await bcrypt.hash((new Date()).toString(), 10);
    let token;

    if (oldToken) {
        token = oldToken.token;
        oldToken.remove();
    } else {
        token = await bcrypt.hash((new Date()).toString(), 10);
    }

    // Получаем из конфига настройки для token
    const tokenCookieName = config.get('token:tokenName');
    const secretCookieName = config.get('token:secretName');
    const tokenCookieAge = config.get('token:lifetime');
    const tokenCookieSecure = config.get('token:in_prod');

    const newToken = new Token({
        token: token,
        secret: secret,
        userId: userId
    });

    await newToken.save();

    // Создаем cookie c именем из константы tokenCookieName
    // Источник: https://expressjs.com/en/api.html#res.cookie
    res.cookie(tokenCookieName, token, { maxAge: tokenCookieAge, sameSite: true, httpOnly: true, secure: tokenCookieSecure });
    res.cookie(secretCookieName, secret, { maxAge: tokenCookieAge, sameSite: true, httpOnly: true, secure: tokenCookieSecure });
};

// Эта асинхронная middleware функция будет вызываться всякий
// раз, когда нам нужно проверить если ли у пользователя в Cookies
// значение token, которое появляется у него, когда он нажал на
// галочку Remember Me на форме авторизации
const checkTokenInUserCookies = async (req, res, next) => {
    // Проверяем, что если уже существует сессия с Id пользователя,
    // тогда дальнейшую проверку для token нам не нужно делать и мы
    // переходим к следующей middleware функции
    if (req.session.userId) {
        return next();
    }

    // Получаем значение token из объекта Cookies
    const token = req.cookies[config.get('token:tokenName')];
    // Получаем значение secret из объекта Cookies
    const secret = req.cookies[config.get('token:secretName')];

    // Если значение token существует
    /*if (token) {
        // Ищем в базе данных пользователя с таким token, который мы получили из Cookies
        // и говорим, чтобы база объединила документ User и документ Country
        // в один объект User.
        // Другими словами, присоединила к документу User домумент Country
        // Источник: https://mongoosejs.com/docs/populate.html
        const user = await User.findOne({token: token}).populate('person.country');

        if (user) {
            // Если в базе данных такой польователь существует,
            // тогда в сессию записываем его идентификатор, а в
            // res.locals записывает текущий объект User
            // переходим к следующему middleware
            req.session.userId = user.id;
            res.locals.user = user;
        }
    }*/

    if (token && secret) {
        const tokenFromBase = await Token.findOne({token: token});

        if (tokenFromBase) {
            if (secret === tokenFromBase.secret) {
                await generateNewToken(res, tokenFromBase.userId, tokenFromBase);
                req.session.userId = tokenFromBase.userId;
            } else {
                const user = await User.findById(tokenFromBase.userId);
            }
        }
    }

    next();
};

// Эта middleware функция будет вызываться всякий
// раз, когда нам нужно проверить на какою страницу перешел
// пользователь и проверить авторизирован ли он для страниц,
// которые могут просматривать только авторизированные пользователи
const allowUserToPage = (req, res, next) => {
    // В этом массиве мы храним URL по которым пользователи могут ходить НЕ авторизированными
    const notAuthPage = ['/login', '/register'];

    // Парсим url на котором мы сейчас находимся
    // Нам нужно получить значение pathname, чтобы сравнить его со значением
    // из массива notAuthPage
    // Источник: https://www.npmjs.com/package/url-parse
    const url = urlParse(req.url, true);

    // Проверяем если пользователь НЕ авторизирован
    if (!req.session.userId) {
        // Проверяем зашел ли пользователь на страницу, которая доступна только для авторизированных пользователей
        // Источник: https://learn.javascript.ru/array-methods#indexof-lastindexof
        if (notAuthPage.indexOf(url.pathname) === -1) {
            return res.redirect('/login');
        }
    } else {
        // Если же пользователь уже авторизирован
        // Проверяем зашел ли пользователь на страницу, которая доступна только для НЕ авторизированных пользователей
        if (notAuthPage.indexOf(req.url) !== -1) {
            return res.redirect('/home');
        }
    }

    next();
};

// Эта асинхронная middleware функция будет вызываться всякий
// раз, когда нам нужно получить документ User текущего пользователя
// из БД и сохранить его в res.locals
const getUserFromDatabaseBySessionUserId =  async (req, res, next) => {
    // Првоеряем, что в res.locals у нас есть уже пользователь
    // Если он существует, тогда переходим к следующей middleware функции
    // Ранее это значение мы могли установить в checkTokenInUserCookies
    if (res.locals.user) {
        return next();
    }

    // Берем значение userId из сессии
    const {userId} = req.session;

    // Если userId существует, тогда вытягиваем его из базы и сохраняем в res.locals
    if (userId) {
        // Ищем в базе данных пользователя с таким userId, который мы получили из Sessions
        // и говорим, чтобы база объединила документ User и документ Country
        // в один объект User.
        // Другими словами, присоединила к документу User домумент Country
        // Источник: https://mongoosejs.com/docs/populate.html
        const user = await User.findById(userId).populate('person.country');

        if (user) {
            // Если в базе данных такой польователь существует,
            // тогда в res.locals записывает текущий документ User и
            // переходим к следующему middleware
            res.locals.user = user;
        } else {
            // Если по какой-то причине в БД не был найден пользователь с таким userId,
            // тогда редиректим пользователя на страницу /logout, чтобы удалить сессию
            // и очистить все Cookies
            return res.redirect('/logout');
        }
    }

    next();
};

// Эта middleware функция будет вызываться всякий
// раз, когда нам нужно проверить права доступа к страничке
const onlyAdmin = (req, res, next) => {
    // Проверяем, если у пользователя значение в поле role не равно 'admin',
    // тогда этот пользователь не должен видеть эту страничку.
    // Редиректим его на главную
    if (res.locals.user.role !== 'admin') {
        return res.redirect('/home');
    }

    // В другом случае, просто вызываем следующий middleware
    next();
};

// Эта middleware функция будет вызываться, когда
// пользователь запросил страницу /logout методом GET
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }

        res.clearCookie(config.get('session:name'));
        res.clearCookie(config.get('token:tokenName'));
        res.clearCookie(config.get('token:secretName'));
        res.redirect('/login');
    });
};

module.exports.registerView = registerView;
module.exports.registerAction = registerAction;
module.exports.loginView = loginView;
module.exports.loginAction = loginAction;
module.exports.checkTokenInUserCookies = checkTokenInUserCookies;
module.exports.allowUserToPage = allowUserToPage;
module.exports.getUserFromDatabaseBySessionUserId = getUserFromDatabaseBySessionUserId;
module.exports.onlyAdmin = onlyAdmin;
module.exports.logout = logout;