import express from "express";
import { CategoryController } from "../controllers/category";
import verifyToken from "../middleware/jwt";

const router = express.Router();

router.post("/categories", verifyToken, CategoryController.create);
router.get("/categories", CategoryController.getAll);
router.get("/categories/:id", CategoryController.getById);
router.put("/categories/:id", verifyToken, CategoryController.update);
router.delete("/categories/:id", verifyToken, CategoryController.delete);

export default router;
