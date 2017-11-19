const converter = require('./location-converter');

function testing() {
    var test = converter.getTract(-76.92691, 38.846542);
    
    console.log(test);
    if (test !== undefined) {
        debugger;
    }
}
testing();
