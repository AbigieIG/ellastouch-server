import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid  password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, admin: false },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        httpOnly: false, 
        secure: true, // process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour in milliseconds
      });

      return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  }
}
