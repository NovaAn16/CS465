
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import the Trip model
const Trip = require('./travlr');

// MongoDB connection settings
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

// Locate and load the JSON trip data
const dataPath = path.join(__dirname, '../../data/trips.json');

async function seedDatabase() {
    try {
        // Read JSON data
        const trips = JSON.parse(
            fs.readFileSync(dataPath, 'utf8')
        );

        if (!Array.isArray(trips) || trips.length === 0) {
            throw new Error('trips.json must contain a nonempty array.');
        }

        console.log(`Loaded ${trips.length} trips from JSON.`);

        // Validate trips before replacing existing data
        for (const trip of trips) {
            const document = new Trip(trip);
            await document.validate();
        }

        // Connect to MongoDB
        await mongoose.connect(dbURI);
        console.log(`Mongoose connected to ${dbURI}`);

        // Remove existing trip records
        await Trip.deleteMany({});
        console.log('Existing trips removed.');

        // Insert the JSON records
        const insertedTrips = await Trip.insertMany(trips);
        console.log(`${insertedTrips.length} trips inserted successfully.`);

        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Database seeding failed:', error);
        process.exitCode = 1;
    } finally {
        // Close the MongoDB connection
        await mongoose.disconnect();
        console.log('Mongoose disconnected');
    }
}

// Run the seeding process
seedDatabase();
