import { Document } from "mongoose";

// auth type
export interface IAuth extends Document {
    name?: string;
    email: string;
    password: string;
    phone?: string;
    img?: string;
    role: "ADMIN" | 'SUPER_ADMIN' | 'USER';
    block: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IVerification extends Document {
    email: string,
    code: string,
    createdAt: Date;
    updatedAt: Date;
}