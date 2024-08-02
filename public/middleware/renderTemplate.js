"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const templatesDir = path_1.default.join(__dirname, "../templates");
const renderTemplate = (templateName, variables) => {
    const templatePath = path_1.default.join(templatesDir, templateName);
    let template = fs_1.default.readFileSync(templatePath, 'utf8');
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, variables[key]);
    });
    return template;
};
exports.renderTemplate = renderTemplate;
