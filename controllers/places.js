const googleMapsClient = require('controllers/google');

// Эта middleware функция будет вызываться, когда
// пользователь запросил страницу /places методом GET
const placesView = (req, res, next) => {
    res.render('places', { title: 'Google places' });
};

module.exports.placesView = placesView;