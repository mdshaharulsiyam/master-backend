import { Schema, model, CallbackError } from 'mongoose';
import config from '../../DefaultConfig/config';
import hashText from '../../utils/hashText';
import { IAuth } from '../../Types/dataTypes';

// Create the Auth schema
const authSchema = new Schema<IAuth>(
    {
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
            enum: config.USER,
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
    },
    {
        timestamps: true,
    }
);
authSchema.pre('save', async function (next) {
    if (this && this.isModified('password')) {
        try {
            this.password = await hashText(this.password)
        } catch (error) {
            return next(error as CallbackError)
        }
    }
    next();
})
// Create the Auth model
const authModel = model<IAuth>('auth', authSchema);


export default authModel;
