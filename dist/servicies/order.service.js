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
exports.getOrderByIdService = exports.createOrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../models/order"));
const products_1 = __importDefault(require("../models/products"));
const createOrderService = (userId, products, idempotencyKey) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingOrder = yield order_1.default.findOne({ user: userId, idempotencyKey });
        if (existingOrder) {
            yield session.abortTransaction();
            session.endSession();
            return { existingOrder };
        }
        const productUpdates = [];
        const orderProducts = [];
        for (const item of products) {
            const product = yield products_1.default.findOne({ name: item.name }).session(session);
            if (!product || product.stock < item.quantity) {
                throw new Error(`Product ${item.name} not found or insufficient stock`);
            }
            product.stock -= item.quantity;
            productUpdates.push(product.save({ session }));
            orderProducts.push({ productId: product._id, quantity: item.quantity });
        }
        yield Promise.all(productUpdates);
        const order = new order_1.default({ user: userId, products: orderProducts, idempotencyKey });
        const savedOrder = yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return { savedOrder };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createOrderService = createOrderService;
const getOrderByIdService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findById(orderId)
        .populate('user')
        .populate({ path: 'products.productId', model: 'Product' });
    if (!order)
        throw new Error('Order not found');
    const formattedOrder = {
        orderId: order._id,
        ordered: order.products.length,
        products: yield Promise.all(order.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = typeof item.productId === 'object' && 'name' in item.productId
                ? item.productId
                : yield products_1.default.findById(item.productId);
            return {
                name: prod && 'name' in prod ? prod.name : "Producto no encontrado",
                quantity: item.quantity,
            };
        }))),
    };
    return formattedOrder;
});
exports.getOrderByIdService = getOrderByIdService;
//# sourceMappingURL=order.service.js.map