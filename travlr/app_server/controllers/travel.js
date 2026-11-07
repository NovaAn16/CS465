
/* GET travel view */

// Load the Node.js filesystem module
var fs = require('fs');

// Read trip data from the JSON file
var trips = JSON.parse(
    fs.readFileSync('./data/trips.json', 'utf8')
);

// Travel page controller
const travel = (req, res) => {
    res.render('travel', {
        title: 'Travlr Getaways',
        trips: trips,
        layout: false
    });
};

// Export the controller
module.exports = {
    travel
};
