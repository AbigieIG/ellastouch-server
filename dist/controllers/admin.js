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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_1 = require("../schemas/admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            try {
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const existingUser = yield admin_1.Admin.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const admin = new admin_1.Admin(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
                yield admin.save();
                return res.status(201).json(admin);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    static find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield admin_1.Admin.find({}, "bank address email instagram phoneNumber facebook twitter whatsapp");
                return res.status(200).json(users);
            }
            catch (error) {
                console.error("Error finding users:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield admin_1.Admin.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: "Invalid email" });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid password" });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, admin: user.admin }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                res.cookie("token", token, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000,
                });
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    static me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.cookies;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const admin = yield admin_1.Admin.findById(decoded.id, "email bank fullName instagram phoneNumber address bank address email instagram phoneNumber facebook twitter whatsapp");
                if (!admin) {
                    return res.status(404).json({ message: "Admin not found" });
                }
                return res.status(200).json(admin);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const _c = req.body, { password } = _c, updateData = __rest(_c, ["password"]);
            try {
                const isAdmin = (_b = req.user) === null || _b === void 0 ? void 0 : _b.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const admin = yield admin_1.Admin.findById(id);
                if (!admin) {
                    return res.status(404).json({ message: "Admin not found" });
                }
                if (password) {
                    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                    updateData.password = hashedPassword;
                }
                yield admin_1.Admin.findByIdAndUpdate(id, updateData, { new: true });
                return res.status(200).json({ message: "Admin updated successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("token");
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
}
exports.AdminController = AdminController;
