import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "./category"; // Import the Category interface if needed

export interface IService extends Document {
  name: string;
  duration: string;
  price: mongoose.Types.Decimal128;
  description: string[];
  workingHours: string[];
  extraCharges: string[];
  terms: string[];
  categoryId: mongoose.Types.ObjectId;
  category?: ICategory; // Optional if you need to populate category data
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    description: {
      type: [String], // Define arrays of strings
      required: false,
      default: [],
    },
    workingHours: {
      type: [String], // Define arrays of strings
      required: false,
      default: [],
    },
    extraCharges: {
      type: [String], // Define arrays of strings
      required: false,
      default: [],
    },
    terms: {
      type: [String], // Define arrays of strings
      required: false,
      default: [],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>("Service", ServiceSchema);
