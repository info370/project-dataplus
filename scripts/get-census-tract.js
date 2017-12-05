'use strict';

const axios = require('axios');
const headUrl = 'http://data.fcc.gov/api/block/find?format=json';
const fs = require('file-system');
const _ = require('lodash');
var yelpObject = [];

runApi();

function runApi() {
    var restaurantFile = fs.readFileSync('./scripts/SeattlerestaurantsDirectory.json');
    var foodFile = fs.readFileSync('./scripts/SeattlefoodDirectory.json');
    var yelpJson = _.uniqBy(_.concat(JSON.parse(restaurantFile),JSON.parse(foodFile)),'id');
    var promiseArray = [];
    debugger;
    for (let i = 0; i < yelpJson.length; i++) {
        promiseArray.push(createPromise(yelpJson[i].latitude, yelpJson[i].longitude));
    }
    if (promiseArray.length === yelpJson.length) {
        axios.all(promiseArray).then(response => {
            for (let i = 0; i < promiseArray.length; i++) {
                recreateObject(response[i].data.Block.FIPS,yelpJson[i],yelpJson.length);
            }
        })
    }
}

function createPromise(lat, long) {
    var apiUrl = headUrl + '&latitude=' + lat + '&longitude=' + long;
    return axios({
        method: 'get',
        url: apiUrl,
        responseType: 'json'
    }).then((error) => {
        console.log("broken link: "+ apiUrl);
    });
}

// to add FIPS in existing object
function recreateObject(fips,restaurantObject,size) {
    let census = fips.substring(0,11);
    restaurantObject.blockFIPS = fips;
    restaurantObject.GeoId = census;
    yelpObject.push(restaurantObject);
    if (yelpObject.length === size) {
        fs.writeFile('scripts/RestaurantsWithFips.json', JSON.stringify(_.sortBy(yelpObject,'id'), null, 2));
    }
}
