// Подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');

// Получаем объект Schema, который позволит нам создать часть
// коллекции User, а именно Person
// Источник: https://mongoosejs.com/docs/guide.html
const Schema = mongoose.Schema;

// Создаем часть коллекции User, а именно Person
const personSchema = new Schema({
    // Имя
    name: {
        type: String,       // Тип данных строка
        required: true,     // Указывает, что это поле является обязательным
        minlength: 2,       // Указываем минимальное количество символов
        maxlength: 40,      // Указываем максимальное количество символов
        trim: true,         // Указываем, что при вставки в БД все пробелы с начала и конца строки нужно обрезать
    },
    // Фамилия
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
        trim: true,
    },
    // E-mail он же логин по которому мы будем логиниться на сайт
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
        trim: true,
        index: true,        // Указываем, что это поле должно быть проиндексировано, информация: http://www.askit.ru/custom/db_basics/m6/06_01_indexes_basics.htm
        unique: true,       // Указываем, что это поле должно быть уникальным, повторяющихся значений не должно быть
    },
    // Телефон
    phone: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 15,
    },
    // Идентификатор страны из коллекции Country
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false,    // Указываем, что это поле не обязательное
        index: true         // Указываем, что это поле должно быть проиндексировано, даже если оно не обязательное
    },
    // Дата рождения
    birthday: {
        type: Date,         // Указываем тип поля Дата
        required: false
    },
    // Информация о пользователе
    aboutMe: {
        type: String,
        required: false
    },
    // Адресс, который мы будет получать из Google Places
    address: {
        type: String,
        required: false
    },
    // Пароль
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, {
    _id: false              // Указываем, что для этой схемы создавать поле id не нужно
});

module.exports = personSchema;