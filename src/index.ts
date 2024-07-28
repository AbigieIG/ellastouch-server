import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Service } from "./models/service";
import { Booking } from "./models/booking";
import { Category } from "./models/category";
import { Gallery } from "./models/gallery";
import { Admin } from "./models/admin";
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
  private sequelize: Sequelize;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.sequelize = new Sequelize({
      dialect: "mysql",
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User, Service, Booking, Category, Gallery, Admin],
    });

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
    this.app.use((req, res, next) => {
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; frame-src 'self' https://www.google.com; img-src 'self' data: https://res.cloudinary.com blob:; font-src 'self' data:;"
      );
      next();
    });
    this.app.use(
      cors({
        credentials: true,
        origin: process.env.BASE_URL,
        methods: "GET,POST,PUT,DELETE",
      })
    );

    // Serve static files from the React app
    this.app.use(express.static(path.join(__dirname, "public")));

    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Check Cloudinary connection
    this.testCloudinaryConnection();
  }

  private async testCloudinaryConnection() {
    try {
      const response = await cloudinary.v2.api.ping();
      console.log("Cloudinary connection successful:", response);
    } catch (error) {
      console.error("Failed to connect to  Cloudinary:", error);
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

    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
  }

  private errorHandling(): void {
    this.app.use(handleError.globalError);
  }

  private async start(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log("Database connection has been established successfully.");

      await this.sequelize.sync({ alter: true });
      console.log("Database models have been synchronized.");

      this.app.listen(this.port, () => {
        console.log(`Server is running on http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

new Server();
