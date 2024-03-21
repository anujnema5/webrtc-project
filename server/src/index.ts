import http from 'http';
import socket from './services/socket';
import app from './app';

const server = http.createServer(app);
const PORT = process.env.PORT || 8000

server.listen(PORT, ()=> {
    console.log(`SERVER STARTED http://localhost:${PORT}/`)
})

socket.io.attach(server)
socket.initSocktListner();