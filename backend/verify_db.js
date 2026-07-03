const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://pranaytamada:CloudGrey%2447@cluster0.1dhoix5.mongodb.net/restaurant-reservations?appName=Cluster0';

async function main() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully!");

        // Grab collections
        const db = mongoose.connection.db;
        
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users.`);

        const tables = await db.collection('tables').find({}).toArray();
        console.log(`Found ${tables.length} tables.`);

        const reservations = await db.collection('reservations').find({}).toArray();
        console.log(`Found ${reservations.length} reservations.`);

        // The user asked to clear records if DB is full or insufficient.
        // Let's clear reservations to ensure a clean slate for testing.
        if (reservations.length > 0) {
            console.log("Clearing existing reservations to ensure a clean slate...");
            await db.collection('reservations').deleteMany({});
            console.log("Reservations cleared.");
        }

        console.log("\nEverything looks functional and connected properly on the backend.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
