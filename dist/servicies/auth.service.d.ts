import { IUser } from '../models/user';
export declare const signupService: (data: IUser) => Promise<{
    user: import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
    token: string;
}>;
export declare const signinService: (email: string, password: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map