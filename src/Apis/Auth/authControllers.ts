import jwt from 'jsonwebtoken';
import { sendResponse } from "./../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import authModel from "./authModel";
import config, { HttpStatus } from "../../DefaultConfig/config";
import { verificationController } from "../Verification/verificationController";
import bcrypt from 'bcrypt';
import hashText from '../../utils/hashText';
import { UnlinkFiles } from '../../utils/fileUploader';
class authController {
  constructor() { }

  // send response fn

  async create(req: Request, res: Response, next: NextFunction, response: boolean = true): Promise<any> {
    const { role, isVerified, block, ...data } = req.body
    if (data?.password !== data?.confirmPassword) return sendResponse(res, HttpStatus.CONFLICT, `confirm password doesn't match`)

    req.body = { email: req?.body?.email }

    if (req?.user?.role == 'ADMIN' || req?.user?.role == 'SUPER_ADMIN') data.role = role
    // if (req.body?.role == "ADMIN") throw new Error(`you can't register as an admin`);

    const user = await authModel.findOne({ email: req.body.email, isVerified: false })

    if (user) return verificationController.create(req, res, next, true);

    const result = await authModel.create(data);

    await verificationController.create(req, res, next, false);

    return response
      ? sendResponse(
        res,
        HttpStatus.CREATED,
        {
          success: false,
          message: "account created successfully a verification mail sent to your email",
          email: result?.email
        }
      )
      : { email: result?.email };
  }

  async signIn(req: Request, res: Response, next: NextFunction, response: boolean = true) {

    const user = await authModel.findOne({ email: req?.body?.email })

    if (!user) return response
      ? sendResponse(res, HttpStatus.NOT_FOUND, { success: false, massage: `invalid credentials` })
      : user
    if (!user?.isVerified) return response
      ? sendResponse(res, HttpStatus.BAD_REQUEST, { success: false, message: `please verify your email` })
      : user

    const isMatchPass = await bcrypt.compare(req?.body?.password, user?.password);

    if (!isMatchPass) return response
      ? sendResponse(res, HttpStatus.NOT_FOUND, { success: false, message: `invalid credentials` },)
      : user

    const token = await jwt.sign(
      { email: user?.email, id: user?._id, role: user?.role },
      config.ACCESS_TOKEN_SECRET || '',
      { expiresIn: 60 * 60 * 24 * 500 }
    )
    return response
      ? sendResponse(
        res,
        HttpStatus.SUCCESS,
        {
          success: false,
          message: `login successfully`,
          email: user?.email, token
        },
        [config.TOKEN_NAME, token, 60 * 60 * 24 * 500 * 1000]
      )
      : { email: user?.email, token }

  }

  async resetPassword(req: Request, res: Response, next: NextFunction, response: boolean = true) {
    let { password, confirmPassword } = req.body

    if (password !== confirmPassword) return sendResponse(res, HttpStatus.CONFLICT, `confirm password doesn't match`)

    password = await hashText(password)

    const result = await authModel.updateOne(
      { _id: req?.user?._id },
      {
        $set: {
          password,
          accessToken: ""
        }
      }
    );

    if (result.modifiedCount == 1) {
      const token = await jwt.sign(
        { email: req?.user?.email, id: req?.user?._id, role: req?.user?.role },
        config.ACCESS_TOKEN_SECRET || '',
        { expiresIn: 60 * 60 * 24 * 500 }
      )

      sendResponse(
        res,
        HttpStatus.SUCCESS,
        {
          success: false,
          message: `password reset successfully`,
          data: { email: req?.user?.email, _id: req?.user?._id, role: req?.user?.role, name: req?.user?.name }
        },
        [config.TOKEN_NAME, token, 60 * 60 * 24 * 500 * 1000]
      )
    } else {
      sendResponse(
        res,
        HttpStatus.NOT_FOUND,
        {
          success: false,
          message: `unable to reset password`
        },
      );
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction, response: boolean = true) {
    const { password: pass, confirmPassword, oldPassword } = req.body
    const { email, _id, password } = req.user as { email: string, _id: string, password: string }

    const isMatchPass = await bcrypt.compare(oldPassword, password);

    if (!isMatchPass) return response
      ? sendResponse(res, HttpStatus.NOT_FOUND, { success: false, message: `old password doesn't match`, email, _id })
      : { email, _id }

    req.body = { password: pass, confirmPassword }
    this.resetPassword(req, res, next)
  }

  async updateProfile(req: Request, res: Response, next: NextFunction, response: boolean = true) {

    const { isVerified, role, accessToken, block, email, maidProfile, ...otherValues } = req.body
    if (maidProfile && role == 'MAID') {
      otherValues.maidProfile = JSON.parse(maidProfile)
      otherValues.role = role
    }
    const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img[0]?.path || null;

    otherValues.img = img

    const result = await authModel.updateOne(
      { _id: req?.user?._id },
      {
        $set: {
          ...otherValues
        }
      }
    );

    if (img && req.user?.img) UnlinkFiles([img])

    if (result.modifiedCount == 1) {
      sendResponse(
        res,
        HttpStatus.SUCCESS,
        {
          success: false,
          message: `profile updated successfully`,
          data: { email: req?.user?.email, _id: req?.user?._id, role: req?.user?.role, name: req?.user?.name }
        }
      )
    } else {
      sendResponse(
        res,
        HttpStatus.NOT_FOUND,
        {
          success: false,
          message: `unable to update profile`
        },
      );
    }

  }
}

// const authController = new auth()
export const authMethod = {
  create: new authController().create.bind(new authController()),
  signIn: new authController().signIn.bind(new authController()),
  resetPassword: new authController().resetPassword.bind(new authController()),
  changePassword: new authController().changePassword.bind(new authController()),
  updateProfile: new authController().updateProfile.bind(new authController()),
};
