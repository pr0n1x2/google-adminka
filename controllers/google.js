// Подключаем можель config
const config = require('config');

// Подключаем модуль @google/maps для работы с Google Maps API
// Источник: https://www.npmjs.com/package/@google/maps
const MapsClient = require('@google/maps');

const SESSION_TOKEN = 'randomstr';

// В этой переменной будет храниться сам объект @google/maps,
// который и будет подключаться к Google API и получать от него данные
let googleMapsClient = null;

// Функция которая инициализирует объект
// Эту функцию вызывает runner, файл bin/runners/google.js
const init = () => {
    if (!googleMapsClient) {
        googleMapsClient = MapsClient.createClient({
            key: config.get('maps:api'),
            Promise: Promise
        });
    }

    return googleMapsClient;
};

// Эту асинхронную функцию нужно вызывать, чтобы Google API вернул
// массив адресов по которым он нашел совпадения.
// В качестве параметра нужно передавать адрес, который пользователь
// ввел на сайте.
// Функция либо возвращает ответ от Google API либо выбрасывает
// исключение если произошла какае-то ошибка.
const placesAutoComplete = async (input) => {
    try {
        const response = await googleMapsClient.placesAutoComplete({
            input: input,
            sessiontoken: SESSION_TOKEN, // Не знаю, что сюда передавать!!!
            language: 'uk',
        }).asPromise();

        return response;
    } catch (error) {
        throw new Error(getErrorByStatusCode(error.json.status));
    }
};

// Эту асинхронную функцию нужно вызывать, чтобы Google API вернул
// подробный отчет о адресе, который мы у него запросим.
// В качестве параметра нужно передавать идентификатор адреса, а именно place_id
// Функция либо возвращает ответ от Google API либо выбрасывает
// исключение если произошла какае-то ошибка.
const placeDetails = async (placeId) => {
    try {
        const response = await googleMapsClient.place({
            placeid: placeId,
            language: 'uk',
        }).asPromise();

        return response;
    } catch (error) {
        throw new Error(getErrorByStatusCode(error.json.status));
    }
};

// Эту асинхронную функцию нужно вызывать, чтобы Google API вернул
// подробный отчет о фотографии, которую мы у него запросим.
// В качестве параметра нужно передавать идентификатор фотографии, а именно photoreference
// Функция либо возвращает ответ от Google API либо выбрасывает
// исключение если произошла какае-то ошибка.
const placesPhoto = async (photoreference) => {
    try {
        const response = await googleMapsClient.placesPhoto({
            photoreference: photoreference,
            maxwidth: 500,
        }).asPromise();

        return response;
    } catch (error) {
        throw new Error(getErrorByStatusCode(error.json.status));
    }
};

// Функция, которая анализирует ответ от Google API на наличие ошибки
// и пытается оперелить, какую именно ошибку вернул Google API.
// Возвращает текст ошибки
const getErrorByStatusCode = (code) => {
    let message;

    switch (code) {
        case 'ZERO_RESULTS':
            message = 'No matches were found';
            break;
        case 'OVER_QUERY_LIMIT':
            message = 'You have exceeded your quota';
            break;
        case 'REQUEST_DENIED':
            message = 'Your request has been denied';
            break;
        case 'INVALID_REQUEST':
            message = 'The request to the server is incorrect';
            break;
        default:
            message = 'Unknown error';
            break;
    }

    return message;
};

module.exports.init = init;
module.exports.placesAutoComplete = placesAutoComplete;
module.exports.placeDetails = placeDetails;
module.exports.placesPhoto = placesPhoto;