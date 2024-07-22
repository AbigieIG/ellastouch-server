import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Service } from "./models/service";
import { Booking } from "./models/booking";
import { Category } from "./models/category";
import userRoutes from "./routes/user";
import serviceRoutes from "./routes/service";
import bookingRoutes from "./routes/booking";
import categoryRoutes from "./routes/category";
import cookieParser from "cookie-parser";
import cors from "cors";
import handleError from "./middleware/error";

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
      models: [User, Service, Booking, Category],
    });

    this.config();
    this.routes();
    this.errorHandling();
    this.start();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use("/api/v1", userRoutes);
    this.app.use("/api/v1", serviceRoutes);
    this.app.use("/api/v1", bookingRoutes);
    this.app.use("/api/v1", categoryRoutes);
    this.app.use(handleError.NotFound);
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
