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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("../db/db");
const createGoogleStrategy = () => {
    return new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `/api/user/google/callback`, // Adjust the callback URL based on your routes
        passReqToCallback: true
    }, (req, accessToken, refreshToken, params, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, displayName, name, emails, photos, provider } = profile;
            const avatar = profile._json.picture;
            const emailVerified = profile._json.email_verified;
            const email = emails === null || emails === void 0 ? void 0 : emails[0].value;
            const existingUser = yield db_1.db.user.findUnique({ where: { email } });
            if (existingUser) {
                if (!existingUser.emailVerified) {
                    const verifiedUser = yield db_1.db.user.update({
                        data: {
                            emailVerified
                        },
                        where: { id: existingUser.id }
                    });
                    req.user = verifiedUser;
                    return done(null, verifiedUser);
                }
                req.user = existingUser;
                return done(null, existingUser);
            }
            const newUser = yield db_1.db.user.create({
                data: {
                    googleId: id,
                    fullName: displayName,
                    email: email,
                    provider,
                    emailVerified
                }
            });
            req.user = newUser;
            done(null, newUser);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }));
};
exports.default = passport_1.default.use('google', createGoogleStrategy());
