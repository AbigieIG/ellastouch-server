export interface ServiceType {
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


export interface CategoryType {
  id?: string;
  title: string;
  services?: ServiceType[];
}
export interface GalleryType {
  id?: string;
  public_id: string;
  url: string;
  category: string
}


export interface UserType {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  bookings?: BookingType[]
}
export interface AdminType {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  admin?: boolean
}
export interface BookingType {
  id?: string;
  userId: string | null;
  time: string;
  date: string;
  serviceId: string;
  bookingId?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  comment?: string;
  user?: UserType;
  service?: ServiceType;
}
