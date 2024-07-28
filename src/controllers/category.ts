import { Request, Response } from "express";
import { Category } from "../models/category";
import { Service } from "../models/service";
// import { CategoryDto } from "../dto/index.dto";

export class CategoryController {
  static async create(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      
       // @ts-ignore
      const isAdmin = req.user.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const category = await Category.bulkCreate(req.body);

      return res.status(201).json({
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }


  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await Category.findAll({
        include: [Service]
      });

      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error retrieving categories:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  // Get a single category by ID
  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  // Update a category by ID
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title } = req.body;

       // @ts-ignore
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const category = await Category.findByPk(id);

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
        error: error,
      });
    }
  }

  // Delete a category by ID
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
       // @ts-ignore
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await category.destroy();

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
