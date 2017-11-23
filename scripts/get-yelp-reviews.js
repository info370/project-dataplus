const fs = require('file-system');
const yelp = require('yelp-fusion');
const _ = require('lodash');

const clientId = '7NxVBjQ49tgV_HKdQbuPNw';
const clientSecret = 'bIrmTdzhVMFgS2PrLBtFMptgMyhHGiRslX6j3a5wOCV9RTynvJMrmfKuKiHtBMrC';

getReview();

function getReview() {
    let yelpFile = fs.readFileSync('./SeattleYelpRestaurants.json');
    let yelpJson = JSON.parse(yelpFile);
    performYelpCall(yelpJson);
}

function performYelpCall(businessObject) {
    var yelpPromises = [];
    yelp.accessToken(clientId, clientSecret).then(response => {
        var client = yelp.client(response.jsonBody.access_token);
        for (let i = 0; i < 2; i++) {
            yelpPromises.push(runRequest(businessObject[i].id, client));
        }
        if (yelpPromises.length === 2) {
            Promise.all(yelpPromises).then(response => {
                // to get review details: response[0].jsonBody.reviews
                for (let i = 0; i < response.length; i++) {
                    tallyReviews(response[i].jsonBody.reviews, businessObject[i]);
                }
            })
        }
    })
}

function runRequest(businessId, client) {
    return client.reviews(businessId);
}

function tallyReviews(reviewObject, businessObject) {
    let ratingArray = [];
    for (let i = 0; i < reviewObject.length; i++) {
        ratingArray.push(reviewObject[i].rating);
    }
    let ratingSummary = _.countBy(ratingArray);
    _.mapKeys(ratingSummary, (value, key) => {
        businessObject['total' + key + 'rating'] = value;
    })
    debugger;
}