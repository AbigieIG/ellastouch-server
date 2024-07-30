import { Request, Response } from "express";
import { Booking } from "../models/booking"; 
import { Service } from "../models/service"; 
import { BookingDto } from "../dto/index.dto";
import { sendEmail } from "../middleware/nodemailer";
import { renderTemplate } from "../middleware/renderTemplate";

export class BookingController {
  static async create(
    req: Request<{}, {}, BookingDto>,
    res: Response
  ): Promise<Response> {
    try {
      const { serviceId, fullName, email, phoneNumber, state, city, address, zipCode, time, date } = req.body;

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (
        !serviceId ||
        !fullName ||
        !email ||
        !phoneNumber ||
        !state ||
        !city ||
        !address ||
        !zipCode ||
        !time ||
        !date
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const booking = new Booking(req.body);
      await booking.save();

      const bookingConfirmationHtml = renderTemplate(
        "booking-confirmation.html",
        {
          fullName,
          bookingId: booking._id,
          serviceName: service.name,
          date,
          time,
        }
      );

      await sendEmail(email, "Booking Confirmation", bookingConfirmationHtml);

      const newBookingNotificationHtml = renderTemplate(
        "new-booking-notification.html",
        {
          bookingId: booking._id,
          fullName,
          serviceName: service.name,
          date,
          time,
          email,
          phoneNumber,
        }
      );

      const adminEmail = process.env.ADMIN_EMAIL;
      await sendEmail(
        adminEmail,
        "New Booking Notification",
        newBookingNotificationHtml
      );

      return res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const bookings = await Booking.find().populate("service").exec();
      return res.status(200).json(bookings);
    } catch (error) {
      console.error("Error finding bookings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id).populate("service").exec();

      if (booking) {
        return res.status(200).json(booking);
      } else {
        return res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      console.error("Error finding booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findBookingById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ bookingId: id }).populate("service").exec();
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      return res.status(200).json(booking);
    } catch (error) {
      console.error("Error finding booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { serviceId, fullName, email, phoneNumber, state, city, address, zipCode } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (serviceId) {
        const service = await Service.findById(serviceId);
        if (!service) {
          return res.status(404).json({ message: "Service not found" });
        }
        booking.serviceId = serviceId;
      }

      booking.fullName = fullName ?? booking.fullName;
      booking.email = email ?? booking.email;
      booking.phoneNumber = phoneNumber ?? booking.phoneNumber;
      booking.state = state ?? booking.state;
      booking.city = city ?? booking.city;
      booking.address = address ?? booking.address;
      booking.zipCode = zipCode ?? booking.zipCode;

      await booking.save();
      return res.status(200).json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await booking.deleteOne();
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
