import { Router } from "express";
const router: Router = Router();

import { signup, signin } from '../controllers/auth.controller';
import { createProduct, getProducts } from '../controllers/product.controller';
import { createOrder, getOrderById } from '../controllers/order.cntroller';
import { validateToken } from "../servicies/validateToken";

router.post('/users', signup);
router.post('/auth/login', signin);
router.post('/products',validateToken,createProduct);
router.get('/products',getProducts);
router.post('/orders',validateToken,createOrder);
router.get('/orders/:id', validateToken, getOrderById);


export default router;