import { Request, Response } from "express";
import { Category } from "../schemas/category"; 
 

export class CategoryController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const categories = await Category.create(req.body);

      return res.status(201).json({
        message: "Categories created successfully",
        data: categories,
      });
    } catch (error) {
      console.error("Error creating categories:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await Category.find({}).populate("services");

      console.log("Retrieved categories with services:", categories);
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error retrieving categories:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }
  
  

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const category = await Category.findById(id).populate("services");

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const category = await Category.findById(id).exec();

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (title) {
        category.title = title;
        await category.save();
      }

      return res.status(200).json({
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const category = await Category.findById(id).exec();

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await category.deleteOne();

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }
}
