import { Request, Response } from "express";
import { User } from "../models/user";
import { UserCreateDto } from "../dto/index.dto";
import bcrypt from "bcrypt";
import { Booking } from "../models/booking";
import { Service } from "../models/service";


export class UserController {
  static async create(
    req: Request<{}, {}, UserCreateDto>,
    res: Response
  ): Promise<Response> {
    try {
      const {
        fullName,
        phoneNumber,
        email,
        password,
        state,
        city,
        address,
        zipCode,
      } = req.body;

      if (!fullName || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
 
      const user = await User.create({
        fullName,
        phoneNumber,
        email,
        password: hashedPassword,
        state,
        city,
        address,
        zipCode,
      });
    
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: ["id", "fullName", "phoneNumber", "email", "state", "city", "address", "zipCode", "createdAt", "updatedAt"],
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error finding users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ["id", "fullName", "phoneNumber", "email", "state", "city", "address", "zipCode"],
        include: [Booking]});

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(
    req: Request<{ id: string }, {}>,
    res: Response
  ): Promise<Response> {
    try {
      
      const  id  = req.user?.id;
      const {
        fullName,
        phoneNumber,
        email,
        password,
        state,
        city,
        address,
        zipCode,
      } = req.body;

      const user = await User.findByPk(id);

      if (user) {
        user.fullName = fullName ?? user.fullName;
        user.phoneNumber = phoneNumber ?? user.phoneNumber;
        user.email = email ?? user.email;
        if (password) {
          user.password = await bcrypt.hash(password, 10);
        }
        user.state = state ?? user.state;
        user.city = city ?? user.city;
        user.address = address ?? user.address;
        user.zipCode = zipCode ?? user.zipCode;

        await user.save();
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {

      const  id  = req.user?.id;
       const user = await User.findByPk(id);

      if (user) {
        await user.destroy();
        return res.status(204).send("deleted successfully"); // No content
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
   
  static async data(req: Request, res: Response): Promise<Response> {
    try {

    
      const userId =  req.user?.id;

      const userData = await User.findByPk(userId, {
        attributes: ["id", "fullName", "phoneNumber", "email", "state", "city", "address", "zipCode"],
        include: [{
          model: Booking,
          include: [{
            model: Service
          }]
        }]
      });
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
}
