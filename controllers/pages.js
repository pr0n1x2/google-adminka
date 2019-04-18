// Подключаем модель Country
const Country = require('models/country');

// Подключаем модель User
const User = require('models/user');

// Подключаем модуль ajv
const Ajv = require('ajv');

// Подключаем модуль json схемы profileJsonSchema
const ProfileJsonSchema = require('schemes/profile');

const dashboardView = async (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard' });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /profile методом GET
const profileView = async (req, res, next) => {
    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    // Присваиваем константе user объект User из res.locals.user
    const user = res.locals.user;

    let countryId = null;

    if (typeof(user.person.country) !== 'undefined') {
        countryId = user.person.country.id;
    }

    // Формируем объект profileObj, значение из которого будут ставляться в форму
    // Данные берем из константы user
    const profileObj = {
        name: user.person.name,
        surname: user.person.surname,
        email: user.person.email,
        countryId: countryId,
        phone: user.person.phone,
        birthday: user.getEditableBirthday(),
        aboutMe: user.person.aboutMe
    };

    // Рендерим шаблон profile в который передаем следующие параметры
    res.render('profile', {
        title: 'Register page', // Название страницы
        countries: countries,   // Массив стран для отображения их в выпадающем списке Country
        data: profileObj,       // Данные, которые должны появиться в форме
        error: false,           // Текст ошибки
        success: false          // Статус блока успешного выполнения операции
    });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /profile методом POST
const profileAction = async (req, res, next) => {
    // Получаем данные из формы, которые хранятся в объекте req свойстве body
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

    // Создаем (замыкаем) переменную countries, так как она может нам понадобиться
    // в блоке catch если в блоке try произойдет какое-то ошибка
    let countries;

    try {
        // Указываем, что мы хотим получить все значения из базы данных из коллекции
        // Country и чтобы они были отсортированы по полю name по возрастанию
        countries = await Country.find({}).sort({name: 1});

        // Присваиваем константе user объект User из res.locals.user
        const user = res.locals.user;

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
        // и его Id не совпадает с нащим Id пользователя, под которым мы находимся
        // на сайте, тогда выбрасываем исключение и показываем ошибку
        if (emailUser && user.id !== emailUser.id) {
            throw new Error('A user with this E-mail already exists');
        }

        // Создает объект Date из строки birthday
        const birthdayDate = birthday.length ? new Date(birthday) : null;

        // Вносим изменения в объект User текущего пользователя
        user.person.name = name;
        user.person.surname = surname;
        user.person.email = email;
        user.person.phone = phone;
        user.person.birthday = birthdayDate;
        user.person.aboutMe = about;

        // Проверяем если пользователь выбрал страну, тогда в объект user
        // добавляем идентификатор выбранной страны
        if (countryId.length) {
            user.person.country = countryId;
        }

        // Сохраняем изменения в базу данных текущего пользователя
        await user.save();

        // Рендерим шаблон profile в который передаем следующие параметры
        res.render('profile', {
            title: 'Edit My Profile',   // Название страницы
            countries: countries,       // Массив стран для отображения их в выпадающем списке Country
            data: profileObj,           // Данные, которые должны появиться в форме
            error: false,               // Текст ошибки
            success: true               // Устанавливаем success в true, тем самым говоря, что данные успешно изменены
        });
    } catch (error) {
        // Рендерим шаблон profile в который передаем следующие параметры
        res.render('profile', {
            title: 'Edit My Profile',   // Название страницы
            countries: countries,       // Массив стран для отображения их в выпадающем списке Country
            data: profileObj,           // Данные, которые должны появиться в форме
            error: error.message,       // Текст ошибки
            success: false              // Статус блока успешного выполнения операции
        });
    }
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /users методом GET
const userView = async (req, res, next) => {
    // Получаем данные из формы, которые пришли методом GET
    const { countryId } = req.query;

    // В константу whereCountry записываем условия, при которох будут выбраны
    // данные из коллекции Users.
    // Если в countryId ничего нет, тогда выбираем все документы из коллекции Users,
    // иначе выбирает только те документы, которые соответствуют условиям поиска
    const whereCountry = !countryId ? {} : {'person.country': countryId};

    // Выбираем из базы даннах всех пользователей, которые соответствуют условиям поиска,
    // объединяем пользователей с коллекцией Country и сортируем пользователей по полю createdAt
    // в убывающем порядке.
    const users = await User.find(whereCountry).populate('person.country').sort({'createdAt': -1});

    // Указываем, что мы хотим получить все значения из базы данных из коллекции
    // Country и чтобы они были отсортированы по полю name по возрастанию
    const countries = await Country.find({}).sort({name: 1});

    // Рендерим шаблон users в который передаем следующие параметры
    res.render('users', {
        title: 'All Users',     // Название страницы
        countries: countries,   // Массив стран для отображения их в выпадающем списке Country
        countryId: countryId,   // Предыдущий countryId, который выбрал пользователь на форме
        users: users,           // Массив пользователей
        counter: 1              // Счетчик пользователей, который будем увеличивать через шаблон
    });
};

module.exports.dashboardView = dashboardView;
module.exports.profileView = profileView;
module.exports.profileAction = profileAction;
module.exports.userView = userView;