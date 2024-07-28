import { Router } from "express";
import { UserController } from "../controllers/user";
import verifyToken from "../middleware/jwt";

const router = Router();

router.post("/users", UserController.create);
router.get("/users", UserController.findAll);
router.get("/users/data", verifyToken, UserController.data);
router.get("/users/:id",  UserController.findById);
router.put("/users/edit", verifyToken, UserController.update);
router.delete("/users/delete", verifyToken, UserController.delete);

export default router;
