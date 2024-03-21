import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { db } from "../../db/db";
import jwt from 'jsonwebtoken';
import { generateAccessRefreshToken } from "../../services/utils/token.utils";
import { options } from "../../utils/static/cookie.option";
import { User } from "@prisma/client";
import 'dotenv/config';
import { handleResponse, tryCatchResponse } from "../../utils/handleResponse";
import { ApiError } from "../../utils/ApiError";
import { getUserByEmail, getUserById } from "../../services/utils/db.utils";
import { ApiResponse } from "../../utils/ApiResponse";

export const googleCallback = async (req: any, res: Response) => {
    await tryCatchResponse(res, async () => {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id) as any
        const user = await getUserById(req.user?.id)

        // req.flash('userData', {user, accessToken});

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`http://localhost:3000/google/callback/?token=${accessToken}`);
    })
}

export const signInUser = async (req: Request, res: Response) => {
    await tryCatchResponse(res, async () => {

        // TODO ZOD VALIDATION
        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(400).json(new ApiError(400, "Username or email is required"));
        }

        if (!password) {
            return res.status(400).json(new ApiError(400, "Password is required"));
        }

        const foundUser = await db.user.findFirst({
            where: { username }, select: {
                id: true,
                password: true,
                fullName: true,
                email: true,
                refreshToken: false,
                username: true,
                emailVerified: true,
            }
        }) as User

        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password as string);
        console.log(isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError(401, "Wrong password"));
        }

        const userWithoutPassword = { ...foundUser } as any;
        delete userWithoutPassword.password;

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser.id) as any;
        console.log(userWithoutPassword);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: userWithoutPassword, accessToken }));
    });
}

export const signUpUser = async (req: Request, res: Response) => {
    console.log('Hey');
    const { fullName, username, email, password, phoneNumber } = req.body;

    if (!fullName || !username || !email || !password) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    await tryCatchResponse(res, async () => {

        const existedUser = await getUserByEmail(email);

        if (existedUser) {
            return res.status(409).json(new ApiError(409, "User already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // WRAP THE WHOLE PROCESS IN TRANSACTION
        const newUser = await db.user.create({
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

        const { accessToken, refreshToken } = await generateAccessRefreshToken(newUser.id) as any;

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: newUser, accessToken }));

    });
}

export const userAccessRefershToken = async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingrefreshToken) {
        return res.status(401).json(new ApiError(401, "No refresh token found"));
    }

    await tryCatchResponse(res, async () => {
        const decodedToken = jwt.decode(incomingrefreshToken) as any;

        if (!decodedToken) {
            return res.status(401).json(new ApiError(401, "Non-valid refresh token"));
        }

        const foundUser = await db.user.findFirst({
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
        }) as any;

        console.log(incomingrefreshToken === foundUser?.refreshToken);

        if (foundUser?.refreshToken !== incomingrefreshToken) {
            return res.status(401).json(new ApiError(401, "Token expired or already been used"));
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser?.id) as any;
        delete foundUser?.refreshToken;

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: foundUser, accessToken }));
    });
}

export const logout = async (req: any, res: Response) => {
    await tryCatchResponse(res, async () => {
        const userId = req.user?.id;

        const updatedUser = db.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        })

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"))
    })
}