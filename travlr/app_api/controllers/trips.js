
const mongoose = require('mongoose');

const Trip = mongoose.model('trips');

// GET: Retrieve all trips
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

// GET: Retrieve one trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            code: req.params.tripCode
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

// POST: Add a new trip
const tripsAdd = async (req, res) => {
    try {
        const {
            code, name, length, start,
            resort, perPerson, image, description
        } = req.body;

        const existingTrip = await Trip.findOne({ code }).exec();

        if (existingTrip) {
            return res.status(409).json({
                message: 'A trip with this code already exists.'
            });
        }

        const newTrip = await Trip.create({
            code, name, length, start,
            resort, perPerson, image, description
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

// PUT: Update an existing trip by code
const tripsUpdateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        ).exec();

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        return res.status(200).json(trip);

    } catch (err) {
        console.error('Error updating trip:', err);

        if (err.name === 'ValidationError' ||
            err.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid trip information.',
                details: err.message
            });
        }

        return res.status(500).json({
            message: 'Error updating trip in database'
        });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAdd,
    tripsUpdateTrip
};
