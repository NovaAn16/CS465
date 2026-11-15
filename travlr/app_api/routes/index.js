
const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

// GET all trips from MongoDB
router.get('/trips', tripsController.tripsList);

// GET one trip by trip code
router.get('/trips/:tripCode', tripsController.tripsFindByCode);

// POST a new trip to MongoDB
router.post('/trips', tripsController.tripsAdd);

// PUT: Update an existing trip in MongoDB
router.put('/trips/:tripCode', tripsController.tripsUpdateTrip);

module.exports = router;
