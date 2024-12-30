"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    ADMIN: ['ADMIN', 'SUPER_ADMIN'],
    SUPER_ADMIN: ['SUPER_ADMIN'],
    USER: ['ADMIN', 'SUPER_ADMIN', 'USER',]
});
exports.HttpStatus = Object.freeze({
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
});
exports.default = config;
