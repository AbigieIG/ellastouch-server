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
exports.UserController = void 0;
const user_1 = require("../schemas/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, phoneNumber, email, password, state, city, address, zipCode, } = req.body;
                if (!fullName || !phoneNumber || !email || !password) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                const existingUser = yield user_1.User.findOne({ email });
                if (existingUser) {
                    return res.status(409).json({ message: "User already exists" });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = new user_1.User({
                    fullName,
                    phoneNumber,
                    email,
                    password: hashedPassword,
                    state,
                    city,
                    address,
                    zipCode,
                });
                yield user.save();
                return res.status(201).json(user);
            }
            catch (error) {
                console.error("Error creating user:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.User.find({}, "id fullName phoneNumber email state city address zipCode createdAt updatedAt")
                    .populate({
                    path: "bookings",
                    populate: {
                        path: "serviceId",
                    },
                });
                return res.status(200).json(users);
            }
            catch (error) {
                console.error("Error finding users:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield user_1.User.findById(id)
                    .populate({
                    path: "bookings",
                    populate: {
                        path: "serviceId",
                    },
                })
                    .select("id fullName phoneNumber email state city address zipCode");
                if (user) {
                    return res.status(200).json(user);
                }
                else {
                    return res.status(404).json({ message: "User not found" });
                }
            }
            catch (error) {
                console.error("Error finding user:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { fullName, phoneNumber, email, password, state, city, address, zipCode, } = req.body;
                const user = yield user_1.User.findById(id);
                if (user) {
                    user.fullName = fullName !== null && fullName !== void 0 ? fullName : user.fullName;
                    user.phoneNumber = phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : user.phoneNumber;
                    user.email = email !== null && email !== void 0 ? email : user.email;
                    if (password) {
                        user.password = yield bcrypt_1.default.hash(password, 10);
                    }
                    user.state = state !== null && state !== void 0 ? state : user.state;
                    user.city = city !== null && city !== void 0 ? city : user.city;
                    user.address = address !== null && address !== void 0 ? address : user.address;
                    user.zipCode = zipCode !== null && zipCode !== void 0 ? zipCode : user.zipCode;
                    yield user.save();
                    return res.status(200).json(user);
                }
                else {
                    return res.status(404).json({ message: "User not found" });
                }
            }
            catch (error) {
                console.error("Error updating user:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield user_1.User.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                    return res.status(204).send(); // No content
                }
                else {
                    return res.status(404).json({ message: "User not found" });
                }
            }
            catch (error) {
                console.error("Error deleting user:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static data(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const userData = yield user_1.User.findById(userId)
                    .populate({
                    path: "bookings",
                    populate: {
                        path: "serviceId",
                    },
                })
                    .select("id fullName phoneNumber email state city address zipCode");
                if (!userData) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(userData);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
}
exports.UserController = UserController;
