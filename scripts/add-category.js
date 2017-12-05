const fs = require('file-system');
const _ = require('lodash');


addCategory();

function addCategory() {
    let restaurantFile = fs.readFileSync('./scripts/SeattlerestaurantsDirectory.json');
    let foodFile = fs.readFileSync('./scripts/SeattlefoodDirectory.json');
    let oldRestaurantFile = fs.readFileSync('./SeattleYelpRestaurants.json');
    let yelpJson = _.uniqBy(_.concat(JSON.parse(restaurantFile), JSON.parse(foodFile)), 'id');
    let oldRestaurants = JSON.parse(oldRestaurantFile);
    for (let i = 0; i < oldRestaurants.length; i++) {
        let matchedIndex = _.findIndex(yelpJson, e => {
            return e.id === oldRestaurants[i].id;
        })
        oldRestaurants[i].category = matchedIndex !== -1 ? yelpJson[matchedIndex].category : null;
    }
    fs.writeFile('SeattleYelpRestaurantsWithCategory.json', JSON.stringify(oldRestaurants, null, 2));
}

