
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authenticationController = require('../controllers/authentication');

// Verify a JWT supplied in the Authorization header
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization token required.'
        });
    }

    const parts = authHeader.split(' ');

    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer' ||
        !parts[1]
    ) {
        return res.status(401).json({
            message: 'Invalid Authorization header.'
        });
    }

    const token = parts[1];

    try {
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        req.auth = verified;

        return next();

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired authentication token.'
        });
    }
}

// Public: GET all trips
router.get('/trips', tripsController.tripsList);

// Public: GET one trip by code
router.get(
    '/trips/:tripCode',
    tripsController.tripsFindByCode
);

// Protected: POST a new trip
router.post(
    '/trips',
    authenticateJWT,
    tripsController.tripsAdd
);

// Protected: PUT update an existing trip
router.put(
    '/trips/:tripCode',
    authenticateJWT,
    tripsController.tripsUpdateTrip
);

// Public: Register an account
router.post(
    '/register',
    authenticationController.register
);

// Public: Log in
router.post(
    '/login',
    authenticationController.login
);

module.exports = router;
