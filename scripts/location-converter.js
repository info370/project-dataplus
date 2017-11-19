'use strict';
/*
x - lat
y - long
benchmark 9 = Public_AR_Census2010
vintage 910 = Census2010_Census2010

source: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
parameter options: https://geocoding.geo.census.gov/geocoder/geographies/coordinates?form

sample call: https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=-76.92691&y=38.846542&benchmark=9&vintage=910&format=json
x=-76.92691&y=38.846542
*/
//var request = require('request');
const axios = require('axios');

var headUrl = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates?";
var tailUrl = "&benchmark=9&vintage=910&format=json";


// exports.getTract = (lat,long) => {
//     let apiUrl = headUrl+"x="+lat+"&y="+long+tailUrl;
//     //debugger;
//     request(apiUrl,(error, response, body) => {
//         var json = JSON.parse(body);
//         // var censusTractCode =  json.result.geographies['Census Blocks'][0]['TRACT'];
//         // debugger;
//         // return censusTractCode;
//         return json.result.geographies['Census Blocks'][0]['TRACT'];
//     });
// }

exports.getTract = (lat, long) => {
    var apiUrl = headUrl + "x=" + lat + "&y=" + long + tailUrl;
    axios.get(apiUrl)
        .then(function (response) {
            debugger;
            return response.data.result.geographies['Census Blocks'][0]['TRACT'];
        })
        .catch(function (error) {
            return error;
        });
}
