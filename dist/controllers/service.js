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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const service_1 = require("../schemas/service");
const category_1 = require("../schemas/category");
class ServiceController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { categoryId } = _a, serviceData = __rest(_a, ["categoryId"]);
                const existingCategory = yield category_1.Category.findById(categoryId);
                if (!existingCategory) {
                    return res.status(404).json({ message: "Category with this ID does not exist" });
                }
                const service = yield service_1.Service.create(Object.assign(Object.assign({}, serviceData), { categoryId }));
                existingCategory.services.push(service._id);
                yield existingCategory.save();
                return res.status(201).json(service);
            }
            catch (error) {
                console.error("Error creating service:", error);
                return res.status(500).json({ message: error });
            }
        });
    }
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield service_1.Service.find().populate("categoryId");
                return res.status(200).json(services);
            }
            catch (error) {
                console.error("Error finding services:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const service = yield service_1.Service.findById(id).populate("categoryId");
                if (service) {
                    return res.status(200).json(service);
                }
                else {
                    return res.status(404).json({ message: "Service not found" });
                }
            }
            catch (error) {
                console.error("Error finding service:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const { id } = req.params;
                const { name, duration, price, description, workingHours, extraCharges, terms, } = req.body;
                const service = yield service_1.Service.findById(id);
                if (service) {
                    service.name = name !== null && name !== void 0 ? name : service.name;
                    service.duration = duration !== null && duration !== void 0 ? duration : service.duration;
                    service.price = price !== null && price !== void 0 ? price : service.price;
                    service.description = description !== null && description !== void 0 ? description : service.description;
                    service.workingHours = workingHours !== null && workingHours !== void 0 ? workingHours : service.workingHours;
                    service.extraCharges = extraCharges !== null && extraCharges !== void 0 ? extraCharges : service.extraCharges;
                    service.terms = terms !== null && terms !== void 0 ? terms : service.terms;
                    yield service.save();
                    return res.status(200).json(service);
                }
                else {
                    return res.status(404).json({ message: "Service not found" });
                }
            }
            catch (error) {
                console.error("Error updating service:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isAdmin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.admin;
                if (!isAdmin) {
                    return res.status(403).json({ message: "Unauthorized" });
                }
                const { id } = req.params;
                const result = yield service_1.Service.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                    return res.status(204).send();
                }
                else {
                    return res.status(404).json({ message: "Service not found" });
                }
            }
            catch (error) {
                console.error("Error deleting service:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.ServiceController = ServiceController;
