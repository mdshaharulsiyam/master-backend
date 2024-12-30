"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const os_1 = __importDefault(require("os"));
const middleware_1 = __importDefault(require("./middleware/middleware"));
const config_1 = __importDefault(require("./DefaultConfig/config"));
const logger_1 = require("./utils/logger");
const globalErrorHandler_1 = __importStar(require("./utils/globalErrorHandler"));
const routeMiddleware_1 = require("./middleware/routeMiddleware");
const socket_1 = require("./socket");
const db_1 = require("./db");
const numCPUs = os_1.default.cpus().length || 1;
// if (cluster.isPrimary) {
//     console.log(`Primary process ${process.pid} is running`);
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} exited. Restarting...`);
//         cluster.fork();
//     });
// } else {
// const app = express();
// Apply middleware
(0, middleware_1.default)(socket_1.app);
// route middleware
(0, routeMiddleware_1.routeMiddleware)(socket_1.app);
// Define routes
socket_1.app.get('/', (req, res) => {
    res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Shop Server</h1>
        <p class="text-gray-600">The server is running ${process.pid}....</p>
      </div>
    </body>
    </html>
  `);
});
// all error handler 
socket_1.app.all("*", (req, res, next) => {
    const error = new globalErrorHandler_1.CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    (0, globalErrorHandler_1.default)(error, req, res, next);
});
// global error handler 
// app.use(globalErrorHandler);
// Start the server
const main = () => {
    try {
        socket_1.server.listen(Number(config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PORT), config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.IP, () => __awaiter(void 0, void 0, void 0, function* () {
            // server.listen(config?.PORT, async () => {
            yield (0, db_1.connectToDB)();
            logger_1.logger.info(`Worker process ${process.pid} is running on port ${config_1.default.PORT}`);
            // Error handling for worker processes
            process.on('uncaughtException', (error) => {
                console.error('Uncaught Exception:', error.message);
                console.error(error.stack);
            });
            process.on('unhandledRejection', (reason, promise) => {
                console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            });
            process.on('SIGTERM', () => {
                console.log(`Worker process ${process.pid} received SIGTERM. Shutting down gracefully.`);
                //   process.exit(0);
            });
            process.on('SIGINT', () => {
                console.log(`Worker process ${process.pid} received SIGINT. Shutting down gracefully.`);
                //   process.exit(0);
            });
        }));
    }
    catch (error) {
        console.log(error);
    }
};
main();
// }
