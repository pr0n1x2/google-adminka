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
    token: {
        type: String,
        required: true,
        index: true
    },
    secret: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
});

// Создаем модель Token на основе схемы tokenSchema
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;