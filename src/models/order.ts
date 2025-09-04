import { Schema, model, Document, Types } from "mongoose";

export interface IOrderProduct {
    productId: Types.ObjectId;
    quantity: number;
}

export interface IOrder extends Document {
    user: Types.ObjectId;
    products: IOrderProduct[];
    idempotencyKey: string;
    createdAt: Date;
}

const orderProductSchema = new Schema<IOrderProduct>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [orderProductSchema], required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

export default model<IOrder>("Order",orderSchema);