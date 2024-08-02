"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const router = (0, express_1.Router)();
router.post('/login', login_1.AuthController.login);
router.post('/logout', login_1.AuthController.logout);
exports.default = router;
