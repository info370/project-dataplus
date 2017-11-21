'use strict';

const axios = require('axios');
const headUrl = 'http://data.fcc.gov/api/block/find?format=json&';
const fs = require('file-system');
const _ = require('lodash');
var yelpObject = [];

// run first segment and save RestaurantsWithFips-1.json; run one at a time
// @params: (starting index, ending index)
runApi(0,3010);
// run second segment and save to RestaurantsWithFips-2.json
//runApi(323,646);

function runApi(start,end) {
    var restaurantFile = fs.readFileSync('./scripts/SeattlerestaurantsDirectory.json');
    var foodFile = fs.readFileSync('./scripts/SeattlefoodDirectory.json');
    var yelpJson = _.uniqBy(_.concat(JSON.parse(restaurantFile),JSON.parse(foodFile)),'id');
    // total element = 3010
    var promiseArray = [];
    //debugger;
    var segmentSize = end-start;
    for (let i = start; i < end; i++) {
        promiseArray.push(createPromise(yelpJson[i].latitude, yelpJson[i].longitude));
    }
    if (promiseArray.length === segmentSize) {
        axios.all(promiseArray).then(response => {
            for (let i = 0; i < promiseArray.length; i++) {
                recreateObject(response[i].data.Block.FIPS,yelpJson[start+i],segmentSize);
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
    });
}

// to add FIPS in existing object
function recreateObject(fips,restaurantObject,size) {
    let census = fips.substring(0,11);
    restaurantObject.blockFIPS = fips;
    restaurantObject.censusTract = census;
    yelpObject.push(restaurantObject);
    if (yelpObject.length === size) {
        debugger;
        // for segment 1; run one at a time
        //fs.writeFile('scripts/RestaurantsWithFips-1.json', JSON.stringify(yelpObject, null, 2));

        // for segment 2
        fs.writeFile('scripts/RestaurantsWithFips.json', JSON.stringify(_.sortBy(yelpObject,'id'), null, 2));
    }
}
