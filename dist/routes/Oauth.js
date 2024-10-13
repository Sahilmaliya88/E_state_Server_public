import express from 'express';
const OauthRouter = express.Router();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import prisma from '../lib/database.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
const clientId = process.env.googole_clientID || "nothin";
const secret = process.env.google_clientSecret || "nothing";
passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: secret,
    callbackURL: process.env.google_callbackURL,
    passReqToCallback: true,
    scope: ["profile", "email"]
}, async function (req, accessToken, refreshtoken, profile, cb) {
    let user = await prisma.users.findFirst({ where: { email: `${profile.emails ? profile.emails[0].value : ""}` } });
    if (!user) {
        user = await prisma.users.create({
            data: {
                email: `${profile.emails ? profile.emails[0].value : ""}`,
                password: profile.id,
                firstname: profile.name?.givenName || "John",
                lastname: profile.name?.familyName || "doe",
                provider: "google",
                provider_id: profile.id,
                photo: `${profile.photos ? profile.photos[0].value : ""}`,
            }
        });
    }
    return cb(null, user);
}));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user ? user : "");
});
OauthRouter.route('/google').get(passport.authenticate("google", { scope: ["profile", "email"] }));
OauthRouter.route('/google/callback').get(passport.authenticate("google", { failureRedirect: "/login" }), function (req, res, next) {
    const token = process.env.jwt_secret;
    const user = req.user;
    if (user.provider !== "google") {
        return next(new AppError("account already exists with different provide", 404));
    }
    const jwt_token = jwt.sign({ id: user?.id || "" }, token, { expiresIn: "30d" });
    res.cookie("jwt", jwt_token, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    res.redirect("http://localhost:3000/");
});
//facebook
passport.use(new FacebookStrategy({
    clientID: process.env.facebook_clientId || "nothing",
    clientSecret: process.env.facebook_clientSecret || "nothing",
    callbackURL: "http://localhost:4000/Oauth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async function (accessToken, refreshtoken, profile, done) {
    let user = await prisma.users.findFirst({ where: { email: `${profile.emails ? profile.emails[0].value : ""}` } });
    if (!user) {
        user = await prisma.users.create({
            data: {
                email: `${profile.emails ? profile.emails[0].value : ""}`,
                password: profile.id,
                firstname: profile.displayName.split(" ")[0] || "John",
                lastname: profile.displayName.split(" ")[1] || "doe",
                provider: "facebook",
                provider_id: profile.id,
                photo: `${profile.photos ? profile.photos[0].value : ""}`,
            }
        });
    }
    return done(null, user);
}));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user ? user : "");
});
OauthRouter.get('/facebook', passport.authenticate('facebook'));
OauthRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res, next) {
    const token = process.env.jwt_secret;
    const user = req.user;
    if (user.provider !== "facebook") {
        return next(new AppError("account already exists with different provide", 404));
    }
    const jwt_token = jwt.sign({ id: user?.id || "" }, token, { expiresIn: "30d" });
    res.cookie("jwt", jwt_token, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    res.redirect("http://localhost:3000/");
});
export default OauthRouter;
