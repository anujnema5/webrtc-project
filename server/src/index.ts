import http from 'http';
import socket from './services/socket';

const server = http.createServer();
const PORT = process.env.PORTs || 8000

server.listen(PORT, ()=> {
    console.log(`SERVER STARTED http://localhost:${PORT}/`)
})

socket.io.attach(server)
socket.initSocktListner();