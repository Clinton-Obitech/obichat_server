import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

export interface RegisterBodyType {
    username: string;
    email: string;
    password: string;
}

export interface LoginBodyType {
    username: string;
    password: string;
}

export interface authTokenPayLoad extends JwtPayload {
    id: string;
    role: string;
}

export interface AuthenticatedSocket extends Socket {
    userId: string;
}