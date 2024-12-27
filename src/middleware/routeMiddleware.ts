import { Express } from 'express';
import express from 'express';
import { authRouter } from '../Apis/Auth/authRoute';
import path from 'path';

export const routeMiddleware = (app: Express) => {
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
    app.use(authRouter)
}