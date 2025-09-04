import { Router } from "express";
const router: Router = Router();

import { signup, signin, products, getProducts, createOrder, getOrderById } from '../controllers/auth.controller';
import { validateToken } from "../libs/validateToken";

router.post('/users', signup);
router.post('/auth/login', signin);
router.post('/products',validateToken,products);
router.get('/products',getProducts);
router.post('/orders',validateToken,createOrder);
router.get('/orders/:id', validateToken, getOrderById);


export default router;