import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../types/schemas';



const AdminSchema: Schema<IAdmin> = new Schema(
  {
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
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    whatsapp: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      default: true,
      required: true,
    },
    bank: {
      name: {
        type: String,
        required: false,
      },
      account: {
        type: Number,
        required: false,
      },
      bankName: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
