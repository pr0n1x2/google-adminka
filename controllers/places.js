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
    const { address } = req.body;

    try {
        const responseFromGooglePlaces = await googleMapsClient.placesAutoComplete(address);

        if (responseFromGooglePlaces.json.status === 'OK') {
            const addresses = [];

            for (let address of responseFromGooglePlaces.json.predictions) {
                addresses.push({id: address.id, place_id: address.place_id, address: address.description})
            }

            res.json({ status: true, addresses });
        } else {
            throw new Error(googleMapsClient.getErrorByStatusCode(responseFromGooglePlaces.json.status));
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

module.exports.placesView = placesView;
module.exports.getAddressesFromGooglePlaces = getAddressesFromGooglePlaces;