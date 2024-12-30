import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { verificationController } from './verificationController';

export const verificationRouter = express.Router()

verificationRouter
    .post('/verification/create', asyncWrapper(verificationController.create))
    .post('/verification/verify',asyncWrapper(verificationController.verify))
