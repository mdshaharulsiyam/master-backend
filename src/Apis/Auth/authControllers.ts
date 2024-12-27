import { sendResponse } from "./../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import authModel from "./authModel";
import { HttpStatus } from "../../DefaultConfig/config";
import { verificationController } from "../Verification/verificationController";
import { sendMail } from "../../utils/sendMail";

class authController {
  constructor() { }

  // send response fn

  async create(req: Request, res: Response, next: NextFunction, response: boolean = true): Promise<any> {
    const { role, isVerified, block, ...data } = req.body
    
    req.body = { email: req?.body?.email }

    if (req.user?.role === 'SUPER_ADMIN') data.role = role
    // if (req.body?.role == "ADMIN") throw new Error(`you can't register as an admin`);

    const user = await authModel.findOne({ email: req.body.email, isVerified: false })

    if (user) return await verificationController.create(req, res, next, true);

    const result = await authModel.create(data);

    await verificationController.create(req, res, next, false);

    return response
      ? sendResponse(
        res,
        HttpStatus.CREATED,
        "account created successfully",
        result
      )
      : result;
  }
}
// const authController = new auth()
export const authMethod = {
  create: new authController().create.bind(new authController()),
};
