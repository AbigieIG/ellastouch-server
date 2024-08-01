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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("cloudinary"));
const gallery_1 = require("../schemas/gallery");
const uuid_1 = require("uuid");
class GalleryController {
    static uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const isAdmin = (_b = req.user) === null || _b === void 0 ? void 0 : _b.admin;
            if (!isAdmin) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            _a.upload(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err instanceof multer_1.default.MulterError) {
                        return res.status(500).json({ error: err.message });
                    }
                    else if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (!req.file) {
                        return res.status(400).send("No file uploaded.");
                    }
                    try {
                        const newGalleryEntry = new gallery_1.Gallery({
                            public_id: req.file.filename,
                            url: req.file.path,
                            category: req.body.category,
                        });
                        yield newGalleryEntry.save();
                        res.status(201).send(newGalleryEntry);
                    }
                    catch (error) {
                        res.status(500).json({ error: error });
                    }
                });
            });
        });
    }
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const galleries = yield gallery_1.Gallery.find().sort({ createdAt: -1 }).exec();
                res.status(200).json(galleries);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gallery = yield gallery_1.Gallery.findById(req.params.id).exec();
                if (gallery) {
                    res.status(200).json(gallery);
                }
                else {
                    res.status(404).json({ message: "Gallery entry not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const isAdmin = (_b = req.user) === null || _b === void 0 ? void 0 : _b.admin;
            if (!isAdmin) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            _a.upload(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err instanceof multer_1.default.MulterError) {
                        return res.status(500).json({ error: err.message });
                    }
                    else if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    try {
                        const gallery = yield gallery_1.Gallery.findById(req.params.id).exec();
                        if (!gallery) {
                            return res.status(404).json({ message: "Gallery entry not found" });
                        }
                        if (req.file) {
                            yield cloudinary_1.default.v2.uploader.destroy(gallery.public_id);
                            gallery.public_id = req.file.filename;
                            gallery.url = req.file.path;
                        }
                        gallery.category = req.body.category || gallery.category;
                        yield gallery.save();
                        res.status(200).json(gallery);
                    }
                    catch (error) {
                        res.status(500).json({ error: error });
                    }
                });
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const isAdmin = (_b = req.user) === null || _b === void 0 ? void 0 : _b.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const gallery = yield gallery_1.Gallery.findById(req.params.id).exec();
                if (!gallery) {
                    return res.status(404).json({ message: "Gallery entry not found" });
                }
                yield cloudinary_1.default.v2.uploader.destroy(gallery.public_id);
                yield gallery.deleteOne();
                return res.status(204).json({ message: "Deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.GalleryController = GalleryController;
_a = GalleryController;
GalleryController.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: {
        folder: "ellastouch",
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
            return file.mimetype.split("/")[1] || "jpg";
        }),
        public_id: (req, file) => {
            const uniqueId = (0, uuid_1.v4)();
            return uniqueId;
        },
    },
});
GalleryController.upload = (0, multer_1.default)({ storage: _a.storage }).single("image");
