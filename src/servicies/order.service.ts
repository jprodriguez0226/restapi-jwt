import mongoose from 'mongoose';
import Order from '../models/order';
import Product from '../models/products';

export const createOrderService = async (userId: string, products: any[], idempotencyKey: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingOrder = await Order.findOne({ user: userId, idempotencyKey });
    if (existingOrder) {
      await session.abortTransaction();
      session.endSession();
      return { existingOrder };
    }

    const productUpdates = [];
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findOne({ name: item.name }).session(session);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Product ${item.name} not found or insufficient stock`);
      }
      product.stock -= item.quantity;
      productUpdates.push(product.save({ session }));
      orderProducts.push({ productId: product._id, quantity: item.quantity });
    }

    await Promise.all(productUpdates);

    const order = new Order({ user: userId, products: orderProducts, idempotencyKey });
    const savedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { savedOrder };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getOrderByIdService = async (userId: string, orderId: string) => {
  const order = await Order.findById(orderId)
    .populate('user')
    .populate({ path: 'products.productId', model: 'Product' });

  if (!order) throw new Error('Order not found');

  const formattedOrder = {
    orderId: order._id,
    ordered: order.products.length,
    products: await Promise.all(
      order.products.map(async (item) => {
        const prod = typeof item.productId === 'object' && 'name' in item.productId
          ? item.productId
          : await Product.findById(item.productId);
        return {
          name: prod && 'name' in prod ? (prod as any).name : "Producto no encontrado",
          quantity: item.quantity,
        };
      })
    ),
  };

  return formattedOrder;
};