// Подключаем модель Country
const Country = require('models/country');

const init = () => new Promise((resolve, reject) => {
    // Просим БД, чтобы она нам вернула общее количество Документов в
    // Коллекции Country
    // Источник: https://mongoosejs.com/docs/api.html#model_Model.countDocuments
    Country.countDocuments()
        // Когда БД подсчитает количество документов, их количество она
        // запишет в переменную count
        .then((count) => {
            // Проеряем, если в базе данных ничего нету, тогда Коллекцию Country заполним некоторыми значениями
            if (!count) {
                // Заполняем массив объктами из стран
                const countries = [
                    {_id: '5cb225668613b224648240f8', name: 'Denmark'},
                    {_id: '5cb225668613b224648240f9', name: 'Australia'},
                    {_id: '5cb225668613b224648240fa', name: 'Ethiopia'},
                    {_id: '5cb225668613b224648240fb', name: 'Italy'},
                    {_id: '5cb225668613b224648240fc', name: 'Canada'},
                    {_id: '5cb225668613b224648240fd', name: 'Brazil'},
                    {_id: '5cb225668613b224648240fe', name: 'Russia'},
                    {_id: '5cb225668613b224648240ff', name: 'Ukraine'},
                    {_id: '5cb225668613b22464824100', name: 'Zimbabwe'},
                    {_id: '5cb225668613b22464824101', name: 'Germany'},
                    {_id: '5cb22abcd4f5cf23e88a85d2', name: 'Cuba'}
                ];

                // Записываем значение в базу данных и передаем результат в следующий then
                // Источник: https://mongoosejs.com/docs/api.html#model_Model.create
                return Country.create(countries);
            } else {
                // Если в Коллекции Country уже что-то есть, тогда ничего не делаем
                return false;
            }
        })
        .then((result) => {
            if (!result) {
                console.log('Collection Country already exists');
            } else {
                console.log('The collection Country has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;