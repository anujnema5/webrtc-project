"use strict";
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
exports.generateAccessRefreshToken = void 0;
const db_1 = require("../../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_utils_1 = require("./db.utils");
const generateToken = (data, secret, expiry) => jsonwebtoken_1.default.sign(data, secret, { expiresIn: expiry });
const generateAccessRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entity = yield (0, db_utils_1.getUserById)(id);
        const updateFunction = db_1.db.user.update;
        const accessToken = generateAccessToken(entity);
        const refreshToken = generateRefreshToken(entity === null || entity === void 0 ? void 0 : entity.id);
        yield updateFunction({ where: { id }, data: { refreshToken } });
        return { accessToken, refreshToken };
    }
    catch (error) {
        return;
    }
});
exports.generateAccessRefreshToken = generateAccessRefreshToken;
const generateAccessToken = (user) => generateToken({ id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email, username: user.username, fullName: user.fullName, emailVerified: user.emailVerified }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
const generateRefreshToken = (userID) => {
    console.log("Token refreshed");
    return generateToken({ userId: userID }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
};
