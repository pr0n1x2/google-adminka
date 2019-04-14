// Подключаем модель User
const User = require('models/user');

const init = () => new Promise((resolve, reject) => {
    // Просим БД, чтобы она нам вернула общее количество Документов в
    // Коллекции User
    // Источник: https://mongoosejs.com/docs/api.html#model_Model.countDocuments
    User.countDocuments()
        // Когда БД подсчитает количество документов, их количество она
        // запишет в переменную count
        .then((count) => {
            // Проеряем, если в базе данных ничего нету, тогда Коллекцию User заполним одним юзером
            if (!count) {
                // Создаем дату рождения пользователя
                const birthday = new Date(102780400);

                // Создаем пользователя с права admin
                const user = new User({
                    person: {
                        name: 'Ernesto',
                        surname: 'Che Guevara',
                        email: 'cheguevara@gmail.com',
                        phone: '(067) 230-34-12',
                        country: '5cb22abcd4f5cf23e88a85d2',
                        birthday: birthday.toISOString(),
                        password: '$2b$10$sb47Zx0.VwyiQatMSZW/G.aUa4ez3QJAklzm380H8xnQay2EmFozm', // 123456
                    },
                    role: 'admin'
                });

                // Записываем значение в базу данных и передаем результат в следующий then
                // Источник: https://mongoosejs.com/docs/api.html#document_Document-save
                return user.save();
            } else {
                return false;
            }
        })
        .then((user) => {
            if (!user) {
                console.log('Collection User already exists');
            } else {
                console.log('The collection User has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;