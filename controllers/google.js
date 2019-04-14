const config = require('config');
const MapsClient = require('@google/maps');

const SESSION_TOKEN = 'randomstr';
let googleMapsClient = null;

const init = () => {
    if (!googleMapsClient) {
        googleMapsClient = MapsClient.createClient({
            key: config.get('maps:api'),
            Promise: Promise
        });
    }

    return googleMapsClient;
};

const placesAutoComplete = (input) => {
    return googleMapsClient.placesAutoComplete({
        input: input,
        sessiontoken: SESSION_TOKEN, // Не знаю, что сюда передавать!!!
        language: 'uk',
    }).asPromise();
};

const placeDetails = (placeId) => {
    return googleMapsClient.place({
        placeid: placeId,
        language: 'uk',
    }).asPromise();
};

const placesPhoto = (photoreference) => {
    return googleMapsClient.placesPhoto({
        photoreference: photoreference,
        maxwidth: 500,
    }).asPromise();
};

const getErrorByStatusCode = (code) => {
    let message;

    switch (code) {
        case 'ZERO_RESULTS':
            message = 'No matches were found';
            break;
        case 'OVER_QUERY_LIMIT':
            message = 'You have exceeded your quota';
            break;
        case 'REQUEST_DENIED':
            message = 'Your request has been denied';
            break;
        case 'INVALID_REQUEST':
            message = 'The request to the server is incorrect';
            break;
        default:
            message = 'Unknown error';
            break;
    }

    return message;
};

module.exports.init = init;
module.exports.placesAutoComplete = placesAutoComplete;
module.exports.placeDetails = placeDetails;
module.exports.placesPhoto = placesPhoto;
module.exports.getErrorByStatusCode = getErrorByStatusCode;