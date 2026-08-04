import app from './app.js';
import config from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${config.nodeEnv}`);
  console.log(`📅 Started: ${new Date().toISOString()}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

export default server;