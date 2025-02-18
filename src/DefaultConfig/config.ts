import dotenv from 'dotenv';
dotenv.config();

const config = Object.freeze({
  PORT: process.env.PORT || 5000,
  IP: process.env.IP || 'localhost',
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || ['http://localhost:5000', 'http://localhost:5000'],
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_EMAIL: process.env.MAIL_EMAIL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SRTIPE_KEY: process.env.SRTIPE_KEY,
  DB_NAME: process.env.DB_NAME,
  TOKEN_NAME: process.env.TOKEN_NAME || '',
  ACCESS_TOKEN_NAME: process.env.ACCESS_TOKEN_NAME || '',
  ADMIN: ['ADMIN', 'SUPER_ADMIN'],
  SUPER_ADMIN: ['SUPER_ADMIN'],
  MAID: ['ADMIN', 'SUPER_ADMIN', "MAID"],
  USER: ['ADMIN', 'SUPER_ADMIN', "MAID", 'USER']
});

export const HttpStatus = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
})

export default config;
