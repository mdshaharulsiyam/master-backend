"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const handleDevError = (res, error) => {
    res.status(error.statusCode).send({
        success: false,
        message: error.message,
        error: error
    });
};
const handleCastError = (err) => {
    const message = `Invalid value for ${err.path}: ${err.value}!`;
    return new CustomError(message, 400);
};
// Duplicate key error handler
const handleDuplicateKeyError = (err, model) => {
    var _a;
    let message = "";
    (_a = Object.keys(err === null || err === void 0 ? void 0 : err.keyValue)) === null || _a === void 0 ? void 0 : _a.forEach(key => {
        message += `${message ? `${message} & ` : ''}There is already a ${model} with ${key} "${err === null || err === void 0 ? void 0 : err.keyValue[key]}". Please use another ${key}!`;
    });
    return new CustomError(message, 400);
};
// Validation error handler
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new CustomError(message, 400);
};
const handleProdError = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).send({
            success: false,
            message: error.message
        });
    }
    else {
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
const globalErrorHandler = (error, req, res, next, model) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    // console.log(error)
    if (process.env.NODE_ENV === 'development') {
        if (error.name === 'CastError')
            error = handleCastError(error);
        if (error.code === 11000)
            error = handleDuplicateKeyError(error, model || 'Resource');
        if (error.name === 'ValidationError')
            error = handleValidationError(error);
        handleDevError(res, error);
    }
    else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError')
            error = handleCastError(error);
        if (error.code === 11000)
            error = handleDuplicateKeyError(error, model || 'Resource');
        if (error.name === 'ValidationError')
            error = handleValidationError(error);
        console.log(error);
        handleProdError(res, error);
    }
};
exports.default = globalErrorHandler;
