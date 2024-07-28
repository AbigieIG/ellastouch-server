import { Router } from "express";
import { GalleryController } from "../controllers/gallery";
import verifyToken from "../middleware/jwt";

const router = Router();

router.post('/upload',verifyToken, GalleryController.uploadImage);

router.get('/galleries',  GalleryController.findAll);

router.get('/galleries/:id', GalleryController.findById);
router.put('/galleries/:id', verifyToken, GalleryController.update);
router.delete('/galleries/:id', verifyToken, GalleryController.delete);

export default router;
