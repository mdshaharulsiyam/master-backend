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
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../DefaultConfig/config"));
const hashText_1 = __importDefault(require("../../utils/hashText"));
// Create the Auth schema
const authSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, ' name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: false,
        default: null
    },
    img: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: [true, 'password required'],
    },
    role: {
        type: String,
        enum: config_1.default.USER,
        default: 'USER',
    },
    block: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        enum: ["GOOGLE", "CREDENTIAL", "FACEBOOK", "GITHUB"],
        default: "CREDENTIAL"
    },
    accessToken: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
});
authSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this && this.isModified('password')) {
            try {
                this.password = yield (0, hashText_1.default)(this.password);
            }
            catch (error) {
                return next(error);
            }
        }
        next();
    });
});
// Create the Auth model
const authModel = (0, mongoose_1.model)('auth', authSchema);
exports.default = authModel;
