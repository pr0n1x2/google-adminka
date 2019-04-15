let placesSuccess, placesErrors, ajaxLoader, placesResults;

const showError = (message) => {
    const messagesSpan = placesErrors.querySelector('span.message');

    messagesSpan.innerText = message;
    placesErrors.classList.add('places-errors-visible');
};

const hideError = () => {
    placesErrors.classList.remove('places-errors-visible');
};

const showAjaxLoader = () => {
    ajaxLoader.classList.add('ajax-loader-visible');
};


const hideAjaxLoader = () => {
    ajaxLoader.classList.remove('ajax-loader-visible');
};

const clearNode = (node) => {
    while (node.firstChild) {
        node.firstChild.remove();
    }
};

const showAddressesFromServer = (addresses) => {
    clearNode(placesResults);

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
    placesSuccess = document.querySelector('.places-errors');
    // Ищем в DOM картинку ajax загрузки и записываем его в переменную ajaxLoader
    ajaxLoader = document.querySelector('.ajax-loader');

    searchButton.addEventListener('click', () => {
        if (!addressField.value.length) {
            showError('You must enter the address first.');
            return;
        }

        hideError();
        showAjaxLoader();

        axios.post('/getPlacesFromGoogle', {
                address: addressField.value
            })
            .then(function (response) {
                hideAjaxLoader();

                if (response.status) {
                    showAddressesFromServer(response.addresses);
                } else {
                    showError(response.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    });
});