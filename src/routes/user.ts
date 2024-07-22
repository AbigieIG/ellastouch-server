import { Router } from 'express';
import { UserController } from '../controllers/user';

const router = Router();

router.post('/users', UserController.create);
router.get('/users', UserController.findAll);
router.get('/users/:id', UserController.findById);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

export default router;
