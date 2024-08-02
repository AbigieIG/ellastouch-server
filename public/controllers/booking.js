"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const booking_1 = require("../schemas/booking");
const service_1 = require("../schemas/service");
const nodemailer_1 = require("../middleware/nodemailer");
const user_1 = require("../schemas/user");
const renderTemplate_1 = require("../middleware/renderTemplate");
class BookingController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId, userId, fullName, email, phoneNumber, state, city, address, zipCode, time, date, } = req.body;
                if (!serviceId ||
                    !fullName ||
                    !email ||
                    !phoneNumber ||
                    !state ||
                    !city ||
                    !address ||
                    !zipCode ||
                    !time ||
                    !date) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                const service = yield service_1.Service.findById(serviceId);
                if (!service) {
                    return res.status(404).json({ message: "Service not found" });
                }
                const booking = new booking_1.Booking(req.body);
                yield booking.save();
                if (userId) {
                    const user = yield user_1.User.findById(userId);
                    if (user) {
                        user.bookings = user.bookings || [];
                        user.bookings.push(booking._id);
                        yield user.save();
                    }
                }
                const bookingConfirmationHtml = (0, renderTemplate_1.renderTemplate)("booking-confirmation.html", {
                    fullName,
                    bookingId: booking.bookingId,
                    serviceName: service.name,
                    date,
                    time,
                });
                yield (0, nodemailer_1.sendEmail)(email, "Booking Confirmation", bookingConfirmationHtml);
                // Notify admin of the new booking
                const newBookingNotificationHtml = (0, renderTemplate_1.renderTemplate)("new-booking-notification.html", {
                    bookingId: booking.bookingId,
                    fullName,
                    serviceName: service.name,
                    date,
                    time,
                    email,
                    phoneNumber,
                });
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    yield (0, nodemailer_1.sendEmail)(adminEmail, "New Booking Notification", newBookingNotificationHtml);
                }
                return res.status(201).json(booking);
            }
            catch (error) {
                console.error("Error creating booking:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield booking_1.Booking.find().populate("serviceId").exec();
                return res.status(200).json(bookings);
            }
            catch (error) {
                console.error("Error finding bookings:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const booking = yield booking_1.Booking.findById(id).populate("serviceId").exec();
                if (booking) {
                    return res.status(200).json(booking);
                }
                else {
                    return res.status(404).json({ message: "Booking not found" });
                }
            }
            catch (error) {
                console.error("Error finding booking:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findBookingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const booking = yield booking_1.Booking.findOne({ bookingId: id })
                    .populate("serviceId")
                    .exec();
                if (!booking) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                return res.status(200).json(booking);
            }
            catch (error) {
                console.error("Error finding booking:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { serviceId, fullName, email, phoneNumber, state, city, address, zipCode, } = req.body;
                const booking = yield booking_1.Booking.findById(id);
                if (!booking) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                if (serviceId) {
                    const service = yield service_1.Service.findById(serviceId);
                    if (!service) {
                        return res.status(404).json({ message: "Service not found" });
                    }
                    booking.serviceId = serviceId;
                }
                booking.fullName = fullName !== null && fullName !== void 0 ? fullName : booking.fullName;
                booking.email = email !== null && email !== void 0 ? email : booking.email;
                booking.phoneNumber = phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : booking.phoneNumber;
                booking.state = state !== null && state !== void 0 ? state : booking.state;
                booking.city = city !== null && city !== void 0 ? city : booking.city;
                booking.address = address !== null && address !== void 0 ? address : booking.address;
                booking.zipCode = zipCode !== null && zipCode !== void 0 ? zipCode : booking.zipCode;
                yield booking.save();
                return res.status(200).json(booking);
            }
            catch (error) {
                console.error("Error updating booking:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const booking = yield booking_1.Booking.findById(id);
                if (!booking) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                yield booking.deleteOne();
                return res.status(204).send();
            }
            catch (error) {
                console.error("Error deleting booking:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.BookingController = BookingController;
