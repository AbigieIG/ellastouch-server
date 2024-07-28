import { User } from "../models/user";
import { Request } from "express";




// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: any; 
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?:
        | {
            id?: string;
            fullName?: string;
            phoneNumber?: string;
            email?: string;
            password?: string;
            state?: string;
            city?: string;
            address?: string;
            zipCode?: string;
            admin?: false
          }
        | User
        | null;
    }
  }
}
