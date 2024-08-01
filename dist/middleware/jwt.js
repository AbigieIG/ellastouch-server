"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
        }
        else {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        next();
    });
};
exports.default = verifyToken;
