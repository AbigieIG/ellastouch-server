import mongoose, { Schema, Document } from 'mongoose';
import { IGallery } from '../types/schemas';



const GallerySchema: Schema<IGallery> = new Schema(
  {
  
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
