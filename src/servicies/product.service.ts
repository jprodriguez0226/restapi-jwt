import Product from '../models/products';
import User from '../models/user';

export const createProductService = async (userId: string, productData: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Unauthorized');
  if (user.role !== 'admin') throw new Error('Access denied: Only admin can create products');

  const newProduct = new Product(productData);
  return await newProduct.save();
};

export const getProductsService = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  const total = await Product.countDocuments();

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  };
};