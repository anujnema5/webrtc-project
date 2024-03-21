import { db } from '../../db/db';
import jwt from 'jsonwebtoken';
import { getUserById } from './db.utils';
import { User } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { SERVER_BAD_REQUEST_CODE, SERVER_ERROR_MESSAGE } from '../../utils/constants';

const generateToken = (data: any, secret: string, expiry: string) =>
    jwt.sign(data, secret, { expiresIn: expiry });

export const generateAccessRefreshToken = async (id: any) => {
    try {

        const entity = await getUserById(id) as User;
        const updateFunction = db.user.update as any;

        const accessToken = generateAccessToken(entity);
        const refreshToken = generateRefreshToken(entity?.id);

        await updateFunction({ where: { id }, data: { refreshToken } });
        return { accessToken, refreshToken };

    } catch (error) {
        return
    }
};

const generateAccessToken = (user: User) =>
    generateToken({ id: user?.id, email: user?.email, username: user.username, fullName: user.fullName, emailVerified: user.emailVerified  }, process.env.ACCESS_TOKEN_SECRET as string, process.env.ACCESS_TOKEN_EXPIRY as string);

const generateRefreshToken = (userID: any) => {
    console.log("Token refreshed");
    return generateToken({ userId: userID }, process.env.REFRESH_TOKEN_SECRET as string, process.env.REFRESH_TOKEN_EXPIRY as string);
};