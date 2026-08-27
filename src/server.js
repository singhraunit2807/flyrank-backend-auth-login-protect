require('dotenv').config();

const app = require('./app');
const { port } = require('./config');

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Connected to Supabase client configuration.');
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
