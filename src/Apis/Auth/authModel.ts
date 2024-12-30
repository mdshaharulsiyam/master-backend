import { Schema, model, CallbackError } from 'mongoose';
import config from '../../DefaultConfig/config';
import hashText from '../../utils/hashText';
import { IAuth, IMaid } from '../../Types/dataTypes';

const maidSchema = new Schema<IMaid>(
    {
        age: {
            type: Number,
            required: [true, 'Age is required'],
        },
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
        },
        address: {
            type: String,
            required: [true, 'address is required'],
        },
        category: {
            type: [Schema.Types.ObjectId],
            ref: 'category'
        },
        services: {
            type: [String],
            required: [true, 'At least one service must be provided'],
        },
    },
    { _id: false }
);

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
            required: function (this: IAuth) {
                return this.provider === "CREDENTIAL";
            },
            validate: [
                {
                    validator: function (value: string) {
                        return !value || value.length <= 20;
                    },
                    message: 'Password must be at most 20 characters long',
                },
                {
                    validator: function (value: string) {
                        return !value || /[A-Z]/.test(value);
                    },
                    message: 'Password must contain at least one uppercase letter',
                },
            ],
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
        provider: {
            type: String,
            enum: ["GOOGLE", "CREDENTIAL", "FACEBOOK", "GITHUB", "APPLE"],
            default: "CREDENTIAL"
        },
        accessToken: {
            type: String,
            default: ''
        },
        maidProfile: {
            type: maidSchema,
            required: function (this: IAuth) {
                return this.role == 'MAID'
            },
            message: 'Other details are required when the role is "MAID".',
            default: null
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
