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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const ApiError_1 = require("../utils/ApiError");
const jsonwebtoken_1 = require("jsonwebtoken");
const db_utils_1 = require("../services/utils/db.utils");
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.accessToken || req.body.accessToken || ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
    if (!token) {
        return res.status(401).json(new ApiError_1.ApiError(401, "Unauthorize request"));
    }
    try {
        const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield (0, db_utils_1.getUserById)(decodedToken.userId);
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            console.log("Token expired");
            return res.status(403).json(new ApiError_1.ApiError(403, "Token Expired"));
        }
        return res.status(401).json(new ApiError_1.ApiError(401, "Suspicious activity detected"));
    }
});
exports.verifyUser = verifyUser;
