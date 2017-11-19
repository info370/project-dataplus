//const axios = require('axios');
'use strict';

var fs = require('file-system');
const yelp = require('yelp-fusion') 
var yelpObject = [];
const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';

const searchRequest = {
    latitude: 47.1508088,
    longitude: -118.3988154,
    categories: 'Restaurants',
    radius: 4000,
    limit: 50 
};

yelp.accessToken(clientId, clientSecret).then(response => {
  var client = yelp.client(response.jsonBody.access_token);
  client.search(searchRequest).then(response => {
    var result = response.jsonBody.businesses;
    debugger;
    var index = 0;
    for (index; index < result.length; index++) {
        yelpObject.push(result[index]);
        debugger;
    }
    if (index === result.length) {
        fs.writeFile('scripts/testyelp.json', JSON.stringify(yelpObject,null,2));        
    }
    debugger;
    //console.log(prettyJson);
  });
}).catch(e => {
  console.log(e);
});