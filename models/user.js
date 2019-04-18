// Подключаем модуль mongoose для работы с базой данных
const mongoose = require('mongoose');

// Подключаем схему Person
const PersonSchema = require('./schemes/person');

// Получаем объект Schema, который позволит нам создать
// коллекцию User
// Источник: https://mongoosejs.com/docs/guide.html
const Schema = mongoose.Schema;

// Создаем схему User
const userSchema = new Schema({
    // Указываем, что в свойстве person будут храниться значение из схемы PersonSchema
    person: PersonSchema,
    // Права которыми обладает пользователь
    role: {
        type: String,               // Указываем тип поля Строка
        enum: ['admin', 'user'],    // Указываем, что в этом поле могут храниться только 2 значение admin или user
        default: 'user'             // Указываем, что по умолчанию будет вставляться значение user
    },
    // Храним последний идентификатор сессии, которая присвоилась пользователю
    lastSessionId: {
        type: String,
        required: false
    },
    // Специальная метка указывающая, что акаунт был взломан через Cookies token
    isCookiesHacked: {
        type: Boolean,              // Указываем тип поля Булевский тип
        required: false,
        default: false
    }
}, {
    // Временные метки
    // Источник: https://mongoosejs.com/docs/guide.html#timestamps
    timestamps: true,
});

// Создаем ПРИВАТНЫЙ метод, который форматирует дату в определенный формат
// Первым аргументом принимаем дату, вторым агрументом указываем, что
// нужно или нет выводить время
const getFormatedDate = (date, isShowTime = false) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let formatedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    if (isShowTime) {
        let hours = date.getHours();
        let minutes = date.getMinutes();

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        formatedDate = `${formatedDate} at ${hours}:${minutes}`;
    }

    return formatedDate;
};

// Создаем виртуальное свойство, которого на самом деле не существует в реальном
// документе User, но мы можем к нему обратиться и получить значение на основе
// вычислений, которые мы укажем в этом свойстве
// Источник: https://mongoosejs.com/docs/guide.html#virtuals
userSchema.virtual('fullName').get(function () {
    return `${this.person.name} ${this.person.surname}`;
});

// Создаем виртуальное свойство age
// Вычисляем его из даты рождения пользователя
userSchema.virtual('age').get(function () {
    if (this.person.birthday) {
        const today = new Date();
        const month = today.getMonth() - this.person.birthday.getMonth();

        let age = today.getFullYear() - this.person.birthday.getFullYear();

        if (month < 0 || (month === 0 && today.getDate() < this.birthday.getDate())) {
            age--;
        }

        return age;
    }

    return null;
});

// Создаем метод, который возвращает дату рождения в отпреденном формате
// Источник: https://mongoosejs.com/docs/guide.html#methods
userSchema.methods.getBirthday = function() {
    if (this.person.birthday) {
        return getFormatedDate(this.person.birthday);
    }

    return null;
};

// Создаем метод, который возвращает дату, когда пользователь зарегистрировался
// в отпреденном формате
userSchema.methods.getRegisteredDate = function() {
    return getFormatedDate(this.createdAt, true);
};

// Создаем метод, который возвращает дату рождения в формате, который можно редактировать
userSchema.methods.getEditableBirthday = function() {
    if (this.person.birthday) {
        let day = this.person.birthday.getDate();
        let month = this.person.birthday.getMonth() + 1;

        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;

        return `${this.person.birthday.getFullYear()}-${month}-${day}`;
    }

    return null;
};

// Создаем коллекцию User на основе схемы userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;