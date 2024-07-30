import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  admin: boolean;
}

const AdminSchema: Schema<IAdmin> = new Schema(
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
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
