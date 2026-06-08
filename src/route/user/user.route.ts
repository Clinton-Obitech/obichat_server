import { Router } from "express";
import { ChatController, SearchController, UserController, UsersController } from "../../controller/user/user.js";
import { VerifyUser } from "../../middleware/user/verify.js";

const router = Router();

router.get("/user", VerifyUser, UserController)
router.get("/users", VerifyUser, UsersController)
router.get("/chats/:id", VerifyUser, ChatController)
router.get("/search/user/:username", VerifyUser, SearchController)

export default router;