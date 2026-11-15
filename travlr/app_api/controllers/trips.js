
const mongoose = require('mongoose');

// Use the existing Mongoose Trip model
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

// GET: Return one trip by its code
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

// POST: Add a new trip to MongoDB
const tripsAdd = async (req, res) => {
    try {
        const {
            code,
            name,
            length,
            start,
            resort,
            perPerson,
            image,
            description
        } = req.body;

        // Check that this trip code is not already in use
        const existingTrip = await Trip.findOne({ code }).exec();

        if (existingTrip) {
            return res.status(409).json({
                message: 'A trip with this code already exists.'
            });
        }

        // Create and save the new trip
        const newTrip = await Trip.create({
            code,
            name,
            length,
            start,
            resort,
            perPerson,
            image,
            description
        });

        return res.status(201).json(newTrip);

    } catch (err) {
        console.error('Error adding trip:', err);

        if (err.name === 'ValidationError' ||
            err.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid or missing trip information.',
                details: err.message
            });
        }

        return res.status(500).json({
            message: 'Error adding trip to database'
        });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAdd
};
