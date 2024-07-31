import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types/schemas";



const CategorySchema: Schema<ICategory> = new Schema(
  {
    title: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);




