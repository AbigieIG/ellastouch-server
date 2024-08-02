"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = (0, express_1.Router)();
router.get("/address", admin_1.AdminController.find);
router.get("/admin", jwt_1.default, admin_1.AdminController.me);
router.post("/admin", jwt_1.default, admin_1.AdminController.create);
router.put("/admin", jwt_1.default, admin_1.AdminController.update);
router.post("/admin/login", admin_1.AdminController.login);
router.post("/logout", admin_1.AdminController.logout);
exports.default = router;
