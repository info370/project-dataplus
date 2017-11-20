// NEED WORK/ DO LATER

const axios = require('axios');
var fs = require('file-system');

var apiKey = 'AIzaSyB5m-8I4J73J-L3hKGOOXjmofqDb-xjU04';
var endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
var restaurantToken = '&type=restaurant';
var restaurantObject = []; // to store all restaurants
var zipcode = ['98144', '98105']; // list all necessary zipcode for text search
var tokensCompleted = 0; // counter to determine once each call is done (i.e. counter increases when all 98144 search return results)
const requestUrl = endpoint + 'key=' + apiKey + restaurantToken + '&query='; // format for performing a call


function runApiCalls() {
    zipcode.forEach(item => {
        var urlByZipcode = requestUrl + item + '&pagetoken=';
        debugger;
        requestCall(urlByZipcode, "");
    });
}

// initiate the run
runApiCalls();

// run an initial search to get first page of results and next page token per zip code
// then, run search for all results based on next page token (getting all 60 results)
// need to refactor, might not need page token parameter
function requestCall(urlAddress, pageToken) {
    var adjustedUrl = urlAddress + pageToken;
    request(adjustedUrl, function (error, response, body) {
        var requestResult = JSON.parse(body);
        addRestaurantData(requestResult.results);
        if (requestResult['next_page_token'] !== undefined) {
            var nextPage = requestResult['next_page_token'];
            getNextToken(urlAddress, nextPage);
        }
    });
}

// recursive function to get all results based on token
function getNextToken(url, pageToken) {
    if (pageToken !== undefined) {
        var nextPageUrl = url + pageToken;
        request(nextPageUrl, function (error, response, body) {
            var json = JSON.parse(body);
            addRestaurantData(json.results);
            debugger;
                getNextToken(url, json['next_page_token']);
        });
    } else {
        tokensCompleted ++;
        if (tokensCompleted === zipcode.length) {
            writeJson();
        }
    }
}

// store results from each call/query into the global variable
function addRestaurantData(results) {
    results.forEach(item => {
        restaurantObject.push(item);
    });
    debugger;
}

// write the restaurant object into a json in /scripts
function writeJson() {
    debugger;
    fs.writeFile('testobject.json', JSON.stringify(restaurantObject,null,2));
}
