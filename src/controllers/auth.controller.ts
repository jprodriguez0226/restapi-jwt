import { Request, Response } from "express";
import User, {IUser} from '../models/user';
import Product from '../models/products';
import Order from '../models/order'; // Debes crear este modelo
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


export const signup = async(req:Request,res:Response) => {
   
    //guardando un nuevo usuario
    const user: IUser = new User({  
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
    });

    user.password = await user.encryptPassword(user.password);
    const saveUser = await user.save();

    //token
    const token: string = jwt.sign({_id: saveUser._id},process.env.TOKEN_SECRET || 'tokentest');
    
    res.header('auth-token',token).json(saveUser); 

};

export const signin = async(req:Request, res:Response) => {

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json('Email or password is wrong');

    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if(!correctPassword) return res.status(400).json('Invalid password');

    const token: string = jwt.sign({_id: user._id},process.env.TOKEN_SECRET || 'tokentest',{
        expiresIn: 60 * 60 * 24
    });
    res.header('auth-token',token).json(user);

};

export const products = async (req: Request, res: Response) => {
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json('Unauthorized');

    if (user.role !== 'admin') {
        return res.status(403).json('Access denied: Only admin can create products');
    };

    
    if (user.role !== 'admin') {
        return res.status(403).json('Access denied: Only admin can create products');
    }

    
    const { sku, name, price, stock } = req.body;
    try {
        const newProduct = new Product({ sku, name, price, stock });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};



export const getProducts = async (req: Request, res: Response) => {
    try {
        // Obtener page y limit de la query, con valores por defecto
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Consultar productos con paginación
        const products = await Product.find().skip(skip).limit(limit);

        // Contar total de productos
        const total = await Product.countDocuments();

        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }  
};

export const createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { products } = req.body; 
        const userId = req.userId;
        const idempotencyKey = req.header('Idempotency-Key');

        if (!idempotencyKey) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Idempotency-Key header is required' });
        }

        const existingOrder = await Order.findOne({ user: userId, idempotencyKey });
        if (existingOrder) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                orderId: existingOrder._id, // Mostrar el id de la orden
                ordered: existingOrder.products.length,
                products: await Promise.all(
                    existingOrder.products.map(async (item) => {
                        const prod = await Product.findById(item.productId);
                        return {
                            name: prod ? prod.name : "Producto no encontrado",
                            quantity: item.quantity
                        };
                    })
                )
            });
        }

        const productUpdates = [];
        const orderProducts = [];
        for (const item of products) {
            const product = await Product.findOne({ name: item.name }).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }
            product.stock -= item.quantity;
            productUpdates.push(product.save({ session }));
            orderProducts.push({ productId: product._id, quantity: item.quantity });
        }

        await Promise.all(productUpdates);

        const order = new Order({
            user: userId,
            products: orderProducts,
            idempotencyKey
        });
        const savedOrder = await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        const orderedProducts = await Promise.all(
            savedOrder.products.map(async (item) => {
                const prod = await Product.findById(item.productId);
                return {
                    name: prod ? prod.name : "Producto no encontrado",
                    quantity: item.quantity
                };
            })
        );

        res.status(201).json({
            orderId: savedOrder._id, // Mostrar el id de la orden
            ordered: savedOrder.products.length,
            products: orderedProducts
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error creating order', error });
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

