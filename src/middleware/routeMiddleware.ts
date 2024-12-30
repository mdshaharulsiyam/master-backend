import { Express } from 'express';
import express from 'express';
import path from 'path';
import { authRouter } from '../Apis/Auth/authRoute';
import { verificationRouter } from '../Apis/Verification/verificationRoute';


export const routeMiddleware = (app: Express) => {
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
    app.use(authRouter)
    app.use(verificationRouter)
}