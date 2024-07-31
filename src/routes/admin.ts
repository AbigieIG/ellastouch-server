import { Router } from "express";
import { AdminController } from "../controllers/admin";
import verifyToken from "../middleware/jwt";

const router = Router();

router.get("/address", AdminController.find);
router.get("/admin",verifyToken , AdminController.me);
router.post("/admin", verifyToken, AdminController.create);
router.put("/admin", verifyToken, AdminController.update);
router.post("/admin/login", AdminController.login);
router.post("/logout", AdminController.logout);

export default router;