import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

// Access environment variables
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mydb';
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'JWT_ACCESS_TOKEN_SECRET';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'JWT_ACCESS_TOKEN_SECRET';
const COOKIE_PARSER_SECRET = process.env.COOKIE_PARSER_SECRET || 'COOKIE_PARSER_SECRET';
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const CLIENT_URL = 'http://localhost:3000';
const ENVIRONMENT = process.env.ENVIRONMENT || 'DEVELOPMENT';
const BASE_DOMAIN  =process.env.BASE_DOMAIN || 'localhost';

export{
    SERVER_PORT,
    DB_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    COOKIE_PARSER_SECRET,
    SOCKET_PORT,
    CLIENT_URL,
    ENVIRONMENT,
    BASE_DOMAIN
}