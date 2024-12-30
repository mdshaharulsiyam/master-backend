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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMethod = void 0;
const sendResponse_1 = require("./../../utils/sendResponse");
const authModel_1 = __importDefault(require("./authModel"));
const config_1 = require("../../DefaultConfig/config");
const verificationController_1 = require("../Verification/verificationController");
class authController {
    constructor() { }
    // send response fn
    create(req_1, res_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (req, res, next, response = true) {
            var _a, _b;
            const _c = req.body, { role, isVerified, block } = _c, data = __rest(_c, ["role", "isVerified", "block"]);
            req.body = { email: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email };
            if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'SUPER_ADMIN')
                data.role = role;
            // if (req.body?.role == "ADMIN") throw new Error(`you can't register as an admin`);
            const user = yield authModel_1.default.findOne({ email: req.body.email, isVerified: false });
            if (user)
                return yield verificationController_1.verificationController.create(req, res, next, true);
            const result = yield authModel_1.default.create(data);
            yield verificationController_1.verificationController.create(req, res, next, false);
            return response
                ? (0, sendResponse_1.sendResponse)(res, config_1.HttpStatus.CREATED, "account created successfully", { email: result === null || result === void 0 ? void 0 : result.email, _id: result === null || result === void 0 ? void 0 : result._id, name: result === null || result === void 0 ? void 0 : result.name, role: result === null || result === void 0 ? void 0 : result.role })
                : { email: result === null || result === void 0 ? void 0 : result.email, _id: result === null || result === void 0 ? void 0 : result._id, name: result === null || result === void 0 ? void 0 : result.name, role: result === null || result === void 0 ? void 0 : result.role };
        });
    }
}
// const authController = new auth()
exports.authMethod = {
    create: new authController().create.bind(new authController()),
};
