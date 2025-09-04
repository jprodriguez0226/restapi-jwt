import { Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'customer';
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.d.ts.map