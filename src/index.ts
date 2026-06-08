import "dotenv/config"
import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import { authTokenPayLoad } from "./types/auth.js";
import UserAuth from "./route/user/auth.route.js";
import User from "./route/user/user.route.js";
import supabase from "./lib/supabase.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use("/api", UserAuth)
app.use("/api", User)

const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use((socket, next) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");

        const token = cookies.obichatToken;

        if (!token) {
            return next(new Error("Unauthorised"))
        }

        const decoded = 
        jwt.verify(token, process.env.JWT_SECRET as string) as authTokenPayLoad;

        (socket as any).userId = decoded.id;

        next();
    } catch (err) {
        console.error(err)
        next(new Error("Unauthorised"))
    }
})

const onlineUsers: Record<string, string> = {};

io.on("connection", (socket) => {

    const userId = (socket as any).userId;
    onlineUsers[userId] = socket.id;

    socket.on("private_message", async ({recieverId, message}) => {

        const recieverSocketId = onlineUsers[recieverId];
        const senderId = userId;

        const { data , error } = await supabase
        .from("obichat_private_messages")
        .insert({
            sender_id: senderId,
            receiver_id: recieverId,
            message: message
        })
        .select("*")
        .single();

        let msgError = "";

        if (error) {
            msgError = "message not sent";
            return console.error(error)
        }

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("receive_message", data, msgError ? msgError : "")
        }

        socket.emit("receive_message", data)

    })

    socket.on("disconnect", () => {
        delete onlineUsers[userId]
    })

})