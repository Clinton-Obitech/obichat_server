import { Request, Response } from "express";
import { LoginBodyType, RegisterBodyType } from "../../types/auth.js";
import { LoginUser, RegisterUser } from "../../service/user/auth.js";
import jwt from "jsonwebtoken";
import { User, Users } from "../../lib/user.js";

export const RegisterUserController =
async (req: Request<{}, {}, RegisterBodyType>, res: Response) =>
{
    try {

        const result = await RegisterUser(req.body)

        if (!result.success) {
            return res.status(result.status).json({
                message: result.message
            })
        }

        const user = await User(result.user?.id)
        const users = await Users(result.user?.id)

        const obichatToken = jwt.sign(
            {id: result.user?.id,
            role: result.user?.role},
            process.env.JWT_SECRET!,
            {expiresIn: "5h"}
        )

        res.cookie("obichatToken", obichatToken, {
            httpOnly: true,
            secure: process.env.SUPA_ENV === "production",
            sameSite: process.env.SUPA_ENV === "production" ? "none" : "lax",
        })

        return res.status(result.status).json({
            message: result.message,
            user,
            users
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "server error"
        })
    }
}

export const LoginUserController =
async (req: Request<{}, {}, LoginBodyType>, res: Response) =>
{
    try {

        const result = await LoginUser(req.body)

        if (!result.success) {
            return res.status(result.status).json({
                message: result.message
            })
        }

        const user = await User(result.user?.id)
        const users = await Users(result.user?.id)

        const obichatToken = jwt.sign(
            {id: result.user?.id,
            role: result.user?.role},
            process.env.JWT_SECRET!,
            {expiresIn: "5h"}
        )

        res.cookie("obichatToken", obichatToken, {
            httpOnly: true,
            secure: process.env.SUPA_ENV === "production",
            sameSite: process.env.SUPA_ENV === "production" ? "none" : "lax",
        })

        return res.status(result.status).json({
            message: result.message,
            user,
            users
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "server error"
        })
    }
}

export const LogoutUserController = (req: Request, res: Response) =>
{
    try {
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.SUPA_ENV === "production",
            sameSite: process.env.SUPA_ENV === "production" ? "none" : "lax"
        })
        return res.status(200).json({
            message: "Logged out"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "server error"
        })
    }
}