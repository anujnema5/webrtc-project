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
exports.getUserById = void 0;
const db_1 = require("../../db/db");
const ApiError_1 = require("../../utils/ApiError");
const constants_1 = require("../../utils/constants");
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUnique({ where: { id } });
        return user;
    }
    catch (error) {
        return new ApiError_1.ApiError(constants_1.SERVER_BAD_REQUEST_CODE, constants_1.SERVER_ERROR_MESSAGE);
    }
});
exports.getUserById = getUserById;
