import { Document, Types } from "mongoose";
// maid 
export interface IMaid {
    age: number;
    experience: number;
    category: [Types.ObjectId];
    address?: string | null;
    services: string[];
}
// auth type
export interface IAuth extends Document {
    name?: string;
    email: string;
    password: string;
    phone?: string;
    img?: string;
    role: "ADMIN" | 'SUPER_ADMIN' | "MAID" | 'USER';
    block: boolean;
    provider: "GOOGLE" | "CREDENTIAL" | "FACEBOOK" | "GITHUB" | "APPLE"
    isVerified: boolean;
    accessToken: string;
    createdAt: Date;
    updatedAt: Date;
    maidProfile: IMaid
}
// verification code 
export interface IVerification extends Document {
    email: string,
    code: string,
    createdAt: Date;
    updatedAt: Date;
}
