export declare const createProductService: (userId: string, productData: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/products").IProduct, {}, {}> & import("../models/products").IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const getProductsService: (page?: number, limit?: number) => Promise<{
    total: number;
    page: number;
    pages: number;
    products: (import("mongoose").Document<unknown, {}, import("../models/products").IProduct, {}, {}> & import("../models/products").IProduct & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
}>;
//# sourceMappingURL=product.service.d.ts.map