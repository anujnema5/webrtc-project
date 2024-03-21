"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_services_1 = require("./auth.services");
const verify_user_1 = require("../../middleware/verify.user");
const auth = (0, express_1.Router)()
    .post('/sign-in', auth_services_1.signInUser)
    .post('/sign-up', auth_services_1.signUpUser)
    .get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }))
    .get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_services_1.googleCallback)
    .post('/refresh', auth_services_1.userAccessRefershToken)
    .post('/logout', verify_user_1.verifyUser, auth_services_1.logout);
exports.default = auth.use('/user', auth);
