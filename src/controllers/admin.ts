import { Request, Response } from "express";
import { Admin } from "../models/admin";
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
        
      const existingUser = await Admin.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
      });

      return res.status(201).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await Admin.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, admin: user.admin },
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const admin = await Admin.findOne({ where: { id: (decoded as any).id } });
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
