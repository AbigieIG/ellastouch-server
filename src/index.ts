import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import serviceRoutes from "./routes/service";
import bookingRoutes from "./routes/booking";
import categoryRoutes from "./routes/category";
import authRoutes from "./routes/login";
import adminRoutes from "./routes/admin";
import galleryRoutes from "./routes/gallery";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import handleError from "./middleware/error";
import cloudinary from "cloudinary";
import path from "path";

class Server {
  public app: Express;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.config();
    this.routes();
    this.errorHandling();
    this.start();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(
      cors({
        credentials: true,
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE",
      })
    );

    this.app.use((req, res, next) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; frame-src 'self' https://www.google.com; img-src 'self' data: https://res.cloudinary.com blob:; font-src 'self' data:;"
      );
      next();
    });

    this.app.use(express.static(path.join(__dirname, "./public")));

    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.testCloudinaryConnection();

    this.connectDB();
  }

  private async connectDB(): Promise<void> {
    try {
      const mongoURI = process.env.MONGO_URI;
      if (!mongoURI) {
        console.error(
          "MongoDB URI is not defined. Please check your environment variables."
        );
        process.exit(1);
      }

      await mongoose.connect(mongoURI, {});

      console.log("MongoDB connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to MongoDB:", error);
      process.exit(1);
    }
  }

  private async testCloudinaryConnection() {
    try {
      const response = await cloudinary.v2.api.ping();
      console.log("Cloudinary connection successful:", response);
    } catch (error) {
      console.error("Failed to connect to Cloudinary:", error);
    }
  }

  private routes(): void {
    this.app.use("/api/v1", userRoutes);
    this.app.use("/api/v1", authRoutes);
    this.app.use("/api/v1", serviceRoutes);
    this.app.use("/api/v1", bookingRoutes);
    this.app.use("/api/v1", categoryRoutes);
    this.app.use("/api/v1", galleryRoutes);
    this.app.use("/api/v1", adminRoutes);
    this.app.use("/api/v1", handleError.NotFound);
    this.app.use("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
  }

  private errorHandling(): void {
    this.app.use(handleError.globalError);
  }

  private async start(): Promise<void> {
    try {
      this.app.listen(this.port, () => {
        console.log(`Server is running on http://localhost:${this.port}`);
        console.log("sdksd");
      });
    } catch (error) {
      console.error("Error starting the server:", error);
    }
  }
}

const app = new Server().app;

export default app;
