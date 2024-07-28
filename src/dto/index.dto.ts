// src/dto/index.dto.ts

export interface UserCreateDto {
  id?: string; 
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
}

export interface ServiceDto {
  id?: string;
  name: string;
  categoryId: string; 
  duration: string;
  price: number;
  description?: string[];
  workingHours?: string[];
  extraCharges?: string[];
  terms?: string[];
}

export interface AdminDto {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  admin?: boolean
}

export interface BookingDto {
  id?: string;
  userId: string | null;
  serviceId: string;
  fullName: string;
  email: string;
  time: string;
  date: string;
  phoneNumber: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  comment?: string;
  user?:  UserCreateDto;
  service: ServiceDto; 
}

export interface CategoryDto {
  id?: string;
  title: string | string[];
  services?: ServiceDto[];
}