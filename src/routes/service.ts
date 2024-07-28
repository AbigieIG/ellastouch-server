import express from 'express';
import { ServiceController } from "../controllers/service";
import verifyToken from '../middleware/jwt';

const router = express.Router();

router.post('/services', verifyToken, ServiceController.create);
router.get('/services',   ServiceController.findAll);
router.get('/services/:id', ServiceController.findById);
router.put('/services/:id', verifyToken, ServiceController.update);
router.delete('/services/:id', verifyToken, ServiceController.delete);

export default router;
