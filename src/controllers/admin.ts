import { Request, Response } from "express";
import { Admin } from "../schemas/admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminDto } from "../dto/index.dto";

export class AdminController {
  static async create(req: Request<{}, {}, AdminDto>, res: Response) {
    const { email, password } = req.body;

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
      const admin = new Admin({ ...req.body, password: hashedPassword });

      await admin.save();

      return res.status(201).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async find(req: Request, res: Response): Promise<Response> {
    try {
      const users = await Admin.find(
        {},
        "bank address email instagram phoneNumber facebook twitter whatsapp"
      );
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error finding users:", error);
      return res.status(500).json({ message: "Internal server error" });
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
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const admin = await Admin.findById(
        decoded.id,
        "email bank fullName instagram phoneNumber address bank address email instagram phoneNumber facebook twitter whatsapp"
      );
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      return res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
  static async update(req: Request, res: Response) {
    const id = req.user?.id;
    const { password, ...updateData } = req.body;

    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      await Admin.findByIdAndUpdate(id, updateData, { new: true });

      return res.status(200).json({ message: "Admin updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  }
}
