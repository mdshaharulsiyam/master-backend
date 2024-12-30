import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { sendResponse } from "../../utils/sendResponse";
import config, { HttpStatus } from "../../DefaultConfig/config";
import { verificationModel } from "./verificationModel";
// import globalErrorHandler from "../../utils/globalErrorHandler";
import mongoose from "mongoose";
import authModel from "../Auth/authModel";

class verification {
    constructor() { }

    async create(req: Request, res: Response, next: NextFunction, response: boolean = true) {
        if (response) {
            const user = await authModel.findOne({ email: req.body?.email })

            if (!user) return sendResponse(
                res,
                HttpStatus.NOT_FOUND,
                {
                    success: false, message: `user not found`,
                    data: { email: req.body?.email }
                }
            )
        }

        const result = await verificationModel.findOneAndUpdate({ email: req.body?.email }, { ...req.body }, { new: true, upsert: true })

        return response
            ? sendResponse(
                res,
                HttpStatus.SUCCESS,
                {
                    success: false,
                    message: `a verification code sent to ${req.body?.email}`,
                    data: {
                        email: req.body?.email
                    }
                }
            )
            : result
    }

    async verify(req: Request, res: Response, next: NextFunction, response: boolean = true) {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

            try {
                const data = await verificationModel.findOne({ email: req.body?.email, code: req.body?.code, updatedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } })
                if (!data) {
                    return response ?
                        sendResponse(res, HttpStatus.NOT_FOUND, { success: false, message: `verification code not found or it may expired`, data })
                        : data
                }
                // accessToken
                const accessToken = await jwt.sign({
                    email: req.body?.email, code: req.body?.code
                }, config.ACCESS_TOKEN_SECRET || '', { expiresIn: 5 * 60 });


                const [result] = await Promise.all([
                    authModel.findOneAndUpdate({ email: req.body?.email }, { accessToken: accessToken, isVerified: true }, { new: true, session }),
                    verificationModel.deleteMany({ email: req.body?.email })
                ])

                await session.commitTransaction();
                session.endSession();



                const token = await jwt.sign(
                    { email: result?.email, id: result?._id, role: result?.role },
                    config.ACCESS_TOKEN_SECRET || '',
                    { expiresIn: 60 * 60 * 24 * 500 }
                )

                return response ?
                    sendResponse(
                        res,
                        HttpStatus.SUCCESS,
                        {
                            success: false,
                            message: "a verification mail has been sent your email",
                            data: { email: result?.email, resetToken: accessToken, token: token }
                        },
                        [config?.ACCESS_TOKEN_NAME, accessToken, 60 * 3 * 1000])
                    : result

            } catch (error) {
                await session.abortTransaction()
                await session.endSession()
                next(error)
            }
        })
    }

}
export const verificationController = {
    create: new verification().create.bind(new verification()),
    verify: new verification().verify.bind(new verification())
};
