import express, { Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const userSocketMap: Record<string, string> = {};

const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app, getReceiverSocketId };
