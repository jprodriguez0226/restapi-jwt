import { Request, Response } from 'express';
import { createOrderService, getOrderByIdService } from '../servicies/order.service';
import Product from '../models/products';
import User, {IUser} from '../models/user';
import Order from '../models/order'; 


export const createOrder = async (req: Request, res: Response) => {
  try {
    const idempotencyKey = req.header('Idempotency-Key');
    if (!idempotencyKey) return res.status(400).json({ message: 'Idempotency-Key header is required' });

    const { products } = req.body;
    const result = await createOrderService(req.userId, products, idempotencyKey);

    if ('existingOrder' in result) {
      const existingOrder = result.existingOrder;
      const orderedProducts = await Promise.all(
        existingOrder.products.map(async (item) => {
          const prod = await Product.findById(item.productId);
          return {
            name: prod ? prod.name : "Producto no encontrado",
            quantity: item.quantity,
          };
        })
      );
      return res.status(200).json({
        orderId: existingOrder._id,
        ordered: existingOrder.products.length,
        products: orderedProducts,
      });
    }

    const savedOrder = result.savedOrder;
    const orderedProducts = await Promise.all(
      savedOrder.products.map(async (item) => {
        const prod = await Product.findById(item.productId);
        return {
          name: prod ? prod.name : "Producto no encontrado",
          quantity: item.quantity,
        };
      })
    );

    res.status(201).json({
      orderId: savedOrder._id,
      ordered: savedOrder.products.length,
      products: orderedProducts,
    });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json('Unauthorized');

    const orderId = req.params.id;
    const order = await Order.findById(orderId)
        .populate('user')
        .populate({
            path: 'products.productId',
            model: 'Product'
        });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    
    if (user.role == 'customer' ) {
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
                    quantity: item.quantity
                };
            })
        )
    };
    }

    
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
                    quantity: item.quantity
                };
            })
        )
    };

    return res.json(formattedOrder);
};