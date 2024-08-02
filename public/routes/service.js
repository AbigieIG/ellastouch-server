"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("../controllers/service");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = express_1.default.Router();
router.post('/services', jwt_1.default, service_1.ServiceController.create);
router.get('/services', service_1.ServiceController.findAll);
router.get('/services/:id', service_1.ServiceController.findById);
router.put('/services/:id', jwt_1.default, service_1.ServiceController.update);
router.delete('/services/:id', jwt_1.default, service_1.ServiceController.delete);
exports.default = router;
