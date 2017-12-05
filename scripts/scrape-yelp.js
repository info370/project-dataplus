'use strict';

const fs = require('file-system');
const yelp = require('yelp-fusion');
const _ = require('lodash');
var parse = require('csv-parse');

const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';
var yelpObject = [];


// @param: categories type
// run one at a time

performCall('food');
//performCall('restaurants');

function performCall(categoryType) {
  fs.readFile('./Long_and_lat/LongLatOfSeattle.csv', function (err, data) {
    parse(data, { columns: true }, function (err, dataValue) {
      performYelpRequest(dataValue, categoryType);
    })
  })
}

function performYelpRequest(seattleCensus, categoryType) {
  var yelpPromises = [];
  debugger;
  yelp.accessToken(clientId, clientSecret).then(response => {
    var client = yelp.client(response.jsonBody.access_token);
    for (let i = 0; i < seattleCensus.length; i++) {
      var searchFields = {
        latitude: seattleCensus[i].Latitude,
        longitude: seattleCensus[i].Longitude,
        categories: categoryType,
        radius: 1000,
        limit: 50
      }
      yelpPromises.push(runRequest(searchFields, client));
    }
    if (yelpPromises.length === seattleCensus.length) {
      Promise.all(yelpPromises).then(response => {
        var totalNumber = countAllRestaurants(response);
        for (let i = 0; i < response.length; i++) {
          loopBusinessObjects(response[i].jsonBody.businesses, totalNumber, categoryType);
        }
      })
    }
  }).catch(e => {
    console.log(e);
  });
}

function countAllRestaurants(responseObject) {
  var totalRestaurant = 0;
  for (let i = 0; i < responseObject.length; i++) {
    totalRestaurant += responseObject[i].jsonBody.businesses.length;
  }
  return totalRestaurant;
}

function runRequest(searchRequest, client) {
  return client.search(searchRequest)
}

function loopBusinessObjects(resultObject, totalRestaurant, categoryType) {
  for (let i = 0; i < resultObject.length; i++) {
    let type = resultObject[i].categories.length === 0 ? null : resultObject[i].categories[0].title;
    var businessObject = {
      id: resultObject[i].id,
      name: resultObject[i].name,
      url: resultObject[i].url,
      reviewCount: resultObject[i].review_count,
      rating: resultObject[i].rating,
      latitude: resultObject[i].coordinates.latitude,
      longitude: resultObject[i].coordinates.longitude,
      price: resultObject[i].price,
      street: resultObject[i].location.address1,
      city: resultObject[i].location.city,
      zipCode: resultObject[i].location.zip_code,
      state: resultObject[i].location.state,
      phone: resultObject[i].phone,
      category: type
    }
    yelpObject.push(businessObject);
    if (totalRestaurant === yelpObject.length) {
      let uniqueYelpArray = _.uniqBy(yelpObject, 'id');
      debugger;
      fs.writeFile('scripts/Seattle' + categoryType + 'Directory.json', JSON.stringify(uniqueYelpArray, null, 2));
    }
  }
}