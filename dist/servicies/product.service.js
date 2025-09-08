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
exports.getProductsService = exports.createProductService = void 0;
const products_1 = __importDefault(require("../models/products"));
const user_1 = __importDefault(require("../models/user"));
const createProductService = (userId, productData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(userId);
    if (!user)
        throw new Error('Unauthorized');
    if (user.role !== 'admin')
        throw new Error('Access denied: Only admin can create products');
    const newProduct = new products_1.default(productData);
    return yield newProduct.save();
});
exports.createProductService = createProductService;
const getProductsService = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const products = yield products_1.default.find().skip(skip).limit(limit);
    const total = yield products_1.default.countDocuments();
    return {
        total,
        page,
        pages: Math.ceil(total / limit),
        products,
    };
});
exports.getProductsService = getProductsService;
//# sourceMappingURL=product.service.js.map