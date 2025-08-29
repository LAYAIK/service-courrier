import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // !!! À CHANGER EN PRODUCTION !!!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Expiration du token

export  { JWT_SECRET, JWT_EXPIRES_IN };
