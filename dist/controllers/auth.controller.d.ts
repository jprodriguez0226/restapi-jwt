import { Request, Response } from "express";
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const signin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const products: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map