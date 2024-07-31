import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types/schemas';


const BookingSchema: Schema<IBooking> = new Schema(
  {
 
    bookingId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let uniqueId = "";
        for (let i = 0; i < 6; i++) {
          uniqueId += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return uniqueId;
      },
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
