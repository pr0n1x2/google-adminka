// Вешаем на объект document событие DOMContentLoaded для того, чтобы
// наш JS код выполнялся только после того, как полностью загружена в
// браузер DOM модель.
// Источник: https://learn.javascript.ru/onload-ondomcontentloaded
document.addEventListener('DOMContentLoaded', () => {
    // Ищем в DOM поле phone и записываем его в константу phoneField
    const phoneField = document.querySelector('input[name=phone]');
    // Ищем в DOM поле birthday и записываем его в константу birthdayField
    const birthdayField = document.querySelector('input[name=birthday]');

    // Далее идут настройки для модуля imaskjs
    // Источник: https://unmanner.github.io/imaskjs/

    // Задаем настройки для маски в поле phone
    const phoneMaskOptions = { mask: '(000) 000-00-00' };

    // Задаем настройки для маски в поле birthday
    // Источник: https://unmanner.github.io/imaskjs/guide.html#date
    const birthdayMaskOptions = {
        mask: Date,
        pattern: 'Y-`m-`d',
        blocks: {
            d: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2,
            },
            m: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2,
            },
            Y: {
                mask: IMask.MaskedRange,
                from: 1900,
                to: 9999,
            }
        },
        format: function (date) {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            const year = date.getFullYear();

            if (day < 10) day = "0" + day;
            if (month < 10) month = "0" + month;

            return [year, month, day].join('-');
        },
        parse: function (str) {
            const yearMonthDay = str.split('-');
            return new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]);
        },
        min: new Date(1930, 0, 1),  // defaults to 1900-01-01
        max: new Date(2019, 0, 1),  // defaults to 9999-01-01
    };

    // Создаем два объекта типа IMask
    // В каждый объект передаем поле к которому должна быть применена маска
    // и сами настройки маски
    const phoneMask = new IMask(phoneField, phoneMaskOptions);
    const birthdayMask = new IMask(birthdayField, birthdayMaskOptions);

    // Далее будем сохранять в localStorage E-mail, который ввел пользователь через форму

    // Ищем в DOM элемент form и записываем его в константу formElement
    const formElement = document.querySelector('form');
    // Ищем в DOM поле email и записываем его в константу emailField
    const emailField = document.querySelector('input[name=email]');

    // Вешаем на форму обработчик события submit, чтобы узнать когда пользователь
    // нажал на кнопку Register
    formElement.addEventListener('submit', () => {
        // Записываем в localStorage значение поля email
        // Источник: https://tproger.ru/articles/localstorage/
        localStorage.setItem('userEmail', emailField.value);
    });
});