const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');

var newHealthInspectionArray = [];
runCrossRef();

function runCrossRef() {
    let restaurantFile = fs.readFileSync('./SeattleYelpRestaurantsWithCategory.json');
    let yelpRestaurants = JSON.parse(restaurantFile);
    fs.readFile('./Food_Inspection_Short.csv', function (err, data) {
        parse(data, { columns: true }, function (err, dataValue) {
            var healthInspectionGroup = _.groupBy(dataValue, 'Program Identifier');
            _.forEach(healthInspectionGroup, element => {
                summarizeData(element);
            });
            addHealthInspection(newHealthInspectionArray, yelpRestaurants);
        })
    })
}

function summarizeData(restaurant) {
    _.sortBy(restaurant, ['Inspection Date']);
    let totalInspection = restaurant.length;
    let earliest = new Date(restaurant[totalInspection - 1]['Inspection Date']);
    let latest = new Date(restaurant[0]['Inspection Date']);
    let timeDiff = Math.abs(latest.getTime()) - Math.abs(earliest.getTime());
    let totalMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 12));
    let sumInspectionScore = 0;
    let seatDescription = restaurant[0]['Description'].replace(/[^0-9-]/g, '');
    let maxSeat = seatDescription.substring(seatDescription.length - 3, seatDescription.length - 1);
    let maxSeatInt = parseInt(maxSeat) === NaN ? null : parseInt(maxSeat);
    for (let i = 0; i < restaurant.length; i++) {
        sumInspectionScore += parseInt(restaurant[i]['Inspection Score']);
    }
    let averageInspectionScore = sumInspectionScore / totalInspection;
    let healthInspectionObject = {
        restaurantName : restaurant[0]['Name'],
        restaurantStreet : restaurant[0]['Address'],
        restaurantCity : restaurant[0]['City'],
        restaurantZip : restaurant[0]['Zip Code'],
        restaurantPhone : restaurant[0]['Phone'].length > 0 ? '+1' + restaurant[0]['Phone'].replace(/[^0-9]/g, '')
            : null,
        recentInspectionScore : restaurant[0]['Inspection Date'],
        totalInspectionScore : sumInspectionScore,
        totalNumberOfInspections : totalInspection,
        avgInspectionScore : averageInspectionScore,
        restaurantTotalMonths : totalMonths,
        restaurantMaxSeat : maxSeatInt,
        recentHealthInspectionResult : restaurant[0]['Inspection Result'],
        recentHealthViolationType : restaurant[0]['Violation Type'],
        recentHealthInspectionGrade : parseInt(restaurant[0]['Grade']),
        recentHealthInspectionViolationPoints : parseInt(restaurant[0]['Violation Points'])
    }
    newHealthInspectionArray.push(healthInspectionObject);
}
function addHealthInspection(healthInspectionData, seattleRestaurants) {
    //var notFound = 0;
    //let notFoundIndex = [];
    debugger;
    for (let i = 0; i < seattleRestaurants.length; i++) {
        if (seattleRestaurants[i].street !== null) {
            let matchedIndex = _.findIndex(healthInspectionData, e => {
                let inspectionAddress = e.restaurantStreet.split(" ");
                let restaurantAddress = seattleRestaurants[i].street.split(" ");
                //let inspectionPhone = '+1' + e.Phone.replace(/[^0-9]/g, '');
                return inspectionAddress[0] === restaurantAddress[0]
                    && e.restaurantCity.toUpperCase() === seattleRestaurants[i].city.toUpperCase()
                    && e.restaurantZip === seattleRestaurants[i].zipCode;
                //return inspectionPhone === seattleRestaurants[i].phone;
            })
            if (matchedIndex !== -1) {
                seattleRestaurants[i].recentHealthInspectionScore = parseInt(healthInspectionData[matchedIndex].recentInspectionScore);
                seattleRestaurants[i].totalInspectionScore = healthInspectionData[matchedIndex].totalInspectionScore;
                seattleRestaurants[i].totalInspectionCount = healthInspectionData[matchedIndex].totalNumberOfInspections;
                seattleRestaurants[i].avgInspectionScore = healthInspectionData[matchedIndex].avgInspectionScore;
                seattleRestaurants[i].restaurantTotalMonths = healthInspectionData[matchedIndex].restaurantTotalMonths;
                seattleRestaurants[i].restaurantMaxSeats = healthInspectionData[matchedIndex].restaurantMaxSeat;
                seattleRestaurants[i].recentHealthInspectionResult = healthInspectionData[matchedIndex].recentHealthInspectionResult;
                seattleRestaurants[i].recentHealthViolationType = healthInspectionData[matchedIndex].recentHealthViolationType;
                seattleRestaurants[i].recentHealthInspectionViolationPoints = healthInspectionData[matchedIndex].recentHealthInspectionViolationPoints;
                seattleRestaurants[i].recentHealthInspectionGrade = healthInspectionData[matchedIndex].recentHealthInspectionGrade;
            }
            if (matchedIndex === -1) {
                seattleRestaurants[i].recentHealthInspectionScore = null;
            }
        }
    }
    debugger;

    fs.writeFile('SeattleYelpRestaurantsWithNewHealthInfo.json', JSON.stringify(seattleRestaurants, null, 2));
}