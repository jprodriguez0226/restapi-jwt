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
exports.getOrderById = exports.createOrder = exports.getProducts = exports.products = exports.signin = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const products_1 = __importDefault(require("../models/products"));
const order_1 = __importDefault(require("../models/order")); // Debes crear este modelo
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //guardando un nuevo usuario
    const user = new user_1.default({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    user.password = yield user.encryptPassword(user.password);
    const saveUser = yield user.save();
    //token
    const token = jsonwebtoken_1.default.sign({ _id: saveUser._id }, process.env.TOKEN_SECRET || 'tokentest');
    res.header('auth-token', token).json(saveUser);
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).json('Email or password is wrong');
    const correctPassword = yield user.validatePassword(req.body.password);
    if (!correctPassword)
        return res.status(400).json('Invalid password');
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });
    res.header('auth-token', token).json(user);
});
exports.signin = signin;
const products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.userId);
    if (!user)
        return res.status(401).json('Unauthorized');
    if (user.role !== 'admin') {
        return res.status(403).json('Access denied: Only admin can create products');
    }
    ;
    if (user.role !== 'admin') {
        return res.status(403).json('Access denied: Only admin can create products');
    }
    const { sku, name, price, stock } = req.body;
    try {
        const newProduct = new products_1.default({ sku, name, price, stock });
        const savedProduct = yield newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
});
exports.products = products;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener page y limit de la query, con valores por defecto
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Consultar productos con paginación
        const products = yield products_1.default.find().skip(skip).limit(limit);
        // Contar total de productos
        const total = yield products_1.default.countDocuments();
        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
exports.getProducts = getProducts;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { products } = req.body;
        const userId = req.userId;
        const idempotencyKey = req.header('Idempotency-Key');
        if (!idempotencyKey) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Idempotency-Key header is required' });
        }
        const existingOrder = yield order_1.default.findOne({ user: userId, idempotencyKey });
        if (existingOrder) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                orderId: existingOrder._id, // Mostrar el id de la orden
                ordered: existingOrder.products.length,
                products: yield Promise.all(existingOrder.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const prod = yield products_1.default.findById(item.productId);
                    return {
                        name: prod ? prod.name : "Producto no encontrado",
                        quantity: item.quantity
                    };
                })))
            });
        }
        const productUpdates = [];
        const orderProducts = [];
        for (const item of products) {
            const product = yield products_1.default.findOne({ name: item.name }).session(session);
            if (!product) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }
            product.stock -= item.quantity;
            productUpdates.push(product.save({ session }));
            orderProducts.push({ productId: product._id, quantity: item.quantity });
        }
        yield Promise.all(productUpdates);
        const order = new order_1.default({
            user: userId,
            products: orderProducts,
            idempotencyKey
        });
        const savedOrder = yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        const orderedProducts = yield Promise.all(savedOrder.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const prod = yield products_1.default.findById(item.productId);
            return {
                name: prod ? prod.name : "Producto no encontrado",
                quantity: item.quantity
            };
        })));
        res.status(201).json({
            orderId: savedOrder._id, // Mostrar el id de la orden
            ordered: savedOrder.products.length,
            products: orderedProducts
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error creating order', error });
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
//# sourceMappingURL=auth.controller.js.map