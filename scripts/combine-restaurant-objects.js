'use strict';

const fs = require('file-system');
const _ = require('lodash');

combineObject();

function combineObject() {
    let yelpFileOne = fs.readFileSync('./scripts/RestaurantsWithFips-1.json');
    let yelpFileTwo = fs.readFileSync('./scripts/RestaurantsWithFips-2.json');
    let yelpObjectOne = JSON.parse(yelpFileOne);
    let yelpObjectTwo = JSON.parse(yelpFileTwo);
    let completeYelpObject = _.sortBy(_.concat(yelpObjectOne,yelpObjectTwo),'id');
    fs.writeFile('SeattleYelpRestaurants.json', JSON.stringify(completeYelpObject, null, 2));
}