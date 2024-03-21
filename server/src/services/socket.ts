import { Server } from "socket.io";

class SocketService {
    private _io;
    constructor() {
        this._io = new Server({
            cors: {
                credentials: true,
                origin: '*',
                allowedHeaders: ['*']
            }
        });
    }

    get io() {
        return this._io
    }

    public initSocktListner() {
        this.io.on('connection', (socket) => {
            console.log(socket.id)
            socket.emit("me", socket.id);

            socket.on("disconnect", () => {
                socket.broadcast.emit("callEnded")
            });

            socket.on("callUser", ({ userToCall, signalData, from, name }) => {
                console.log("haa" + from)
                this.io.to(userToCall).emit("callUser", { signal: signalData, from, name });
            });

            socket.on("answerCall", ({from, signal, to, name}) => {
                this.io.to(to).emit("callAccepted", {from, signal, name})
            });

            socket.on('message', ({ to, from, message }) => {
                this.io.to(to).emit('message:recieved', { to, from, message })
            })
        })
    }
}

export default new SocketService();