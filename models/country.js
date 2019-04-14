// Подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');

// Получаем объект Schema, который позволит нам создать
// коллекцию Country
// Источник: https://mongoosejs.com/docs/guide.html
const Schema = mongoose.Schema;

// Создаем схему для коллекции Country
// Поле id не указываем, так как все коллекции MongoDB
// по умолчанию имеют поле id
const countrySchema = new Schema({
    // У страны есть название
    // Название мы будем хранить в поле name
    name: {
        type: String,
        required: true,
    }
});

// Создаем модель Country на основе схемы countrySchema
const Country = mongoose.model('Country', countrySchema);

module.exports = Country;