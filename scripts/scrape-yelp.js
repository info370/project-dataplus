'use strict';

const fs = require('file-system');
const yelp = require('yelp-fusion');
//const converter = require('./location-converter');
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
  for (index; index < resultObject.length; index++) {
    var currentBusiness = resultObject[index];
    var census = new Promise(function (resolve, reject) {
      var apiUrl = headUrl + '&latitude='+ currentBusiness.coordinates.latitude+'&longitude='+currentBusiness.coordinates.longitude;
      axios.get(apiUrl)
        .then(function (response) {
          var code = response.data.Block.FIPS;
          debugger;
          resolve(code);
        })
        .catch(function (error) {
          reject(error);
        });
    })
    census.then(function (fullfilled) {
      debugger;
      createBusinessObject(currentBusiness,fullfilled);
    }).catch(function (error) {
      console.log(error.message);
    });

  }

  // if (index === result.length) {
  //   fs.writeFile('scripts/testyelp.json', JSON.stringify(yelpObject, null, 2));
  // }
  debugger;
}


function createBusinessObject(eachRestaurant, census) {
  debugger;
  var businessObject = {
    id: currentBusiness.id,
    url: currentBusiness.url,
    review_count: currentBusiness.review_count,
    rating: currentBusiness.rating,
    latitude: currentBusiness.coordinates.latitude,
    longitude: currentBusiness.coordinates.longitude,
    price: currentBusiness.price,
    street: currentBusiness.location.address1,
    city: currentBusiness.location.city,
    zip_code: currentBusiness.location.zip_code,
    fips_code: census,
    state: currentBusiness.location.state,
    phone: currentBusiness.phone
  }
  debugger;
  yelpObject.push(businessObject);
}

// function getTract (lat, long) {
//   var apiUrl = headUrl + "x=" + lat + "&y=" + long + tailUrl;
//   axios.get(apiUrl)
//       .then(function (response) {
//           debugger;
//           return response.data.result.geographies['Census Blocks'][0]['TRACT'];
//       })
//       .catch(function (error) {
//           return error;
//       });
// }

performYelpRequest();