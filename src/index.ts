import cluster from 'cluster';
import os from 'os';
import { NextFunction, Request, Response } from 'express';
import middleware from './middleware/middleware';
import config from './DefaultConfig/config';
import { logger } from './utils/logger';
import globalErrorHandler, { CustomError } from './utils/globalErrorHandler';
import { routeMiddleware } from './middleware/routeMiddleware';
import { app, server } from './socket';
import { connectToDB } from './db';

const numCPUs = os.cpus().length || 1;

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
middleware(app);
// route middleware
routeMiddleware(app);

// Define routes
app.get('/', (req: Request, res: Response) => {
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
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
  globalErrorHandler(error, req, res, next);
});
// global error handler 
// app.use(globalErrorHandler);
// Start the server
const main = () => {
  try {
    server.listen(Number(config?.PORT), config?.IP,async () => {
      // server.listen(config?.PORT, async () => {
      await connectToDB()
      logger.info(`Worker process ${process.pid} is running on port ${config.PORT}`);

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
    });
  } catch (error) {
    console.log(error)
  }
}
main()
// }
