import { Router } from "express";
import { LoginUserController, LogoutUserController, RegisterUserController } from "../../controller/user/auth.js";

const router = Router();

router.post("/register/user", RegisterUserController)
router.post("/login/user", LoginUserController)
router.post("/logout/user", LogoutUserController)

export default router;