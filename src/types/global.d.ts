// src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        fullName: string;
        phoneNumber: string;
        email: string;
        password: string;
        admin?: boolean;
      };
    }
  }
}
