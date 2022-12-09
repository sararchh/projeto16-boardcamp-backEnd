import { Router } from 'express';
import customersController from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/validateCustomers.js';
import { validateUpdateCustomers } from '../middlewares/validateUpdateCustomers.js';

const userRouter = Router();

userRouter.get('/customers', customersController?.findAll);
userRouter.get('/customers/:id', customersController?.findById);
userRouter.post('/customers', [validateCustomers], customersController?.store);
userRouter.put('/customers/:id', [validateUpdateCustomers], customersController?.updatedOne);

export default userRouter;