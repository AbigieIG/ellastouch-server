import express from 'express';
import { CategoryController } from "../controllers/category"; 

const router = express.Router();

router.post('/categories', CategoryController.create);
router.get('/categories', CategoryController.getAll);
router.get('/categories/:id', CategoryController.getById);
router.put('/categories/:id', CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

export default router;
