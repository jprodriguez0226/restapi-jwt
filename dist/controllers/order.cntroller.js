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
exports.getOrderById = exports.createOrder = void 0;
const order_service_1 = require("../servicies/order.service");
const products_1 = __importDefault(require("../models/products"));
const user_1 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idempotencyKey = req.header('Idempotency-Key');
        if (!idempotencyKey)
            return res.status(400).json({ message: 'Idempotency-Key header is required' });
        const { products } = req.body;
        const result = yield (0, order_service_1.createOrderService)(req.userId, products, idempotencyKey);
        if ('existingOrder' in result) {
            const existingOrder = result.existingOrder;
            const orderedProducts = yield Promise.all(existingOrder.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const prod = yield products_1.default.findById(item.productId);
                return {
                    name: prod ? prod.name : "Producto no encontrado",
                    quantity: item.quantity,
                };
            })));
            return res.status(200).json({
                orderId: existingOrder._id,
                ordered: existingOrder.products.length,
                products: orderedProducts,
            });
        }
        const savedOrder = result.savedOrder;
        const orderedProducts = yield Promise.all(savedOrder.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = yield products_1.default.findById(item.productId);
            return {
                name: prod ? prod.name : "Producto no encontrado",
                quantity: item.quantity,
            };
        })));
        res.status(201).json({
            orderId: savedOrder._id,
            ordered: savedOrder.products.length,
            products: orderedProducts,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createOrder = createOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.userId);
    if (!user)
        return res.status(401).json('Unauthorized');
    const orderId = req.params.id;
    const order = yield order_1.default.findById(orderId)
        .populate('user')
        .populate({
        path: 'products.productId',
        model: 'Product'
    });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    if (user.role == 'customer') {
        const formattedOrder = {
            orderId: order._id,
            ordered: order.products.length,
            products: yield Promise.all(order.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const prod = typeof item.productId === 'object' && 'name' in item.productId
                    ? item.productId
                    : yield products_1.default.findById(item.productId);
                return {
                    name: prod && 'name' in prod ? prod.name : "Producto no encontrado",
                    quantity: item.quantity
                };
            })))
        };
    }
    const formattedOrder = {
        orderId: order._id,
        ordered: order.products.length,
        products: yield Promise.all(order.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = typeof item.productId === 'object' && 'name' in item.productId
                ? item.productId
                : yield products_1.default.findById(item.productId);
            return {
                name: prod && 'name' in prod ? prod.name : "Producto no encontrado",
                quantity: item.quantity
            };
        })))
    };
    return res.json(formattedOrder);
});
exports.getOrderById = getOrderById;
//# sourceMappingURL=order.cntroller.js.map