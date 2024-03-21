import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from "../db/db";
import { ApiError } from "../utils/ApiError";
import { User } from "@prisma/client";

const createGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `/api/user/google/callback`, // Adjust the callback URL based on your routes
        passReqToCallback: true
    },

    async (req: any, accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {
        try {
                const { id, displayName, name, emails, photos, provider } = profile;

                const avatar = profile._json.picture;
                const emailVerified = profile._json.email_verified;
                const email = emails?.[0].value;

                const existingUser = await db.user.findUnique({where: {email} })

                if (existingUser) {
                    if (!existingUser.emailVerified) {
                        const verifiedUser = await db.user.update({
                            data: {
                                emailVerified
                            },

                            where: { id: existingUser.id }
                        })
                        req.user = verifiedUser
                        return done(null, verifiedUser as User)
                    }
                    req.user = existingUser
                    return done(null, existingUser as User)
                }

                const newUser = await db.user.create({
                    data: {
                        googleId: id,
                        fullName: displayName,
                        email: email,
                        provider,
                        emailVerified
                    }
                })
                req.user = newUser
                done(null, newUser)
            }

            catch (error) {
                console.log(error)
                throw error

            }
        })
}

export default passport.use('google', createGoogleStrategy())