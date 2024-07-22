import express from 'express';
import { ServiceController } from "../controllers/service";

const router = express.Router();

router.post('/services', ServiceController.create);
router.get('/services', ServiceController.findAll);
router.get('/services/:id', ServiceController.findById);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

export default router;
