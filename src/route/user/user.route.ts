import { Router } from "express";
import { ChatController, UserController, UsersController } from "../../controller/user/user.js";
import { VerifyUser } from "../../middleware/user/verify.js";

const router = Router();

router.get("/user", VerifyUser, UserController)
router.get("/users", VerifyUser, UsersController)
router.get("/chats/:id", VerifyUser, ChatController)

export default router;