"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const asyncWrapper_1 = __importDefault(require("../../middleware/asyncWrapper"));
const authControllers_1 = require("./authControllers");
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const config_1 = __importDefault(require("../../DefaultConfig/config"));
exports.authRouter = express_1.default.Router();
exports.authRouter
    .post('/auth/register', (0, verifyToken_1.default)(config_1.default.USER, false), (0, asyncWrapper_1.default)(authControllers_1.authMethod.create));
