import { Response } from "express";
import { ApiResponse } from "./ApiResponse";
import { ApiError } from "./ApiError";

export const handleResponse = async (res: Response, logic: () => Promise<any>) => {
    try {
        const result = await logic();
        return res.status(200).json(new ApiResponse(200, result))
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something went wrong"))
    }
};

export const tryCatchResponse = async (res: Response, logic: () => Promise<any>) => {
    try {
        await logic();
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiError(500, "Something went wrong"))
    }
}