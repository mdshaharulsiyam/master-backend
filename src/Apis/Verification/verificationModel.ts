import { CallbackError, model, Schema } from "mongoose";
import { IVerification } from "../../Types/dataTypes";
import { sendMail } from "../../utils/sendMail";

const verificationSchema = new Schema<IVerification>({
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

verificationSchema.pre('save', async function (next) {
    try {
        this.code = Math.round(100000 + Math.random() * 900000).toString();
        sendMail.sendVerificationMail(this.email, 'email verification code', 'user', this.code);
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});
verificationSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate() as { email: string, code?: string };
        update.code = Math.round(100000 + Math.random() * 900000).toString();
        sendMail.sendVerificationMail(update.email, 'email verification code', 'user', update.code);
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});


export const verificationModel = model<IVerification>('verification', verificationSchema)