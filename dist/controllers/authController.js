import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { checkAsync } from "../lib/checkasync.js";
import prisma from "../lib/database.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError.js";
import crypto from 'crypto';
import Email from '../utils/Email.js';
const secret = process.env.jwt_secret;
export const createUser = checkAsync(async (req, res, next) => {
    const { firstname, lastname, email, password, conformpassword, } = req.body;
    if (!firstname || !lastname || !email || !password || !conformpassword) {
        return next(new AppError("please enter sufficient data", 404));
    }
    if (password !== conformpassword) {
        return next(new AppError("passwords are different", 404));
    }
    if (!secret) {
        return next(new AppError("new Error", 300));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword
        }
    });
    const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: "30d"
    });
    //cache user
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    });
    res.status(201).json({
        status: 'success',
        user: user
    });
});
export const Login = checkAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("please enter sufficient data", 401));
    }
    const user = await prisma.users.findFirst({
        where: {
            email: email
        },
        include: { location: true }
    });
    if (!user) {
        return next(new AppError("please create account", 404));
    }
    if (user.provider) {
        return next(new AppError(`please login with ${user.provider} account`, 404));
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
        return next(new AppError("wrong password", 401));
    }
    const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: "30d"
    });
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        user: user
    });
});
export const verifyMiddle = checkAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    const secret = process.env.jwt_secret;
    const decoded = jwt.verify(token, secret);
    if (!decoded.id) {
        return next(new AppError("invalid token", 404));
    }
    if (decoded.exp < Date.now() / 1000) {
        return next(new AppError("token expired login again", 401));
    }
    const token_createdAt = new Date(decoded.iat * 1000);
    const user = await prisma.users.findUnique({ where: { id: decoded.id }, include: { location: true } });
    if (user) {
        if (user.passwordChangedAt) {
            if (user.passwordChangedAt > token_createdAt) {
                return next(new AppError("password changed login again", 401));
            }
        }
        req.user = user;
    }
    next();
});
export const verifyUser = checkAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError("please login again", 401));
    }
    res.status(200).json({
        status: "success",
        user: req.user
    });
});
//forgot password
export const ForgotPassword = checkAsync(async (req, res, next) => {
    const email = req.body.email;
    const token = crypto.randomBytes(16).toString("hex");
    const decoded_token = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.users.update({
        where: { email: email },
        data: {
            resetlink: decoded_token,
            resetlink_expiresAt: new Date(Date.now() + 2 * 60 * 1000)
        }
    });
    if (!user || user.provider) {
        return next(new AppError("can't find user", 401));
    }
    const client_url = "http://localhost:4000";
    const url = `${client_url}/changepassword/${token}`;
    await new Email(user, url).forgotpassword();
    res.status(200).json({
        message: "email successfully sent"
    });
});
export const changePassword = checkAsync(async (req, res, next) => {
    const password_token = req.params.token;
    const encrypted_token = crypto.createHash("sha256").update(password_token).digest("hex");
    const user = await prisma.users.findFirst({
        where: {
            resetlink: encrypted_token,
            resetlink_expiresAt: {
                gt: new Date(Date.now())
            }
        }
    });
    if (!user) {
        return next(new AppError("resetlink expires", 401));
    }
    const { password } = req.body;
    const hashed_password = await bcrypt.hash(password, 10);
    const updated_user = await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            password: hashed_password,
            passwordChangedAt: new Date(Date.now()),
            resetlink: null,
            resetlink_expiresAt: null
        },
        include: { location: true }
    });
    const token = jwt.sign({ id: updated_user.id }, secret, {
        expiresIn: "30d"
    });
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        user: updated_user
    });
});
export const deleteMe = checkAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await prisma.users.update({
        where: { id: id }, data: { isActive: false }
    });
    res.cookie("jwt", "", { expires: new Date(Date.now() - 10) });
    res.status(204).json({ status: 'success' });
});
export const logout = checkAsync(async (req, res, next) => {
    res.clearCookie("jwt");
    const id = req.params.id;
    res.status(200).json({ status: 'success' });
});
export const updateMe = checkAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    for (let ele in data) {
        if (ele === "password") {
            delete data.ele;
        }
    }
    const user = await prisma.users.update({
        where: { id: id }, data: { ...data }
    });
    res.status(200).json({ status: 'success', user: user });
});
