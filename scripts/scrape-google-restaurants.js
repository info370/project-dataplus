const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');
const axios = require('axios');
var googleArray =[];
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyB5m-8I4J73J-L3hKGOOXjmofqDb-xjU04',
    Promise: Promise
});

runRestaurantSearch();

function runRestaurantSearch() {
    var restaurantFile = fs.readFileSync('./scripts/GoogleRestaurantIDs.json');
    var googleJson = JSON.parse(restaurantFile);
    var promiseArray = [];
    for (let i = 0; i < 4; i++) {
        promiseArray.push(createGooglePromise(googleJson[i].placeId));
    }
    if (promiseArray.length === 4) {
        axios.all(promiseArray).then(response => {
            for (let i = 0; i < promiseArray.length; i++) {
                recreateObject(response[i],googleJson[i],4);
            }
        })
    }
}

function createGooglePromise(placeId) {
    return googleMapsClient.place({
        placeid: placeId}).asPromise()
    .catch(err => console.log(err));
}

function recreateObject(restaurant,formerObject,size) {
    debugger;
    // if (googleArray.length === size) {
    //     fs.writeFile('scripts/RestaurantsWithFips.json', JSON.stringify(_.sortBy(yelpObject,'id'), null, 2));
    // }
}