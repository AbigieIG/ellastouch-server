import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdmin extends Document {
    fullName: string;
    phoneNumber: string;
    email: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    facebook?: string;
    address: string;
    password: string;
    admin: boolean;
    bank?: Bank; 
  }
  
  interface Bank {
    name: string;
    account: number;
    bankName: string;
  }


  export interface IBooking extends Document {
    _id?: Types.ObjectId;
    bookingId: string;
    time: string;
    date: string;
    userId: mongoose.Types.ObjectId | null;
    serviceId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phoneNumber: string;
    state: string;
    city: string;
    address: string;
    comment: string;
    zipCode: string;
  }

  export interface ICategory extends Document {
    title: string;
    services: mongoose.Types.ObjectId[];
  }

  export interface IGallery extends Document {
    id: string;
    public_id: string;
    category: string;
    url: string;
  }

  export interface IServices extends Document {
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

  export interface IUser extends Document {
    _id?: Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    state: string;
    city: string;
    address: string;
    zipCode: string;
    user?: IUser
    bookings: Types.ObjectId[];
  }