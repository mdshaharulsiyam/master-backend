import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { authMethod } from './authControllers'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'
import uploadFile from '../../utils/fileUploader'

export const authRouter = express.Router()
authRouter
    .post('/auth/register', verifyToken(config.USER, false), asyncWrapper(authMethod.create))

    .post('/auth/login', asyncWrapper(authMethod.signIn))

    .post('/auth/reset-password', verifyToken(config.USER, true, config.ACCESS_TOKEN_NAME), asyncWrapper(authMethod.resetPassword))

    .post('/auth/change-password', verifyToken(config.USER), asyncWrapper(authMethod.changePassword))

    .patch('/auth/update-profile',uploadFile(), verifyToken(config.USER), asyncWrapper(authMethod.updateProfile))

