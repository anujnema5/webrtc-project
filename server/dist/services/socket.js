"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        this._io = new socket_io_1.Server({
            cors: {
                credentials: true,
                origin: '*',
                allowedHeaders: ['*']
            }
        });
    }
    get io() {
        return this._io;
    }
    initSocktListner() {
        this.io.on('connection', (socket) => {
            console.log(socket.id);
            socket.emit("me", socket.id);
            socket.on("disconnect", () => {
                socket.broadcast.emit("callEnded");
            });
            socket.on("callUser", ({ userToCall, signalData, from, name }) => {
                console.log("haa" + from);
                this.io.to(userToCall).emit("callUser", { signal: signalData, from, name });
            });
            socket.on("answerCall", ({ from, signal, to, name }) => {
                this.io.to(to).emit("callAccepted", { from, signal, name });
            });
            socket.on('message', ({ to, from, message }) => {
                this.io.to(to).emit('message:recieved', { to, from, message });
            });
        });
    }
}
exports.default = new SocketService();
