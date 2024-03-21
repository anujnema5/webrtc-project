// middlewares.ts
import express, { NextFunction, Request, Response, Router } from 'express';
import cookieParser from 'cookie-parser';
import passport from './passport.middleware';
import cors from 'cors';

const initializeMiddlewares = (app: express.Application) => {
    app.use(express.json());
    app.use(cookieParser());

    app.use(passport.initialize());

    app.use(
        cors({
            origin: 'http://localhost:3000',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        })
    );
};

export default initializeMiddlewares;