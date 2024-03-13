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
        this._io.on('connection', (socket) => {
            console.log(`connection success ${socket.id}`)

            socket.on('room:join', ({ email, room }) => {
                this.io.to(room).emit("user:joined", { email, id: socket.id })
                socket.join(room)
                this.io.to(socket.id).emit("room:join", { email, room })
            })

            socket.on('ping:remote:user', ({ to, from }) => {
                console.log({ to, from })
                this.io.to(to).emit("inform:remote:user", { from })
            })

            socket.on('request:call', ({ to, offer }) => {
                this.io.to(to).emit('incoming:call', {from: socket.id, offer})
            })

            socket.on('call:accepted', ({to, answer})=> {
                this.io.to(to).emit('remote:call:accepted', {answer})
            })

            socket.on('negotiation:needed', ({to, offer})=> {
                this.io.to(to).emit('negotiation:needed', {from: socket.id, offer})
            })

            socket.on('negotiation:done', ({to, answer})=> {
                this.io.to(to).emit('negotiation:final', ({from: socket.id, answer}))
            })
        })
    }
}

export default new SocketService();