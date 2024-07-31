import { Request, Response } from "express";
import { IService, Service } from "../schemas/service";
import { Category } from "../schemas/category";

export class ServiceController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, ...serviceData } = req.body;
      
      const existingCategory = await Category.findById(categoryId);
  
      if (!existingCategory) {
        return res.status(404).json({ message: "Category with this ID does not exist" });
      }

      const service = await Service.create({ ...serviceData, categoryId });
  
      existingCategory.services.push(service._id);
      await existingCategory.save();
  
      return res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      return res.status(500).json({ message: error });
    }
  }

  static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const services = await Service.find().populate("categoryId");
      return res.status(200).json(services);
    } catch (error) {
      console.error("Error finding services:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const service = await Service.findById(id).populate("categoryId");

      if (service) {
        return res.status(200).json(service);
      } else {
        return res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error("Error finding service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(
    req: Request<{ id: string }, {}, Partial<IService>>,
    res: Response
  ): Promise<Response> {
    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const {
        name,
        duration,
        price,
        description,
        workingHours,
        extraCharges,
        terms,
      } = req.body;

      const service = await Service.findById(id);

      if (service) {
        service.name = name ?? service.name;
        service.duration = duration ?? service.duration;
        service.price = price ?? service.price;
        service.description = description ?? service.description;
        service.workingHours = workingHours ?? service.workingHours;
        service.extraCharges = extraCharges ?? service.extraCharges;
        service.terms = terms ?? service.terms;

        await service.save();
        return res.status(200).json(service);
      } else {
        return res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error("Error updating service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const result = await Service.deleteOne({ _id: id });

      if (result.deletedCount > 0) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
