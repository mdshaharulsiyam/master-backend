"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
}));
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, 'logs', 'error.log'),
            level: 'error',
        }),
        // new winston.transports.File({
        //     filename: path.join(__dirname, 'logs', 'combined.log'),
        // }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(__dirname, 'logs', 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(__dirname, 'logs', 'rejections.log') }),
    ],
});
