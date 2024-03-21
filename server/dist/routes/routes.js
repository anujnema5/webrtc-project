"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = __importDefault(require("./auth/auth.controllers"));
const routes = (0, express_1.Router)()
    .get('/', (req, res) => { return res.send("SERVER IS RUNNING"); })
    .use(auth_controllers_1.default);
exports.default = routes.use('/api/', routes);
