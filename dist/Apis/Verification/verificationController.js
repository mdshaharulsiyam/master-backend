"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse_1 = require("../../utils/sendResponse");
const config_1 = require("../../DefaultConfig/config");
const verificationModel_1 = require("./verificationModel");
// import globalErrorHandler from "../../utils/globalErrorHandler";
const mongoose_1 = __importDefault(require("mongoose"));
const authModel_1 = __importDefault(require("../Auth/authModel"));
class verification {
    constructor() { }
    create(req_1, res_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (req, res, next, response = true) {
            var _a, _b, _c;
            yield verificationModel_1.verificationModel.deleteMany({ email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email });
            const result = yield verificationModel_1.verificationModel.create(Object.assign({}, req.body));
            return response
                ? (0, sendResponse_1.sendResponse)(res, config_1.HttpStatus.SUCCESS, `a verification code sent to ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.email}`, { email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email })
                : result;
        });
    }
    verify(req_1, res_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (req, res, next, response = true) {
            const session = yield mongoose_1.default.startSession();
            yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f;
                try {
                    const data = yield verificationModel_1.verificationModel.findOne({ email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email, code: (_b = req.body) === null || _b === void 0 ? void 0 : _b.code, createdAt: { $gte: new Date(Date.now() - 3 * 60 * 1000) } });
                    if (!data) {
                        return response ?
                            (0, sendResponse_1.sendResponse)(res, config_1.HttpStatus.NOT_FOUND, `verification code not found or it may expired`, data)
                            : data;
                    }
                    // accessToken
                    const token = yield jsonwebtoken_1.default.sign({
                        email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email, code: (_d = req.body) === null || _d === void 0 ? void 0 : _d.code
                    }, 'secret', { expiresIn: 60 * 60 });
                    const [result] = yield Promise.all([
                        authModel_1.default.findOneAndUpdate({ email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email }, { accessToken: token }, { new: true, session }),
                        verificationModel_1.verificationModel.deleteMany({ email: (_f = req.body) === null || _f === void 0 ? void 0 : _f.email })
                    ]);
                    yield session.commitTransaction();
                    session.endSession();
                    return response ?
                        (0, sendResponse_1.sendResponse)(res, config_1.HttpStatus.SUCCESS, "a verification mail has been sent your email", { email: result === null || result === void 0 ? void 0 : result.email, resetToken: token }, ['resetToken', token, 60 * 3 * 1000])
                        : result;
                }
                catch (error) {
                    yield session.abortTransaction();
                    yield session.endSession();
                    next(error);
                }
            }));
        });
    }
}
exports.verificationController = {
    create: new verification().create.bind(new verification()),
    verify: new verification().verify.bind(new verification())
};
