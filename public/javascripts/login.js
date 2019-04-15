// Вешаем на объект document событие DOMContentLoaded для того, чтобы
// наш JS код выполнялся только после того, как полностью загружена в
// браузер DOM модель.
// Источник: https://learn.javascript.ru/onload-ondomcontentloaded
document.addEventListener('DOMContentLoaded', () => {
    // Ищем в DOM элемент form и записываем его в константу formElement
    const formElement = document.querySelector('form');
    // Ищем в DOM поле email и записываем его в константу emailField
    const emailField = document.querySelector('input[name=email]');

    // Получаем из localStorage значение по ключу userEmail
    // Источник: https://tproger.ru/articles/localstorage/
    const userEmail = localStorage.getItem('userEmail');

    // Если в localStorage хранилось какое-то значение, тогда вставляем
    // это значение в форму в поле email
    if (userEmail !== null) {
        emailField.value = userEmail;
    }

    // Вешаем на форму обработчик события submit, чтобы узнать когда пользователь
    // нажал на кнопку Log In
    // Это делаем для того, чтобы если у пользователя несколько аккаунтов, то
    // чтобы в localStorage хранилось значение последнего E-mail, под которым
    // пользователь заходил на сайт.
    formElement.addEventListener('submit', () => {
        // Записываем в localStorage значение поля email
        // Источник: https://tproger.ru/articles/localstorage/
        localStorage.setItem('userEmail', emailField.value);
    });
});