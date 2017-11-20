'use strict';

const fs = require('file-system');
const yelp = require('yelp-fusion');
const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';
var yelpObject = [];

// api info to get census tract
const axios = require('axios');
//const headUrl = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=";
//const tailUrl = "&benchmark=9&vintage=910&format=json";
const headUrl = 'http://data.fcc.gov/api/block/find?format=json&';
// https://geocoding.geo.census.gov/geocoder/geographies/address?street=214%20W%20Main%20St&city=Ritzville&state=WA&zip=99169&benchmark=9&vintage=910&format=json


// http://data.fcc.gov/api/block/find?format=json&latitude=47.1273723&longitude=-118.3988154


const searchRequest = {
  latitude: 47.1508088,
  longitude: -118.3988154,
  categories: 'Restaurants',
  radius: 4000,
  limit: 50
};
var totalRestaurant = 0;

function performYelpRequest() {
  yelp.accessToken(clientId, clientSecret).then(response => {
    var client = yelp.client(response.jsonBody.access_token);
    client.search(searchRequest).then(response => {
      var result = response.jsonBody.businesses;
      loopBusinessObjects(result);
    });
  }).catch(e => {
    console.log(e);
  });
}

function loopBusinessObjects(resultObject) {
  var index = 0;
  totalRestaurant+=resultObject.length;
  debugger;
  for (index; index < resultObject.length; index++) {
    var currentBusiness = resultObject[index];
    var census = new Promise(function (resolve, reject) {
      var apiUrl = headUrl + '&latitude='+ currentBusiness.coordinates.latitude+'&longitude='+currentBusiness.coordinates.longitude;
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
      createBusinessObject(currentBusiness,fullfilled);
    }).catch(function (error) {
      console.log(error.message);
    });
  }
}

function createBusinessObject(eachRestaurant,fips) {
  var fipsSubstr = fips.toString().substring(5,10);
  var census = parseInt(fipsSubstr);
  debugger;
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
    fs.writeFile('scripts/testyelp.json', JSON.stringify(yelpObject, null, 2));
  }
}

performYelpRequest();