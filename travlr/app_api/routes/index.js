
const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

// GET all trips
router.get('/trips', tripsController.tripsList);

// GET one trip by code
router.get('/trips/:tripCode', tripsController.tripsFindByCode);

// POST a new trip
router.post('/trips', tripsController.tripsAdd);

module.exports = router;
