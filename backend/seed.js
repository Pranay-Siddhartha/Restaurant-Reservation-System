require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Table = require('./src/models/Table');
const Reservation = require('./src/models/Reservation');
const { MONGODB_URI } = require('./src/config/env');

/**
 * Seed the database with initial data:
 * - 1 admin user
 * - 1 sample customer
 * - 10 restaurant tables
 * - 3 sample reservations for the customer on future dates
 */
const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // ── Clear existing data ────────────────────────────────────────
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Cleared existing data.');

    // ── Create admin user ──────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);

    // ── Create sample customer ─────────────────────────────────────
    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Customer@123',
      role: 'customer',
    });
    console.log(`Customer created: ${customer.email}`);

    // ── Create 10 tables ───────────────────────────────────────────
    const tableCapacities = [2, 2, 2, 4, 4, 4, 6, 6, 8, 10];
    const tables = [];

    for (let i = 0; i < tableCapacities.length; i++) {
      const table = await Table.create({
        tableNumber: i + 1,
        capacity: tableCapacities[i],
        isActive: true,
      });
      tables.push(table);
    }
    console.log(`Created ${tables.length} tables.`);

    // ── Create sample reservations on future dates ─────────────────
    const today = new Date();

    // Reservation 1: tomorrow, table for 2
    const date1 = new Date(today);
    date1.setUTCDate(date1.getUTCDate() + 1);
    date1.setUTCHours(0, 0, 0, 0);

    const res1 = await Reservation.create({
      customer: customer._id,
      table: tables[0]._id, // Table 1 (capacity 2)
      reservationDate: date1,
      startTime: '18:00',
      endTime: '20:00',
      guestCount: 2,
      status: 'confirmed',
    });

    // Reservation 2: day after tomorrow, table for 4
    const date2 = new Date(today);
    date2.setUTCDate(date2.getUTCDate() + 2);
    date2.setUTCHours(0, 0, 0, 0);

    const res2 = await Reservation.create({
      customer: customer._id,
      table: tables[3]._id, // Table 4 (capacity 4)
      reservationDate: date2,
      startTime: '19:00',
      endTime: '21:00',
      guestCount: 3,
      status: 'confirmed',
    });

    // Reservation 3: 3 days from now, table for 6
    const date3 = new Date(today);
    date3.setUTCDate(date3.getUTCDate() + 3);
    date3.setUTCHours(0, 0, 0, 0);

    const res3 = await Reservation.create({
      customer: customer._id,
      table: tables[6]._id, // Table 7 (capacity 6)
      reservationDate: date3,
      startTime: '12:00',
      endTime: '14:00',
      guestCount: 5,
      status: 'confirmed',
    });

    console.log(`Created 3 sample reservations.`);

    // ── Summary ────────────────────────────────────────────────────
    console.log('\n─── Seed Summary ───');
    console.log(`Users:        2 (admin + customer)`);
    console.log(`Tables:       ${tables.length}`);
    console.log(`Reservations: 3`);
    console.log('\nCredentials:');
    console.log(`  Admin    → admin@example.com / Admin@123`);
    console.log(`  Customer → john@example.com  / Customer@123`);
    console.log('─────────────────────\n');

    await mongoose.disconnect();
    console.log('Database seeded and disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
