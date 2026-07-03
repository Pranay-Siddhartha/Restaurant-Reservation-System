const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://pranaytamada:CloudGrey%2447@cluster0.1dhoix5.mongodb.net/restaurant-reservations?appName=Cluster0';

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;

        console.log("Seeding tables...");
        await db.collection('tables').deleteMany({});
        await db.collection('tables').insertMany([
            { tableNumber: 1, capacity: 2, isActive: true, __v: 0 },
            { tableNumber: 2, capacity: 4, isActive: true, __v: 0 },
            { tableNumber: 3, capacity: 6, isActive: true, __v: 0 }
        ]);

        console.log("Tables seeded successfully.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
