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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../Apis/Auth/authModel"));
const config_1 = __importDefault(require("../DefaultConfig/config"));
// Modify verifyToken to accept an array of allowed roles
const verifyToken = (allowedRoles = [], privet = true) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let tokenWithBearer = req.headers.authorization || req.cookies.token;
            if (!tokenWithBearer && !privet) {
                return next();
            }
            if (!tokenWithBearer) {
                res.status(403).send({ success: false, message: "Forbidden access" });
                return; // Ensure we don't return the response
            }
            let token;
            if (tokenWithBearer.startsWith("Bearer ")) {
                token = tokenWithBearer.split(" ")[1];
            }
            else {
                token = tokenWithBearer;
            }
            jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_TOKEN_SECRET || '', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.status(401).send({ success: false, message: "Unauthorized access" });
                    return;
                }
                const decodedToken = decoded;
                const user = yield authModel_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
                if (!user) {
                    if (privet) {
                        res.status(404).send({ success: false, message: "User not found" });
                        return;
                    }
                    else {
                        return next();
                    }
                }
                if (user.block) {
                    res.status(401).send({ success: false, message: "You are blocked by admin" });
                    return;
                }
                if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                    res.status(403).send({ success: false, message: "Access denied: insufficient permissions" });
                    return;
                }
                req.user = user;
                next();
            }));
        }
        catch (error) {
            next(error); // Forward errors to the error-handling middleware
        }
    });
};
exports.default = verifyToken;
