import { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { verificationModel } from "./verificationModel";
class verification {
    constructor() { }

    async create(req: Request, res: Response, next: NextFunction, response: boolean = true) {
        
        await verificationModel.deleteMany({ email: req.body?.email })

        const result = await verificationModel.create({ ...req.body })

        return response
            ? sendResponse(
                res,
                HttpStatus.SUCCESS,
                `a verification code sent to ${req.body?.email}`,
                { email: req.body?.email }
            )
            : result
    }
}
export const verificationController = {
    create: new verification().create.bind(new verification())
};
