import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import authModel from "../Apis/Auth/authModel";
import config from "../DefaultConfig/config";

interface DecodedToken extends JwtPayload {
    id?: string;
}

// Modify verifyToken to accept an array of allowed roles
const verifyToken = (allowedRoles: string[] = [], privet: boolean = true) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let tokenWithBearer = req.headers.authorization || req.cookies.token;

            if (!tokenWithBearer && !privet) {
                return next();
            }

            if (!tokenWithBearer) {
                res.status(403).send({ success: false, message: "Forbidden access" });
                return; // Ensure we don't return the response
            }

            let token: string;
            if (tokenWithBearer.startsWith("Bearer ")) {
                token = tokenWithBearer.split(" ")[1];
            } else {
                token = tokenWithBearer;
            }

            jwt.verify(token, config.ACCESS_TOKEN_SECRET || '', async (err, decoded) => {
                if (err) {
                    res.status(401).send({ success: false, message: "Unauthorized access" });
                    return;
                }

                const decodedToken = decoded as DecodedToken;
                const user = await authModel.findById(decodedToken?.id);

                if (!user) {
                    if (privet) {
                        res.status(404).send({ success: false, message: "User not found" });
                        return;
                    } else {
                        return next();
                    }
                }

                if (user.block) {
                    res.status(401).send({ success: false, message: "You are blocked by admin" });
                    return;
                }

                if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                    res.status(403).send({ success: false, message: "Access denied: insufficient permissions" });
                    return;
                }

                req.user = user;
                next();
            });
        } catch (error) {
            next(error); // Forward errors to the error-handling middleware
        }
    };
};


export default verifyToken;
