"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost:27017/mydatabase', {})
    .then(() => console.log('Base de datos conectada'))
    .catch(err => console.error(err));
//# sourceMappingURL=database.js.map