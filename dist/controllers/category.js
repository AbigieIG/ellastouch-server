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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_1 = require("../schemas/category");
class CategoryController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const categories = yield category_1.Category.create(req.body);
                return res.status(201).json({
                    message: "Categories created successfully",
                    data: categories,
                });
            }
            catch (error) {
                console.error("Error creating categories:", error);
                return res.status(500).json({
                    message: "Internal server error",
                    error: error,
                });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_1.Category.find({}).populate("services");
                console.log("Retrieved categories with services:", categories);
                return res.status(200).json(categories);
            }
            catch (error) {
                console.error("Error retrieving categories:", error);
                return res.status(500).json({
                    message: "Internal server error",
                    error: error,
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_1.Category.findById(id).populate("services");
                if (!category) {
                    return res.status(404).json({ message: "Category not found" });
                }
                return res.status(200).json(category);
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error",
                    error: error,
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const { title } = req.body;
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const category = yield category_1.Category.findById(id).exec();
                if (!category) {
                    return res.status(404).json({ message: "Category not found" });
                }
                if (title) {
                    category.title = title;
                    yield category.save();
                }
                return res.status(200).json({
                    message: "Category updated successfully",
                    data: category,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error",
                    error: error
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const category = yield category_1.Category.findById(id).exec();
                if (!category) {
                    return res.status(404).json({ message: "Category not found" });
                }
                yield category.deleteOne();
                return res.status(200).json({
                    message: "Category deleted successfully",
                });
            }
            catch (error) {
                console.error("Error deleting category:", error);
                return res.status(500).json({
                    message: "Internal server error",
                    error: error,
                });
            }
        });
    }
}
exports.CategoryController = CategoryController;
