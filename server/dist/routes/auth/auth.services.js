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
exports.logout = exports.userAccessRefershToken = exports.signUpUser = exports.signInUser = exports.googleCallback = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_utils_1 = require("../../services/utils/token.utils");
const cookie_option_1 = require("../../utils/static/cookie.option");
require("dotenv/config");
const handleResponse_1 = require("../../utils/handleResponse");
const ApiError_1 = require("../../utils/ApiError");
const db_utils_1 = require("../../services/utils/db.utils");
const ApiResponse_1 = require("../../utils/ApiResponse");
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, handleResponse_1.tryCatchResponse)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { accessToken, refreshToken } = yield (0, token_utils_1.generateAccessRefreshToken)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const user = yield (0, db_utils_1.getUserById)((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        // req.flash('userData', {user, accessToken});
        return res.status(200)
            .cookie("accessToken", accessToken, cookie_option_1.options)
            .cookie("refreshToken", refreshToken, cookie_option_1.options)
            .redirect(`http://localhost:3000/google/callback/?token=${accessToken}`);
    }));
});
exports.googleCallback = googleCallback;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, handleResponse_1.tryCatchResponse)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        // TODO ZOD VALIDATION
        const { username, email, password } = req.body;
        if (!username && !email) {
            return res.status(400).json(new ApiError_1.ApiError(400, "Username or email is required"));
        }
        if (!password) {
            return res.status(400).json(new ApiError_1.ApiError(400, "Password is required"));
        }
        const foundUser = yield db_1.db.user.findFirst({
            where: { username }, select: {
                id: true,
                password: true,
                fullName: true,
                email: true,
                refreshToken: false,
                username: true,
                emailVerified: true,
            }
        });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Wrong password"));
        }
        const userWithoutPassword = Object.assign({}, foundUser);
        delete userWithoutPassword.password;
        const { accessToken, refreshToken } = yield (0, token_utils_1.generateAccessRefreshToken)(foundUser.id);
        console.log(userWithoutPassword);
        return res.status(200)
            .cookie("accessToken", accessToken, cookie_option_1.options)
            .cookie("refreshToken", refreshToken, cookie_option_1.options)
            .json(new ApiResponse_1.ApiResponse(200, { user: userWithoutPassword, accessToken }));
    }));
});
exports.signInUser = signInUser;
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Hey');
    const { fullName, username, email, password, phoneNumber } = req.body;
    if (!fullName || !username || !email || !password) {
        return res.status(400).json(new ApiError_1.ApiError(400, "All fields are required"));
    }
    yield (0, handleResponse_1.tryCatchResponse)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const existedUser = yield (0, db_utils_1.getUserByEmail)(email);
        if (existedUser) {
            return res.status(409).json(new ApiError_1.ApiError(409, "User already exists"));
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // WRAP THE WHOLE PROCESS IN TRANSACTION
        const newUser = yield db_1.db.user.create({
            data: { username, fullName, phoneNumber, email, password: hashedPassword },
            select: {
                id: true,
                password: false,
                fullName: true,
                email: true,
                refreshToken: false,
                username: true,
                emailVerified: true,
            }
        });
        const { accessToken, refreshToken } = yield (0, token_utils_1.generateAccessRefreshToken)(newUser.id);
        return res.status(200)
            .cookie("accessToken", accessToken, cookie_option_1.options)
            .cookie("refreshToken", refreshToken, cookie_option_1.options)
            .json(new ApiResponse_1.ApiResponse(200, { user: newUser, accessToken }));
    }));
});
exports.signUpUser = signUpUser;
const userAccessRefershToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingrefreshToken) {
        return res.status(401).json(new ApiError_1.ApiError(401, "No refresh token found"));
    }
    yield (0, handleResponse_1.tryCatchResponse)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const decodedToken = jsonwebtoken_1.default.decode(incomingrefreshToken);
        if (!decodedToken) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Non-valid refresh token"));
        }
        const foundUser = yield db_1.db.user.findFirst({
            where: { id: decodedToken.userId },
            select: {
                id: true,
                password: false,
                fullName: true,
                email: true,
                refreshToken: true,
                username: true,
                emailVerified: true,
            }
        });
        console.log(incomingrefreshToken === (foundUser === null || foundUser === void 0 ? void 0 : foundUser.refreshToken));
        if ((foundUser === null || foundUser === void 0 ? void 0 : foundUser.refreshToken) !== incomingrefreshToken) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Token expired or already been used"));
        }
        const { accessToken, refreshToken } = yield (0, token_utils_1.generateAccessRefreshToken)(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id);
        foundUser === null || foundUser === void 0 ? true : delete foundUser.refreshToken;
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookie_option_1.options)
            .cookie("refreshToken", refreshToken, cookie_option_1.options)
            .json(new ApiResponse_1.ApiResponse(200, { user: foundUser, accessToken }));
    }));
});
exports.userAccessRefershToken = userAccessRefershToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, handleResponse_1.tryCatchResponse)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const updatedUser = db_1.db.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
        return res.status(200)
            .clearCookie("accessToken", cookie_option_1.options)
            .clearCookie("refreshToken", cookie_option_1.options)
            .json(new ApiResponse_1.ApiResponse(200, {}, "User logged Out"));
    }));
});
exports.logout = logout;
