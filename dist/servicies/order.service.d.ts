import mongoose from 'mongoose';
export declare const createOrderService: (userId: string, products: any[], idempotencyKey: string) => Promise<{
    existingOrder: mongoose.Document<unknown, {}, import("../models/order").IOrder, {}, {}> & import("../models/order").IOrder & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
    savedOrder?: never;
} | {
    savedOrder: mongoose.Document<unknown, {}, import("../models/order").IOrder, {}, {}> & import("../models/order").IOrder & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
    existingOrder?: never;
}>;
export declare const getOrderByIdService: (userId: string, orderId: string) => Promise<{
    orderId: unknown;
    ordered: number;
    products: {
        name: any;
        quantity: number;
    }[];
}>;
//# sourceMappingURL=order.service.d.ts.map