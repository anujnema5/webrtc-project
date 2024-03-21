import { Request, Router } from "express";
import passport from "passport";
import { googleCallback, logout, signInUser, signUpUser, userAccessRefershToken } from "./auth.services";
import { verifyUser } from "../../middleware/verify.user";

const auth = Router()
    .post('/sign-in', signInUser)
    .post('/sign-up', signUpUser)
    .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
    .get('/google/callback',passport.authenticate('google', { session: false }), googleCallback)
    .post('/refresh', userAccessRefershToken)
    .post('/logout', verifyUser, logout)

export default auth.use('/user', auth)