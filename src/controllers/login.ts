import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    try {
      // Find user by email
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, admin: false },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      // Set the token in a cookie
      res.cookie("token", token, {
        httpOnly: true, // HttpOnly for security reasons
        secure: process.env.NODE_ENV === 'production', // Use 'true' in production to ensure secure cookies
        maxAge: 3600000, // 1 hour in milliseconds
      });

      return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async logout(req: Request, res: Response) {
    // Clear the token cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  }
}
