require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');

/**
 * Start the server after establishing a database connection.
 */
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });

  // ── Handle unhandled promise rejections ──────────────────────────
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // ── Handle uncaught exceptions ───────────────────────────────────
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
