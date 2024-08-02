"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = express_1.default.Router();
router.post("/categories", jwt_1.default, category_1.CategoryController.create);
router.get("/categories", category_1.CategoryController.getAll);
router.get("/categories/:id", category_1.CategoryController.getById);
router.put("/categories/:id", jwt_1.default, category_1.CategoryController.update);
router.delete("/categories/:id", jwt_1.default, category_1.CategoryController.delete);
exports.default = router;
