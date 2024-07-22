import { User } from '../models/user';

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        fullName?: string;
        phoneNumber?: string;
        email?: string;
        password?: string;
        state?: string;
        city?: string;
        address?: string;
        zipCode?: string;
      };
    }
  }
}




