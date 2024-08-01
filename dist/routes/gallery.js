"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_1 = require("../controllers/gallery");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = (0, express_1.Router)();
router.post('/upload', jwt_1.default, gallery_1.GalleryController.uploadImage);
router.get('/galleries', gallery_1.GalleryController.findAll);
router.get('/galleries/:id', gallery_1.GalleryController.findById);
router.put('/galleries/:id', jwt_1.default, gallery_1.GalleryController.update);
router.delete('/galleries/:id', jwt_1.default, gallery_1.GalleryController.delete);
exports.default = router;
