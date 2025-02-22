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
exports.AuthController = void 0;
const user_1 = require("../schemas/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield user_1.User.findOne({ email }).exec();
                if (!user) {
                    return res.status(401).json({ message: "Invalid email" });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid password" });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, admin: false }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                return res.status(200).json({ user: user, token: token });
            }
            catch (error) {
                console.error("Error during login:", error);
                return res.status(500).json({ message: "Internal server error" });
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
exports.AuthController = AuthController;
