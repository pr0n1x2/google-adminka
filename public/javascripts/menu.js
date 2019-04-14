// Получаем свойство pathname объекта locations
// Источник: https://www.w3schools.com/js/js_window_location.asp
const locationPathname = window.location.pathname;

// Вешаем на объект document событие DOMContentLoaded для того, чтобы
// наш JS код выполнялся только после того, как полностью загружена в
// браузер DOM модель.
// Источник: https://learn.javascript.ru/onload-ondomcontentloaded
document.addEventListener('DOMContentLoaded', () => {
    // Получаем родительский элемент UL всех менюшек LI
    // Источник: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
    const menuContainer = document.querySelector('.navbar-nav');

    // Родитель имеет детей, в нашем случае в menuContainer есть свойство
    // children в котором хранятся все дели, в нашем случае это элементы LI.
    // Когда мы обращаемся к свойству children оно нам возвращает объект
    // HTMLCollection, который похож на массив и мы можем работать с ним
    // как с масссивом.

    // Перебираем всех детей родителя menuContainer, это наши меню, а именно
    // элементы LI
    for (let menu of menuContainer.children) {
        // Каждому элементу LI мы задали аттрибут data-url
        // Мы проверяем если аттрибут data-url такой же как и locationPathname,
        // тогда мы делаем это меню активное.
        // Источник: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
        if (menu.dataset.url === locationPathname) {
            // Добавляет элементу LI класс active
            menu.classList.add('active');

            // Прерываем работу цикла, так как мы нашли нужное меню, то перебирать
            // следующие элементы нету смысла и мы выходим заранее из цикла.
            break;
        }
    }
});