import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError"
import { TokenExpiredError, verify } from "jsonwebtoken"
import { getUserById } from "../services/utils/db.utils"
import { User } from "@prisma/client"

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json(new ApiError(401, "Unauthorize request"));
    }

    try {
        const decodedToken = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
        const user = await getUserById(decodedToken.userId) as User
        req.user = user
        next();

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token expired")
            return res.status(403).json(new ApiError(403, "Token Expired"));

        }
        return res.status(401).json(new ApiError(401, "Suspicious activity detected"));
    }
}