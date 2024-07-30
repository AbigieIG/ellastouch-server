import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  title: string;
  services: mongoose.Types.ObjectId[];
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
