import { Request, Response, NextFunction } from "express";
export class CustomError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleDevError = (res: Response, error: any): void => {
    res.status(error.statusCode).send({
        success: false,
        message: error.message,
        error: error
    });
};

const handleCastError = (err: any): CustomError => {
    const message = `Invalid value for ${err.path}: ${err.value}!`;
    return new CustomError(message, 400);
};

// Duplicate key error handler
const handleDuplicateKeyError = (err: any, model: string): CustomError => {
    let message = "";
    Object.keys(err?.keyValue)?.forEach(key => {
        message += `${message ? `${message} & ` : ''}There is already a ${model} with ${key} "${err?.keyValue[key]}". Please use another ${key}!`;
    });
    return new CustomError(message, 400);
};

// Validation error handler
const handleValidationError = (err: any): CustomError => {
    const errors = Object.values(err.errors).map((val: any) => val.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new CustomError(message, 400);
};

const handleProdError = (res: Response, error: any): void => {
    if (error.isOperational) {
        res.status(error.statusCode).send({
            success: false,
            message: error.message
        });
    } else {
        console.error('ERROR 💥:', error);
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || 'Something went wrong! Please try again later.'
        });
    }
};
// const handleUnknownError = (res: Response, error: any): void => {
//     res.status(error.statusCode).send({
//         success: false,
//         message: error.message
//     });

// };
const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction, model?: string): void => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    // console.log(error)
    if (process.env.NODE_ENV === 'development') {
        if (error.name === 'CastError') error = handleCastError(error);
        if (error.code === 11000) error = handleDuplicateKeyError(error, model || 'Resource');
        if (error.name === 'ValidationError') error = handleValidationError(error);
        handleDevError(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = handleCastError(error);
        if (error.code === 11000) error = handleDuplicateKeyError(error, model || 'Resource');
        if (error.name === 'ValidationError') error = handleValidationError(error);
        console.log(error)
        handleProdError(res, error);
    }
};

export default globalErrorHandler;
