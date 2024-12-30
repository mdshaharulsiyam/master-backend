"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const authRoute_1 = require("../Apis/Auth/authRoute");
const verificationRoute_1 = require("../Apis/Verification/verificationRoute");
const routeMiddleware = (app) => {
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
    app.use(authRoute_1.authRouter);
    app.use(verificationRoute_1.verificationRouter);
};
exports.routeMiddleware = routeMiddleware;
