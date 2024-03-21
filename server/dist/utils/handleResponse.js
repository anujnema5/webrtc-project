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
exports.tryCatchResponse = exports.handleResponse = void 0;
const ApiResponse_1 = require("./ApiResponse");
const ApiError_1 = require("./ApiError");
const handleResponse = (res, logic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield logic();
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError_1.ApiError(500, "Something went wrong"));
    }
});
exports.handleResponse = handleResponse;
const tryCatchResponse = (res, logic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logic();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError_1.ApiError(500, "Something went wrong"));
    }
});
exports.tryCatchResponse = tryCatchResponse;
