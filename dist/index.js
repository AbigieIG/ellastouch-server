"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const service_1 = __importDefault(require("./routes/service"));
const booking_1 = __importDefault(require("./routes/booking"));
const category_1 = __importDefault(require("./routes/category"));
const login_1 = __importDefault(require("./routes/login"));
const admin_1 = __importDefault(require("./routes/admin"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_1 = __importDefault(require("./middleware/error"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.config();
        this.routes();
        this.errorHandling();
        this.start();
    }
    config() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((req, res, next) => {
            res.setHeader("Content-Security-Policy", "default-src 'self'; frame-src 'self' https://www.google.com; img-src 'self' data: https://res.cloudinary.com blob:; font-src 'self' data:;");
            next();
        });
        this.app.use((0, cors_1.default)({
            credentials: true,
            origin: process.env.BASE_URL,
            methods: "GET,POST,PUT,DELETE",
        }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        cloudinary_1.default.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        this.testCloudinaryConnection();
        this.connectDB();
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongoURI = process.env.MONGO_URI;
                if (!mongoURI) {
                    console.error("MongoDB URI is not defined. Please check your environment variables.");
                    process.exit(1);
                }
                yield mongoose_1.default.connect(mongoURI, {});
                console.log("MongoDB connection has been established successfully.");
            }
            catch (error) {
                console.error("Unable to connect to MongoDB:", error);
                process.exit(1);
            }
        });
    }
    testCloudinaryConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield cloudinary_1.default.v2.api.ping();
                console.log("Cloudinary connection successful:", response);
            }
            catch (error) {
                console.error("Failed to connect to Cloudinary:", error);
            }
        });
    }
    routes() {
        this.app.use("/api/v1", user_1.default);
        this.app.use("/api/v1", login_1.default);
        this.app.use("/api/v1", service_1.default);
        this.app.use("/api/v1", booking_1.default);
        this.app.use("/api/v1", category_1.default);
        this.app.use("/api/v1", gallery_1.default);
        this.app.use("/api/v1", admin_1.default);
        this.app.use("/api/v1", error_1.default.NotFound);
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
        });
    }
    errorHandling() {
        this.app.use(error_1.default.globalError);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.app.listen(this.port, () => {
                    console.log(`Server is running on http://localhost:${this.port}`);
                });
            }
            catch (error) {
                console.error("Error starting the server:", error);
            }
        });
    }
}
new Server();
