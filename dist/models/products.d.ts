import { Document } from "mongoose";
export interface IProduct extends Document {
    sku: string;
    name: string;
    price: number;
    stock: number;
}
declare const _default: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=products.d.ts.map