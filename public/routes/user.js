"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = (0, express_1.Router)();
router.post("/users", user_1.UserController.create);
router.get("/users", user_1.UserController.findAll);
router.get("/users/data", jwt_1.default, user_1.UserController.data);
router.get("/users/:id", user_1.UserController.findById);
router.put("/users/edit", jwt_1.default, user_1.UserController.update);
router.delete("/users/delete", jwt_1.default, user_1.UserController.delete);
exports.default = router;
