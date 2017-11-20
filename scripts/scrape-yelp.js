'use strict';

const fs = require('file-system');
const yelp = require('yelp-fusion');
var parse = require('csv-parse');

const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';
var yelpObject = [];

// api info to get census tract
const axios = require('axios');
const headUrl = 'http://data.fcc.gov/api/block/find?format=json&';


// const searchRequest = {
//   latitude: 47.1508088,
//   longitude: -118.3988154,
//   categories: 'Restaurants',
//   radius: 4000,
//   limit: 50
// };
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
    for (var i = 0; i < seattleCensus.length; i++) {
      var searchFields = {
      latitude: seattleCensus[i].Latitude,
      longitude: seattleCensus[i].Longitude,
      categories: 'Restaurants',
      radius: 4000,
      limit: 50
    }
    runRequest(searchFields,client);
  }
    // client.search(searchRequest).then(response => {
    //   var result = response.jsonBody.businesses;
    //   loopBusinessObjects(result);
    // });
  }).catch(e => {
    console.log(e);
  });
}

function runRequest(searchRequest,client) {
  //debugger;
  client.search(searchRequest).then(response => {
    var result = response.jsonBody.businesses;
    loopBusinessObjects(result);
  });
}

function loopBusinessObjects(resultObject) {
  var index = 0;
  totalRestaurant += resultObject.length;
  //debugger;
  for (index; index < resultObject.length; index++) {
    var currentBusiness = resultObject[index];
    var census = new Promise(function (resolve, reject) {
      var apiUrl = headUrl + '&latitude=' + currentBusiness.coordinates.latitude + '&longitude=' + currentBusiness.coordinates.longitude;
      axios.get(apiUrl)
        .then(function (response) {
          var code = response.data.Block.FIPS;
          resolve(code);
        })
        .catch(function (error) {
          reject(error);
        });
    })
    census.then(function (fullfilled) {
      createBusinessObject(currentBusiness, fullfilled);
    }).catch(function (error) {
      console.log(error.message);
    });
  }
}

function createBusinessObject(eachRestaurant, fips) {
  var fipsSubstr = fips.toString().substring(5, 10);
  var census = parseInt(fipsSubstr);
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
    censusTract: census,
    state: eachRestaurant.location.state,
    phone: eachRestaurant.phone
  }
  yelpObject.push(businessObject);
  if (totalRestaurant === yelpObject.length) {
    debugger;
    fs.writeFile('scripts/SeattleRestaurantsByCensusTracts.json', JSON.stringify(yelpObject, null, 2));
  }
}