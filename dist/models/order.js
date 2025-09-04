"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderProductSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
});
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [orderProductSchema], required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.js.map