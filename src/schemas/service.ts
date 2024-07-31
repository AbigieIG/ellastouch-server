import mongoose, { Schema, Document, Types } from "mongoose";



export interface IService extends Document {
  _id?: Types.ObjectId;
  name: string;
  duration: string;
  price: number;
  description: string[];
  workingHours: string[];
  extraCharges: string[];
  terms: string[];
  categoryId: Types.ObjectId;
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: [String], default: [] },
    workingHours: { type: [String], default: [] },
    extraCharges: { type: [String], default: [] },
    terms: { type: [String], default: [] },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", ServiceSchema);
