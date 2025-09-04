import { Document, Types } from "mongoose";
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
declare const _default: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=order.d.ts.map