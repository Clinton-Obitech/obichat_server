import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authTokenPayLoad } from "../../types/auth.js";

export const VerifyUser = (req: Request, res: Response, next: NextFunction) =>
{
    const token = req.cookies?.obichatToken;

    try {

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "not authenticated",
            status: 401
        })
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as authTokenPayLoad;
        req.user = decoded;

        next();
    } catch (err) {
        console.error(err)
        return res.status(401).json({
            success: false,
            message: "not authenticated",
            status: 401
        })
    }
}