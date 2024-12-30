"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, message, data, token) => {
    token && (token === null || token === void 0 ? void 0 : token.length) > 1 ?
        res.cookie(token[0], token[1], {
            maxAge: token[2] || 60 * 60 * 24 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: false
        }).status(status).json({
            status,
            message,
            data: data ? Object.assign({}, data) : null,
        })
        :
            res.status(status).json({
                status,
                message,
                data: data ? Object.assign({}, data) : null,
            });
};
exports.sendResponse = sendResponse;
