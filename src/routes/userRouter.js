import { Router } from 'express';
import customersController from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/validateCustomers.js';

const userRouter = Router();

userRouter.get('/customers', customersController?.findAll);
userRouter.get('/customers/:id', customersController?.findById);
userRouter.post('/customers', [validateCustomers], customersController?.store);

export default userRouter;