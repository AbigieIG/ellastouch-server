import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a type for the decoded token
interface DecodedToken extends JwtPayload {
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  state?: string;
  city?: string;
  address?: string;
  zipCode?: string;
} 

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET! as string, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
// @ts-ignore
    req.user = decoded 
    next();
  });
};

export default verifyToken;
