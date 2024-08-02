import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  admin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET! as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: JwtPayload | string | undefined
    ) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to authenticate token" });
      }

      if (typeof decoded === "object" && decoded !== null) {
        req.user = decoded as DecodedToken;
      } else {
        return res
          .status(500)
          .json({ message: "Failed to authenticate token" });
      }

      next();
    }
  );
};

export default verifyToken;
