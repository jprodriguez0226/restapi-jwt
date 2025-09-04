import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    sku: string;
    name: string;
    price: number;
    stock: number;
}

const productSchema = new Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
});

export default model<IProduct>('Product', productSchema);