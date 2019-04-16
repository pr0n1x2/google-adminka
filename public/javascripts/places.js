let placesSuccess, placesErrors, ajaxLoader, placesResults;

// Функция, которая показыват блок с ошибкой на странице, в качестве
// параметра передаем текст ошибки
const showError = (message) => {
    const messagesSpan = placesErrors.querySelector('span.message');

    messagesSpan.innerText = message;
    placesErrors.classList.add('places-errors-visible');
};

// Функция, которая прячет блок с ошибкой на странице
const hideError = () => {
    placesErrors.classList.remove('places-errors-visible');
};

// Функция, которая показывает индекатор загрузки ajax запроса (gif картинку)
const showAjaxLoader = () => {
    ajaxLoader.classList.add('ajax-loader-visible');
};

// Функция, которая прячет индекатор загрузки ajax запроса (gif картинку)
const hideAjaxLoader = () => {
    ajaxLoader.classList.remove('ajax-loader-visible');
};

// Функция, которая показыват блок с успешной операцией на странице,
// в качестве параметра передаем отформатированный адрес, который
// получаем от сервера
const showSuccess = (address) => {
    const messagesSpan = placesSuccess.querySelector('span.message');

    messagesSpan.innerText = address;
    placesSuccess.classList.add('places-success-visible');
};

// Функция, которая прячет блок с успешной операцией на странице
const hideSuccess = () => {
    placesErrors.classList.remove('places-success-visible');
};

// Функция, которая удаляет все детей у родительского элемента
// В качестве параметра передает элемент, детей у которого нужно удалить
const clearNode = (node) => {
    while (node.firstChild) {
        node.firstChild.remove();
    }
};

// Функция, которая добавляет адреса от гугла на страницу
// Конкретно в нашем случае, мы добавляем элементы LI в UL список
// В качестве параметра передаем массив адресов, который был
// получен от сервера
const showAddressesFromServer = (addresses) => {
    // В цикле перебираем все адреса, которые были получены от сервера
    for (let address of addresses) {
        // Создаем элемент LI
        let elementLi = document.createElement('li');
        // Создаем текст, который будет находится в элементе LI,
        // в качестве текста будет адрес, который нам вернул Google API
        let elementLiText = document.createTextNode(address.address);

        // Добавляем в элементу LI, элемент текст
        elementLi.appendChild(elementLiText);

        // Добавляем в элементу LI специальный атрибут data-place,
        // в котором будет храниться идентификатор адреса
        elementLi.dataset.place = address.place_id;

        // Добавляем элемент LI в элемент UL
        placesResults.appendChild(elementLi);
    }
};

// Вешаем на объект document событие DOMContentLoaded для того, чтобы
// наш JS код выполнялся только после того, как полностью загружена в
// браузер DOM модель.
// Источник: https://learn.javascript.ru/onload-ondomcontentloaded
document.addEventListener('DOMContentLoaded', () => {
    // Ищем в DOM поле address и записываем его в константу addressField
    const addressField = document.querySelector('input[name=address]');
    // Ищем в DOM кнопку Find Places и записываем ее в константу searchButton
    const searchButton = document.querySelector('.btn-primary');
    // Ищем в DOM блок в котором будут показываться адреса в сервера и записываем его в переменную placesResults
    placesResults = document.querySelector('.places-results');
    // Ищем в DOM блок в котором будут показываться ошибки и записываем его в переменную placesErrors
    placesErrors = document.querySelector('.places-errors');
    // Ищем в DOM блок в котором будут показываться успешные операции и записываем его в переменную placesSuccess
    placesSuccess = document.querySelector('.places-success');
    // Ищем в DOM картинку ajax загрузки и записываем его в переменную ajaxLoader
    ajaxLoader = document.querySelector('.ajax-loader');

    // Вешаем на кнопку Find Places обработчик события click
    searchButton.addEventListener('click', () => {
        // Проверяем, что если в поле address ничего нету, тогда просто показываем
        // сообщение с ошибкой и прерываем работу функции, так как нету смысла отправлять
        // пустой address на сервер.
        if (!addressField.value.length) {
            showError('You must enter the address first.');
            return;
        }

        // Прячем блок с ошибкой, если он отображается
        hideError();
        // Прячем блок с успешной операцией, если он отображается
        hideSuccess();
        // Показываем индикатор загрузки ajax (gif картинку)
        showAjaxLoader();

        // Черех axios методом POST отправляем данные на сервер
        axios.post('/getPlacesFromGoogle', {
                address: addressField.value
            })
            .then((response) => {
                // Когда сервер нам вернул ответ, прячем индикатор загрузки ajax (gif картинку)
                hideAjaxLoader();
                // Удаляем все адреса на странице, что были ранее
                clearNode(placesResults);

                // Проверяем, если параметр status, который вернул сервер равен true
                if (response.data.status) {
                    // Тогда передаем в функцию, которая отобразит адреса на странице
                    // массив с адресами, которые вернул сервер
                    showAddressesFromServer(response.data.addresses);
                } else {
                    // Если же произошла какое-то ошибка на сервере, тогда в параметре status
                    // будет значение false, а в параметре message будет текст ошибки
                    // Мы вызываем функцию, которая показывает блок с ошибкой на странице
                    showError(response.data.message);
                }
            })
            .catch((error) => {
                showError(error.message);
            });
    });

    // Вешаем на элемент UL, в котором отображаются адреса обработчик события click
    // В качестве параметра мы передаем объект Event
    // Источник: https://developer.mozilla.org/ru/docs/Web/API/Event/Event
    // Объект Event создается автоматически, когда произошло какое-то событие
    placesResults.addEventListener('click', (event) => {
        // У объекта Event есть свойство target, в нем хранится элемент по которому
        // мы кликнули, в нашем случае это будет один из элементов LI
        // Источник: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
        const selectedLi = event.target;
        // В константу placeId мы помещаем идентификатор адреса, который был получен
        // от сервера, этот идентификатор находится в атрибуте data-place, который мы
        // создали в строке 68 (этого файла, функция showAddressesFromServer)
        const placeId = selectedLi.dataset.place;

        // Прячем блок с ошибкой, если он отображается
        hideError();
        // Прячем блок с успешной операцией, если он отображается
        hideSuccess();
        // Показываем индикатор загрузки ajax (gif картинку)
        showAjaxLoader();

        // Черех axios методом POST отправляем данные на сервер
        axios.post('/setMyAddressFromGooglePlaces', {
                placeId: placeId
            })
            .then((response) => {
                // Когда сервер нам вернул ответ, прячем индикатор загрузки ajax (gif картинку)
                hideAjaxLoader();

                // Проверяем, если параметр status, который вернул сервер равен true
                if (response.data.status) {
                    // Показываем блок с успешной операцией и пишем, что мы в БД записали новый адрес
                    showSuccess(response.data.address);
                } else {
                    // Если же произошла какое-то ошибка на сервере, тогда в параметре status
                    // будет значение false, а в параметре message будет текст ошибки
                    // Мы вызываем функцию, которая показывает блок с ошибкой на странице
                    showError(response.data.message);
                }
            })
            .catch((error) => {
                showError(error.message);
            });
    });
});