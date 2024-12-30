"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const asyncWrapper_1 = __importDefault(require("../../middleware/asyncWrapper"));
const verificationController_1 = require("./verificationController");
exports.verificationRouter = express_1.default.Router();
exports.verificationRouter
    .post('/verification/create', (0, asyncWrapper_1.default)(verificationController_1.verificationController.create))
    .post('/verification/verify', (0, asyncWrapper_1.default)(verificationController_1.verificationController.verify));
