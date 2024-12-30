"use strict";
// import multer, { StorageEngine } from 'multer';
// import path from 'path';
// import { Request, Response, NextFunction } from 'express';
// import fs from 'fs';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const UnlinkFiles = (files: string[]) => {
//     files.forEach((filePath) => {
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error(`Error deleting file: ${filePath}`, err);
//             }
//         });
//     });
// };
// const uploadFile = () => {
//     const storage: StorageEngine = multer.diskStorage({
//         destination: function (req, file, cb) {
//             try {
//                 // Determine the folder based on the field name
//                 const uploadPath = path.join('uploads', file.fieldname);
//                 if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//                     cb(null, uploadPath);
//                 } else {
//                     cb(new Error('Invalid file type'), '');
//                 }
//             } catch (error) {
//                 cb(error as Error, '');
//             }
//         },
//         filename: function (req, file, cb) {
//             const name = Date.now() + '-' + file.originalname;
//             cb(null, name);
//         },
//     });
//     const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//         const allowedFilenames = ['img', 'video', 'logo'];
//         if (allowedFilenames.includes(file.fieldname)) {
//             if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//                 cb(null, true);
//             } else {
//                 cb(new Error('Invalid file type'));
//             }
//         } else {
//             cb(new Error('Invalid field name'));
//         }
//     };
//     const maxVideoLength = 20; // Maximum video size in MB
//     const upload = multer({
//         storage: storage,
//         fileFilter: fileFilter,
//     }).fields([
//         { name: 'img', maxCount: 4 },
//         { name: 'video', maxCount: 1 },
//         { name: 'logo', maxCount: 1 },
//     ]);
//     return (req: Request, res: Response, next: NextFunction) => {
//         upload(req, res, async function (err) {
//             if (err) {
//                 return res.status(400).send({ success: false, message: err.message });
//             }
//             // Type assertion to handle the 'video' field properly
//             const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//             // Video size validation (if necessary)
//             if (files?.video) {
//                 const videoFiles = files.video;
//                 const fileSizeMB = videoFiles[0].size / (1024 * 1024);
//                 if (fileSizeMB > maxVideoLength) {
//                     UnlinkFiles([videoFiles[0].path]);
//                     return res.status(400).send({ success: false, message: 'Max video length is 20 MB' });
//                 }
//             }
//             next();
//         });
//     };
// };
// export default uploadFile;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const UnlinkFiles = (files) => {
    files.forEach((filePath) => {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${filePath}`, err);
            }
        });
    });
};
const ensureDirectoryExists = (directory) => {
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory, { recursive: true });
    }
};
const setFilePermissions = (filePath) => {
    try {
        fs_1.default.chmodSync(filePath, 0o666); // Read and write permissions for all users
    }
    catch (err) {
        console.error(`Error setting permissions for file: ${filePath}`, err);
    }
};
const uploadFile = () => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            try {
                // Determine the folder dynamically based on the field name
                const uploadPath = path_1.default.join('uploads', file.fieldname);
                ensureDirectoryExists(uploadPath);
                if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
                    cb(null, uploadPath);
                }
                else {
                    cb(new Error('Invalid file type'), '');
                }
            }
            catch (error) {
                cb(error, '');
            }
        },
        filename: function (req, file, cb) {
            const name = Date.now() + '-' + file.originalname;
            const filePath = path_1.default.join('uploads', file.fieldname, name);
            ensureDirectoryExists(path_1.default.dirname(filePath));
            setFilePermissions(filePath);
            cb(null, name);
        },
    });
    const fileFilter = (req, file, cb) => {
        const allowedFilenames = ['img', 'video', 'logo'];
        if (allowedFilenames.includes(file.fieldname)) {
            if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'));
            }
        }
        else {
            cb(new Error('Invalid field name'));
        }
    };
    const maxVideoLength = 20; // Maximum video size in MB
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
    }).fields([
        { name: 'img', maxCount: 4 },
        { name: 'video', maxCount: 1 },
        { name: 'logo', maxCount: 1 },
    ]);
    return (req, res, next) => {
        upload(req, res, function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(400).send({ success: false, message: err.message });
                }
                // Type assertion to handle the 'video' field properly
                const files = req.files;
                // Video size validation (if necessary)
                if (files === null || files === void 0 ? void 0 : files.video) {
                    const videoFiles = files.video;
                    const fileSizeMB = videoFiles[0].size / (1024 * 1024);
                    if (fileSizeMB > maxVideoLength) {
                        UnlinkFiles([videoFiles[0].path]);
                        return res.status(400).send({ success: false, message: 'Max video length is 20 MB' });
                    }
                }
                next();
            });
        });
    };
};
exports.default = uploadFile;
