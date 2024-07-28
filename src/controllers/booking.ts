import { Request, Response } from "express";
import { Booking } from "../models/booking";
import { Service } from "../models/service";
import { BookingDto } from "../dto/index.dto";
// import { User } from "../models/user";

export class BookingController {
  static async create(
    req: Request<{}, {}, BookingDto>,
    res: Response
  ): Promise<Response> {
    try {
      const service = await Service.findByPk(req.body.serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      const {
        serviceId,
        fullName,
        email,
        phoneNumber,
        state,
        city,
        address,
        zipCode,
        time,
        date,
      } = req.body;
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
      const booking = await Booking.create(req.body);
      return res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const bookings = await Booking.findAll({
        include: [Service],
      });
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
      const booking = await Booking.findByPk(id, {
        include: [Service],
      });

      if (booking) {
        return res.status(200).json(booking);
      } else {
        return res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      console.error("Error finding booking:", error);
      return res.status(500).json({ message: error });
    }
  }
static async findBookingById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const bookings = await Booking.findOne({ where: { bookingId: id}, include: [Service]});
    if (!bookings) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error finding bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
  static async update(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        serviceId,
        fullName,
        email,
        phoneNumber,
        state,
        city,
        address,
        zipCode,
      } = req.body;

      const booking = await Booking.findByPk(id);

      if (booking) {
        if (serviceId) {
          const service = await Service.findByPk(serviceId);
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
      } else {
        return res.status(404).json({ message: "Booking not found" });
      }
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
      const booking = await Booking.findByPk(id);

      if (booking) {
        await booking.destroy();
        return res.status(204).send();
      } else {
        return res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
