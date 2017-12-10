const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');


runCrossRef();

function runCrossRef() {
    let restaurantFile = fs.readFileSync('./SeattleYelpRestaurantsWithCategory.json');
    let restaurants = JSON.parse(restaurantFile);
    fs.readFile('./Food_Inspection_Short.csv', function (err, data) {
        parse(data, { columns: true }, function (err, dataValue) {
            addHealthInspection(_.uniqBy(dataValue, 'Address'), restaurants);
        })
    })
}

function addHealthInspection(healthInspectionData, seattleRestaurants) {
    //var notFound = 0;
    //let notFoundIndex = [];
    for (let i = 0; i < seattleRestaurants.length; i++) {
        if (seattleRestaurants[i].street !== null) {
            let matchedIndex = _.findIndex(healthInspectionData, e => {
                let inspectionAddress = e.Address.split(" ");
                let restaurantAddress = seattleRestaurants[i].street.split(" ");
                //let inspectionPhone = '+1' + e.Phone.replace(/[^0-9]/g, '');
                return inspectionAddress[0] === restaurantAddress[0]
                    && e.City.toUpperCase() === seattleRestaurants[i].city.toUpperCase()
                    && e['Zip Code'] === seattleRestaurants[i].zipCode;
                //return inspectionPhone === seattleRestaurants[i].phone;
            })
            if (matchedIndex !== -1) {
                seattleRestaurants[i].healthInspectionScore = parseInt(healthInspectionData[matchedIndex]['Inspection Score']);
                seattleRestaurants[i].healthInspectionResult = healthInspectionData[matchedIndex]['Inspection Result'];
                seattleRestaurants[i].healthViolationType = healthInspectionData[matchedIndex]['Violation Type'];
                seattleRestaurants[i].healthViolationPoints = parseInt(healthInspectionData[matchedIndex]['Violation Points']);
                seattleRestaurants[i].healthInspectionGrade = parseInt(healthInspectionData[matchedIndex]['Grade']);
            }
            if (matchedIndex === -1) {
                seattleRestaurants[i].healthInspectionScore = null;
            }
        }
    }
    debugger;
    // for(let i = 0;i < notFoundIndex.length; i++) {
    //     let retryMatch = _.findIndex(healthInspectionData, e => {
    //         //let inspectionAddressB = e.Address.split(" ");
    //         //let restaurantAddressB = seattleRestaurants[notFoundIndex[i]].street.split(" ");
    //         let inspectionRestName = e.Name.toUpperCase();
    //         let inspectionPhone = '+1' + e.Phone.replace(/[^0-9]/g, '');
    //         return inspectionRestName.indexOf(seattleRestaurants[notFoundIndex[i]].name.toUpperCase()) >= 0
    //         && inspectionPhone === seattleRestaurants[notFoundIndex[i]].phone;
    //     })
    //     if (retryMatch === -1) {
    //         notFound++;
    //     }
    // }
    
    fs.writeFile('SeattleYelpRestaurantsWithHealth.json', JSON.stringify(seattleRestaurants, null, 2));
}