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
        await sendMail.sendVerificationMail(this.email, 'email verification code', 'user', this.code);
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

export const verificationModel = model<IVerification>('verification', verificationSchema)