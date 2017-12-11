const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');
const axios = require('axios');
var googleArray = [];

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyB5m-8I4J73J-L3hKGOOXjmofqDb-xjU04',
    Promise: Promise,
    timeout: 60 * 2000
});

runRestaurantSearch();

function runRestaurantSearch() {
    var restaurantFile = fs.readFileSync('./scripts/GoogleRestaurantIDs.json');
    var googleJson = JSON.parse(restaurantFile);
    var promiseArray = [];
    for (let i = 0; i < googleJson.length; i++) {
        promiseArray.push(createGooglePromise(googleJson[i].placeId + ""));
    }
    if (promiseArray.length === googleJson.length) {
        axios.all(promiseArray).then(response => {
            for (let i = 0; i < promiseArray.length; i++) {
                recreateObject(response[i], googleJson[i], googleJson.length);
            }
        })
    }
}

function createGooglePromise(placeId) {
    return googleMapsClient.place({
        placeid: placeId
    })
        .asPromise()
        .catch(err => console.log(err));
}

function recreateObject(restaurant, formerObject, size) {
    debugger;
    let googlePhone = '+1' + restaurant.json.result.formatted_phone_number.replace(/[^0-9]/g, '');
    formerObject.googleName = restaurant.json.result['name'];
    formerObject.googleStreet = restaurant.json.result['address_components'][0]['short_name'] + " "
        + restaurant.json.result['address_components'][1]['short_name'];
    formerObject.googleCity = restaurant.json.result['address_components'][3]['short_name'];
    formerObject.googleZip = restaurant.json.result['address_components'][7]['short_name'];
    formerObject.googleState = restaurant.json.result['address_components'][5]['short_name'];
    formerObject.phoneNumber = googlePhone;
    formerObject.rating = restaurant.json.result.rating;
    googleArray.push(formerObject);
    if (googleArray.length === size) {
        debugger;
        fs.writeFile('scripts/GoogleRestaurants.json', JSON.stringify(_.sortBy(googleArray, 'googleName'), null, 2));
    }
}