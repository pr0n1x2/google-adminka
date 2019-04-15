// Подключаем модель Country
const Country = require('models/country');

// Подключаем модель User
const User = require('models/user');

// Подключаем модуль ajv
const Ajv = require('ajv');

// Подключаем модуль json схемы profileJsonSchema
const ProfileJsonSchema = require('schemes/profile');

const dashboardView = async (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard', user: res.locals.user });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /profile методом GET
const profileView = async (req, res, next) => {
    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    let countryId = null;

    if (typeof(res.locals.user.person.country) !== 'undefined') {
        countryId = res.locals.user.person.country.id;
    }

    // Формируем объект dataObj, значение из которого будут ставляться в форму
    // Данные берем из res.locals.user
    const profileObj = {
        name: res.locals.user.person.name,
        surname: res.locals.user.person.surname,
        email: res.locals.user.person.email,
        countryId: countryId,
        phone: res.locals.user.person.phone,
        birthday: res.locals.user.getEditableBirthday(),
        aboutMe: res.locals.user.person.aboutMe
    };

    // Передаем в шаблон название страницы, текущего пользователя, массив стран, данные пользователя, текст ошибки
    res.render('profile', {
        title: 'Register page',
        user: res.locals.user,
        countries: countries,
        data: profileObj,
        error: false,
        success: false
    });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /profile методом POST
const profileAction = async (req, res, next) => {
    // Получаем данные их формы, которые храняться в объекте req свойстве body
    const { name, surname, email, countryId, phone, birthday, about } = req.body;

    // Формируем объект, который будем сравнивать с JSON Схемой
    const profileObj = {
        name: name,
        surname: surname,
        email: email,
        countryId: countryId,
        phone: phone,
        birthday: birthday,
        aboutMe: about
    };

    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    try {
        // Создаем объект Ajv, который будет проверять данных из формы с json схемами
        const ajv = new Ajv({verbose: true});

        // Проверяем объект profileObj на то, что он соответствует схеме ProfileJsonSchema
        // и результат true или false записываем в константу validProfile
        const validProfile = ajv.validate(ProfileJsonSchema, profileObj);

        // Если данные не соответствуют json схеме, тогда формируем ошибку и выбрасываем исключение
        if (!validProfile) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        // Ищем в БД пользователя с E-mail который ввел пользователь
        const emailUser = await User.findOne({'person.email': email});

        // Проверяем, если в базе есть другой пользователь с таким E-mail,
        // тогда выбрасываем исключение и показываем ошибку
        if (res.locals.user.id !== emailUser.id) {
            throw new Error('A user with this E-mail already exists');
        }

        // Создает объект Date из строки birthday
        const birthdayDate = birthday.length ? new Date(birthday) : null;

        // Вносим изменения в объект User текущего пользователя
        res.locals.user.person.name = name;
        res.locals.user.person.surname = surname;
        res.locals.user.person.email = email;
        res.locals.user.person.phone = phone;
        res.locals.user.person.birthday = birthdayDate;
        res.locals.user.person.aboutMe = about;

        // Проверяем если пользователь выбрал страну, тогда в объект res.locals.user
        // добавляем идентификатор выбранной страны
        if (countryId.length) {
            res.locals.user.person.country = countryId;
        }

        // Сохраняем изменения в базу данных текущего пользователя
        // После сохранения в res.locals.user будет записан объект User, который храниться в базе данных
        res.locals.user = await res.locals.user.save();

        res.render('profile', {
            title: 'Edit My Profile',
            user: res.locals.user,
            countries: countries,
            data: profileObj,
            error: false,
            success: true
        });
    } catch (error) {
        res.render('profile', {
            title: 'Edit My Profile',
            user: res.locals.user,
            countries: countries,
            data: profileObj,
            error: error.message,
            success: false
        });
    }
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /users методом GET
const userView = async (req, res, next) => {
    // Получаем данные из формы, которые пришли методом GET
    const { countryId } = req.query;

    const whereCountry = !countryId ? {} : {'person.country': countryId};

    // Выбираем из базы даннах всех пользователей, объединяем пользователей с коллекцией
    // Country и сортируем пользователей по полю createdAt
    const users = await User.find(whereCountry).populate('person.country').sort({'createdAt': -1});

    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    res.render('users', {
        title: 'All Users',
        user: res.locals.user,
        countries: countries,
        countryId: countryId,
        users: users,
        counter: 1
    });
};

module.exports.dashboardView = dashboardView;
module.exports.profileView = profileView;
module.exports.profileAction = profileAction;
module.exports.userView = userView;