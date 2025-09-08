import { Request, Response } from 'express';
import { createProductService, getProductsService } from '../servicies/product.service';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const savedProduct = await createProductService(req.userId, req.body);
     res.status(201).json({
      sku: savedProduct.sku,
      name: savedProduct.name,
      price: savedProduct.price,
      stock: savedProduct.stock
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getProductsService(page, limit);

    const products = result.products.map((p: any) => ({
      sku: p.sku,
      name: p.name,
      price: p.price,
      stock: p.stock
    }));

    res.json({
      total: result.total,
      page: result.page,
      pages: result.pages,
      products
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};