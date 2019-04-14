// Подключаем модель Country
const Country = require('models/country');

// Подключаем модель User
const User = require('models/user');

// Подключаем модуль ajv
const Ajv = require('ajv');

// Подключаем модуль bcrypt для хеширования паролей
const bcrypt = require('bcrypt');

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

        // Проверяем, если пользователь нажал галочку Remember Me
        if (remember !== undefined) {
            // Генерируем случайную строку на основе текущей даты
            const randomStr = await await bcrypt.hash((new Date()).toString(), 10);

            // Получаем из конфига настройки для token
            const tokenCookieName = config.get('token:name');
            const tokenCookieAge = config.get('token:lifetime');
            const tokenCookieSecure = config.get('token:in_prod');

            // Сохраняем token в базу данных текущего пользователя
            user.token = randomStr;
            await user.save();

            // Создаем cookie
            res.cookie(tokenCookieName, randomStr, { maxAge: tokenCookieAge, sameSite: true, secure: tokenCookieSecure });
        }

        // Если же пароли совпадают, тогда создаем сессию и перенаправляем на страницу /home
        req.session.userId = user.id;

        return res.redirect('/home');
    } catch (error) {
        return res.render('login', { title: 'Register page', data: loginObj, error: error.message });
    }
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
        res.clearCookie(config.get('token:name'));
        res.redirect('/login');
    });
};

module.exports.registerView = registerView;
module.exports.registerAction = registerAction;
module.exports.loginView = loginView;
module.exports.loginAction = loginAction;
module.exports.onlyAdmin = onlyAdmin;
module.exports.logout = logout;