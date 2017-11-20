'use strict';

const fs = require('file-system');
const yelp = require('yelp-fusion');
const _ = require('lodash');
var parse = require('csv-parse');

const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';
var yelpObject = [];

// api info to get census tract
const axios = require('axios');
const headUrl = 'http://data.fcc.gov/api/block/find?format=json&';

var totalRestaurant = 0;

performCall();

function performCall() {
  fs.readFile('./Seattle Census Tract Lat Long - Sheet1.csv', function (err, data) {
    parse(data, { columns: true }, function (err, dataValue) {
      performYelpRequest(dataValue);
    })
  })
}

function performYelpRequest(seattleCensus) {
  yelp.accessToken(clientId, clientSecret).then(response => {
    var client = yelp.client(response.jsonBody.access_token);
    // change back to: i < seattleCensus.length
    for (var i = 0; i < 2; i++) {
      var searchFields = {
        latitude: seattleCensus[i].Latitude,
        longitude: seattleCensus[i].Longitude,
        categories: 'Restaurants',
        radius: 4000,
        limit: 50
      }
      runRequest(searchFields, client);
    }
  }).catch(e => {
    console.log(e);
  });
}

function runRequest(searchRequest, client) {
  //debugger;
  client.search(searchRequest).then(response => {
    var result = response.jsonBody.businesses;
    loopBusinessObjects(result);
  });
}

function loopBusinessObjects(resultObject) {
  var index = 0;
  totalRestaurant += resultObject.length;
  var promiseArray = [];
  //debugger;
  for (index; index < resultObject.length; index++) {
    promiseArray.push(createPromise(resultObject[index].coordinates.latitude, resultObject[index].coordinates.longitude));
  }
  if (promiseArray.length === resultObject.length) {
    axios.all(promiseArray).then(response => {
      for (let i = 0; i < resultObject.length; i++) {
        createBusinessObject(resultObject[i], response[i].data.Block.FIPS);
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
  })
}

function createBusinessObject(eachRestaurant, fips) {
  var fipsSubstr = fips.toString().substring(5, 11);
  var census = parseFloat(fipsSubstr);
  //debugger;
  var businessObject = {
    id: eachRestaurant.id,
    url: eachRestaurant.url,
    reviewCount: eachRestaurant.review_count,
    rating: eachRestaurant.rating,
    latitude: eachRestaurant.coordinates.latitude,
    longitude: eachRestaurant.coordinates.longitude,
    price: eachRestaurant.price,
    street: eachRestaurant.location.address1,
    city: eachRestaurant.location.city,
    zipCode: eachRestaurant.location.zip_code,
    censusTract: census / 10.0,
    state: eachRestaurant.location.state,
    phone: eachRestaurant.phone
  }
  yelpObject.push(businessObject);
  if (totalRestaurant === yelpObject.length) {
    let uniqueYelpArray = _.uniqBy(yelpObject, 'id');
    debugger;
    fs.writeFile('scripts/SeattleRestaurantsByCensusTracts.json', JSON.stringify(uniqueYelpArray, null, 2));
  }
}