"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controllers/auth.controller");
const product_controller_1 = require("../controllers/product.controller");
const order_cntroller_1 = require("../controllers/order.cntroller");
const validateToken_1 = require("../servicies/validateToken");
router.post('/users', auth_controller_1.signup);
router.post('/auth/login', auth_controller_1.signin);
router.post('/products', validateToken_1.validateToken, product_controller_1.createProduct);
router.get('/products', product_controller_1.getProducts);
router.post('/orders', validateToken_1.validateToken, order_cntroller_1.createOrder);
router.get('/orders/:id', validateToken_1.validateToken, order_cntroller_1.getOrderById);
exports.default = router;
//# sourceMappingURL=auth.js.map