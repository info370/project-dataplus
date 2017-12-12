const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');
const axios = require('axios');
var googleArray = [];

// our key: AIzaSyB5m-8I4J73J-L3hKGOOXjmofqDb-xjU04
// benji key: AIzaSyBwcY4nVSPZBt-EywM2--iPbi1H5EGM430
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBwcY4nVSPZBt-EywM2--iPbi1H5EGM430',
    Promise: Promise
});

runRestaurantSearch();

function runRestaurantSearch() {
    var restaurantFile = fs.readFileSync('./scripts/GoogleRestaurantIDs.json');
    var googleJson = JSON.parse(restaurantFile);
    debugger;
    var promiseArray = [];
    let testLimit = 1;
    for (let i = 0; i < googleJson.length; i++) {
        promiseArray.push(createGooglePromise(googleJson[i].placeId + ""));
    }
    if (promiseArray.length === googleJson.length) {
        axios.all(promiseArray).then(response => {
            for (let i = 0; i < promiseArray.length; i++) {
                //debugger;
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
    if (restaurant !== undefined) {
        let googlePhone = restaurant.json.result.formatted_phone_number === undefined ? null
            : '+1' + restaurant.json.result.formatted_phone_number.replace(/[^0-9]/g, '');
        let addressNumber = restaurant.json.result['address_components'][0] === undefined ? null
            : restaurant.json.result['address_components'][0]['short_name'];
        let addressStreet = restaurant.json.result['address_components'][1] === undefined ? null
            : restaurant.json.result['address_components'][1]['short_name'];
        let fullStreet = addressNumber + " " + addressStreet;
        formerObject.googleName = restaurant.json.result['name'] === undefined ? null : restaurant.json.result['name'];
        formerObject.googleStreet = fullStreet;
        formerObject.googleCity = restaurant.json.result['address_components'][3] === undefined ? null
            : restaurant.json.result['address_components'][3]['short_name'];
        formerObject.googleZip = restaurant.json.result['address_components'][7] === undefined ? null
            : restaurant.json.result['address_components'][7]['short_name'];
        formerObject.googleState = restaurant.json.result['address_components'][5] === undefined ? null
            : restaurant.json.result['address_components'][5]['short_name'];
        formerObject.phoneNumber = googlePhone;
        formerObject.rating = restaurant.json.result.rating === undefined ? null : restaurant.json.result.rating;
        googleArray.push(formerObject);
        if (googleArray.length === size) {
            console.log(googleArray.length);
            debugger;
            fs.writeFile('scripts/GoogleRestaurants.json', JSON.stringify(_.sortBy(googleArray, 'googleName'), null, 2));
        }
    }
}