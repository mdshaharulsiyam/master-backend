import { IAuth } from "./src/Types/dataTypes";

declare global {
    namespace Express {
        interface Request {
            user?: IAuth;
        }
    }
}