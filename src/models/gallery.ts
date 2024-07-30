import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  id: string;
  public_id: string;
  category: string;
  url: string;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
