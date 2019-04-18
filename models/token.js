// Подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');

// Получаем объект Schema, который позволит нам создать
// коллекцию Token
// Источник: https://mongoosejs.com/docs/guide.html
const Schema = mongoose.Schema;

// Создаем схему для коллекции Token
// Поле id не указываем, так как все коллекции MongoDB
// по умолчанию имеют поле id
const tokenSchema = new Schema({
    // Случайня строка в которой мы будет сохранять token пользователя
    // если он нажал галочку Remember Me на странице авторизации, обязательно
    // индекцируем, так как по этому полю будет делать поиск
    token: {
        type: String,
        required: true,
        index: true
    },
    // Случайная строка по которой мы будем определять что взломан аккаунт пользователя через Cookies
    secret: {
        type: String,
        required: true
    },
    // Идентификатор пользователя в коллекции User
    // Индексируем, так как по этому полю будем делать поиск
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    }
}, {
    // Временные метки
    timestamps: true,
});

// Создаем модель Token на основе схемы tokenSchema
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;