import { Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import { Gallery } from "../schemas/gallery"; 
import { v4 as uuidv4 } from "uuid";




export class GalleryController {
  private static storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "ellastouch",
      format: async (req: Request, file: Express.Multer.File) => {
        return file.mimetype.split("/")[1] || "jpg";
      },
      public_id: (req: Request, file: Express.Multer.File) => {
        const uniqueId = uuidv4();
        return uniqueId;
      },
    } as any,
  });

  private static upload = multer({ storage: GalleryController.storage }).single(
    "image"
  );

  static async uploadImage(
    req: Request,
    res: Response
  ): Promise<void | Response> {
    const isAdmin = req.user?.admin;
    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    GalleryController.upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      try {
        const newGalleryEntry = new Gallery({
          public_id: req.file.filename,
          url: req.file.path,
          category: req.body.category,
        });

        await newGalleryEntry.save();
        res.status(201).send(newGalleryEntry);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    });
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const galleries = await Gallery.find().sort({ createdAt: -1 }).exec();
      res.status(200).json(galleries);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const gallery = await Gallery.findById(req.params.id).exec();
      if (gallery) {
        res.status(200).json(gallery);
      } else {
        res.status(404).json({ message: "Gallery entry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error});
    }
  }

  static async update(req: Request, res: Response): Promise<void | Response> {
    const isAdmin = req.user?.admin;
    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    GalleryController.upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const gallery = await Gallery.findById(req.params.id).exec();
        if (!gallery) {
          return res.status(404).json({ message: "Gallery entry not found" });
        }

        if (req.file) {
          await cloudinary.v2.uploader.destroy(gallery.public_id);

          gallery.public_id = req.file.filename;
          gallery.url = req.file.path;
        }
        gallery.category = req.body.category || gallery.category;

        await gallery.save();
        res.status(200).json(gallery);
      } catch (error) {
        res.status(500).json({ error: error});
      }
    });
  }

  static async delete(req: Request, res: Response): Promise<void | Response> {
    try {
      const isAdmin = req.user?.admin;
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const gallery = await Gallery.findById(req.params.id).exec();
      if (!gallery) {
        return res.status(404).json({ message: "Gallery entry not found" });
      }

      await cloudinary.v2.uploader.destroy(gallery.public_id);

      await gallery.deleteOne();

      return res.status(204).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
