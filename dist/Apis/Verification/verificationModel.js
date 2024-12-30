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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationModel = void 0;
const mongoose_1 = require("mongoose");
const sendMail_1 = require("../../utils/sendMail");
const verificationSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    code: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10100
    }
}, { timestamps: true });
verificationSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            this.code = Math.round(100000 + Math.random() * 900000).toString();
            yield sendMail_1.sendMail.sendVerificationMail(this.email, 'email verification code', 'user', this.code);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
exports.verificationModel = (0, mongoose_1.model)('verification', verificationSchema);
