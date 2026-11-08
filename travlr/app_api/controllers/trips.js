
const mongoose = require('mongoose');

// Import the registered Trip model
const Trip = mongoose.model('trips');

// GET: Return all trips from MongoDB
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();

        if (!trips || trips.length === 0) {
            return res.status(404).json({
                message: 'No trips found'
            });
        }

        return res.status(200).json(trips);

    } catch (err) {
        console.error('Error retrieving trips:', err);

        return res.status(500).json({
            message: 'Error retrieving trips from database'
        });
    }
};

// GET: Return one trip using its trip code
const tripsFindByCode = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;

        const trip = await Trip.findOne({
            code: tripCode
        }).exec();

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        return res.status(200).json(trip);

    } catch (err) {
        console.error('Error retrieving trip:', err);

        return res.status(500).json({
            message: 'Error retrieving trip from database'
        });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};
