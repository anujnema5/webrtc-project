"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
const app_1 = __importDefault(require("./app"));
const server = http_1.default.createServer(app_1.default);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`SERVER STARTED http://localhost:${PORT}/`);
});
socket_1.default.io.attach(server);
socket_1.default.initSocktListner();
