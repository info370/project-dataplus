const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');
const axios = require('axios');
var googleRestaurantsArray = [];

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyB5m-8I4J73J-L3hKGOOXjmofqDb-xjU04',
    Promise: Promise
});

performCall();

function performCall() {
    fs.readFile('./Long_and_lat/LongLatOfSeattle.csv', function (err, data) {
        parse(data, { columns: true }, function (err, dataValue) {
            performGoogleRadarSearch(dataValue);
        })
    })
}

function performGoogleRadarSearch(seattleLatlong) {
    var googlePromises = [];
    for (let i = 0; i < seattleLatlong.length; i++) {
        googlePromises.push(createGooglePromise(seattleLatlong[i].Latitude, seattleLatlong[i].Longitude));
    }
    if (googlePromises.length === seattleLatlong.length) {
        axios.all(googlePromises).then(response => {
            let totalNumber = countAllRestaurants(response);
            for (let i = 0; i < response.length; i++) {
                loopRestaurants(response[i].json.results,totalNumber);
            }
        })
    }
}


function createGooglePromise(lat, lon) {
    return googleMapsClient.placesRadar({
        location: [lat, lon],
        radius: 50000,
        type: 'restaurant'
    })
    .asPromise()
    .catch(err => console.log(err));
}

function countAllRestaurants(responseObject) {
    let totalRestaurant = 0;
    for (let i = 0; i < responseObject.length; i++) {
      totalRestaurant += responseObject[i].json.results.length;
    }
    return totalRestaurant;
  }

function loopRestaurants(resultArray,totalRestaurant) {
    for (let i = 0; i < resultArray.length; i++) {
        var businessObject = {
            id: resultArray[i].id,
            placeId: resultArray[i].id,
            Latitude: resultArray[i].geometry.location.lat,
            Longitude: resultArray[i].geometry.location.lng
        }
        googleRestaurantsArray.push(businessObject);
        if (totalRestaurant === googleRestaurantsArray.length) {
          let uniqueGoogleArray = _.uniqBy(googleRestaurantsArray, 'id');
          fs.writeFile('scripts/GoogleRestaurantIDs.json', JSON.stringify(uniqueGoogleArray, null, 2));
        }
      }
}