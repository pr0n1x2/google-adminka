// Подключаем модуль для работы с Google Places API
const googleMapsClient = require('controllers/google');

// Эта middleware функция будет вызываться, когда
// пользователь запросил страницу /places методом GET
const placesView = (req, res, next) => {
    res.render('places', { title: 'Google places' });
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь запросил страницу /getPlacesFromGoogle методом POST
// через ajax
const getAddressesFromGooglePlaces = async (req, res, next) => {
    // Получаем данные которые передали через ajax методом POST
    const { address } = req.body;

    try {
        // Обращаемся к Google Places API и в качестве параметра передаем адрес, который
        // пользователь ввел на сайте.
        // В константу responseFromGooglePlaces записываем json, который вернул Google API
        const responseFromGooglePlaces = await googleMapsClient.placesAutoComplete(address);
        // Объявляем пустой массив, в который будет сохраняться адреса, который вернул Google API
        const addresses = [];

        // Перебираем все адреса в цикле, которые вернул Google API
        // Адреса находятся в массиве predictions
        for (let address of responseFromGooglePlaces.json.predictions) {
            // Добавляем идентификатор адреса и сам адрес в массив
            addresses.push({id: address.id, place_id: address.place_id, address: address.description});
        }

        // Google API может вернуть пустой результат, эту ситуацию нужно предусмотреть
        // и выбросить исключение с соответствующей ошибкой
        if (!addresses.length) {
            throw new Error ('No matches were found');
        }

        // Возвращаем пользователю в браузер объект, который содержит два значения
        // status: true - что означает, что мы успешно получили список адресов от гугла
        // addresses - массив в котором хранятся адреса
        res.json({ status: true, addresses });
    } catch (error) {
        // Если произошла какае-то ошибка, тогда возвращаем объект с двумя значениями
        // status: false - что означает, что произошла какае-то ошибка
        // message - текст ошибки
        res.json({ status: false, message: error.message });
    }
};

// Эта асинхронная middleware функция будет вызываться, когда
// пользователь выбрал адрес и хочет сохранить его в базу данных
const setMyAddressFromGooglePlaces = async (req, res, next) => {
    // Получаем данные которые передали через ajax методом POST
    const { placeId } = req.body;

    try {
        // Обращаемся к Google Places API и в качестве параметра передаем Place Id
        // который есть у каждого адреса
        // В константу responseFromGooglePlaces записываем json, который вернул Google API
        const responseFromGooglePlaces = await googleMapsClient.placeDetails(placeId);
        // В константу formattedAddress записываем отформатированный адрес, который вернул Google API
        const formattedAddress = responseFromGooglePlaces.json.result.formatted_address;

        // Обновляем адрес пользователя, сам пользователь находится в res.locals.user
        res.locals.user.person.address = formattedAddress;
        await res.locals.user.save();

        // Возвращаем пользователю в браузер объект, который содержит два значения
        // status: true - что означает, что мы успешно получили отформатированный адрес от гугла
        // address - сам отформатированный адрес
        res.json({ status: true, address: formattedAddress });
    } catch (error) {
        // Если произошла какае-то ошибка, тогда возвращаем объект с двумя значениями
        // status: false - что означает, что произошла какае-то ошибка
        // message - текст ошибки
        res.json({ status: false, message: error.message });
    }
};

module.exports.placesView = placesView;
module.exports.getAddressesFromGooglePlaces = getAddressesFromGooglePlaces;
module.exports.setMyAddressFromGooglePlaces = setMyAddressFromGooglePlaces;