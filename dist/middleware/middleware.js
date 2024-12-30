"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../DefaultConfig/config"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100, //limit: 100,
    handler: (req, res) => {
        // console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send({ success: false, message: "Too many requests" });
    },
});
// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, 
//     max: 5, 
//     message: "Too many login attempts. Please try again later.",
// });
const middleware = (app) => {
    // body parser 
    // app.use(urlencoded({ extended: true }))
    app.use(express_1.default.json());
    // cookie parser
    app.use((0, cookie_parser_1.default)());
    app.use(limiter);
    // cors setup 
    app.use((0, cors_1.default)({
        // origin: (origin, callback) => {
        //     console.log(config?.ALLOWED_ORIGIN,origin)
        //     config?.ALLOWED_ORIGIN?.includes(origin || "") ? callback(null, true) : callback(new Error('origin not allowed'))
        // },
        origin: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.ALLOWED_ORIGIN,
        optionsSuccessStatus: 200,
        credentials: true
    }));
};
exports.default = middleware;
