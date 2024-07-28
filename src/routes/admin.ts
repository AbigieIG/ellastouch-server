import { Router } from "express";
import { AdminController } from "../controllers/admin";
import verifyToken from "../middleware/jwt";

const router = Router();

// router.get("/admin",verifyToken , AdminController.find);
router.post("/admin", verifyToken, AdminController.create);
router.post("/admin/login", AdminController.login);
router.post("/logout", AdminController.logout);

export default router;