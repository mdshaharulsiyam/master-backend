import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { authMethod } from './authControllers'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'

export const authRouter = express.Router()
authRouter.post('/auth/register', verifyToken(config.USER, false), asyncWrapper(authMethod.create))

