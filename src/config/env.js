import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dlgccp',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    path: process.env.UPLOAD_PATH || './uploads',
  },
  
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },
  
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
  },
};

export default config;