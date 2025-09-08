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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.createProduct = void 0;
const product_service_1 = require("../servicies/product.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedProduct = yield (0, product_service_1.createProductService)(req.userId, req.body);
        res.status(201).json({
            sku: savedProduct.sku,
            name: savedProduct.name,
            price: savedProduct.price,
            stock: savedProduct.stock
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield (0, product_service_1.getProductsService)(page, limit);
        const products = result.products.map((p) => ({
            sku: p.sku,
            name: p.name,
            price: p.price,
            stock: p.stock
        }));
        res.json({
            total: result.total,
            page: result.page,
            pages: result.pages,
            products
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProducts = getProducts;
//# sourceMappingURL=product.controller.js.map