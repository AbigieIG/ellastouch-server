import { Router } from 'express';
import { BookingController } from "../controllers/booking";

const router = Router();


router.post('/bookings', BookingController.create);
router.get('/bookings', BookingController.findAll);
router.get('/booking/:id', BookingController.findBookingById);
router.get('/bookings/:id', BookingController.findById);
// router.put('/bookings/:id', BookingController.update);
// router.delete('/bookings/:id', BookingController.delete);

export default router;
