import { db } from "../../db/db";
import { ApiError } from "../../utils/ApiError";
import { SERVER_BAD_REQUEST_CODE, SERVER_ERROR_MESSAGE } from "../../utils/constants";

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({where: {id}, select: {
            id: true,
            email: true, 
            username: true,
            refreshToken: false,
            fullName: true,
            emailVerified: true,
            password: false,
        }});
        return user;
    } catch (error) {
        return new ApiError(SERVER_BAD_REQUEST_CODE, SERVER_ERROR_MESSAGE)
    }
}


export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({where: {email}});
        return user;
    } catch (error) {
        return new ApiError(SERVER_BAD_REQUEST_CODE, SERVER_ERROR_MESSAGE)
    }
}
