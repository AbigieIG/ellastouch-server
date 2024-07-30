import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from './booking'; // Import the Booking interface if needed

export interface IUser extends Document {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  bookings?: IBooking[]; // Optional if you need to populate bookings data
}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
    zipCode: {
      type: String,
      required: true,
    },
    // In Mongoose, relationships are typically handled with references
    // If you have bookings and want to populate them, you can use the ref property
    // bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
