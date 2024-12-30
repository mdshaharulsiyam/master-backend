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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../DefaultConfig/config"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.MAIL_EMAIL,
                pass: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.MAIL_PASSWORD,
            },
        });
    }
    sendMail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error('Error sending email:', error);
            }
        });
    }
    sendVerificationMail(receiver, subject, name, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.MAIL_EMAIL) || '',
                to: receiver,
                subject: subject,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
                    <p>Dear ${name || 'User'},</p>
                    <p>Thank you for signing up! To verify your email address, please use the following verification code:</p>
                    <div style="font-size: 20px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">${code}</div>
                    <p>If you did not request this, please ignore this email.</p>
                    <p style="margin-top: 30px;">Best Regards,</p>
                    <p>The AfroFest Team</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact us at <a href="mailto:support@afrofest.com" style="color: #4CAF50; text-decoration: none;">support@afrofest.com</a>.</p>
                </div>
            `
            };
            return this.sendMail(mailOptions);
        });
    }
    sendAccountCreationMail(receiver, subject, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.MAIL_EMAIL) || '',
                to: receiver,
                subject: subject,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #4CAF50; text-align: center;">Welcome to AfroFest</h2>
                    <p>Dear ${name || 'User'},</p>
                    <p>Thank you for creating an account with AfroFest! We’re excited to have you on board.</p>
                    <p>You can now explore our vibrant community and events tailored for Afro-centric celebrations.</p>
                    <p style="margin-top: 30px;">Best Regards,</p>
                    <p>The AfroFest Team</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact us at <a href="mailto:support@afrofest.com" style="color: #4CAF50; text-decoration: none;">support@afrofest.com</a>.</p>
                </div>
            `
            };
            return this.sendMail(mailOptions);
        });
    }
    sendPasswordChangeMail(receiver, subject, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.MAIL_EMAIL) || '',
                to: receiver,
                subject: subject,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #4CAF50; text-align: center;">Password Changed Successfully</h2>
                    <p>Dear ${name || 'User'},</p>
                    <p>Your password has been successfully changed. If you did not make this change, please contact our support team immediately.</p>
                    <p>To ensure the security of your account, we recommend regularly updating your password and keeping it confidential.</p>
                    <p style="margin-top: 30px;">Best Regards,</p>
                    <p>The AfroFest Team</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact us at <a href="mailto:support@afrofest.com" style="color: #4CAF50; text-decoration: none;">support@afrofest.com</a>.</p>
                </div>
            `
            };
            return this.sendMail(mailOptions);
        });
    }
}
exports.sendMail = {
    sendVerificationMail: new MailService().sendVerificationMail.bind(new MailService())
};
