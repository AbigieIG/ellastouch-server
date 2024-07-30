import { Request, Response } from "express";
import { Admin } from "../models/admin"; // Ensure this is your Mongoose model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminDto } from "../dto/index.dto";

export class AdminController {
  static async create(req: Request<{}, {}, AdminDto>, res: Response) {
    const { email, password, fullName, phoneNumber } = req.body;

    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const existingUser = await Admin.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
      });

      await admin.save();

      return res.status(201).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await Admin.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, admin: user.admin },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // set to true in production
        maxAge: 3600000, // 1 hour in milliseconds
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async me(req: Request, res: Response) {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      return res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  }
}
