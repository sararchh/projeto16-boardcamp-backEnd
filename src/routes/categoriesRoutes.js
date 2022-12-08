import { Router } from 'express';

import categoriesController from '../controllers/categoriesController.js';
import validateCategory from '../middlewares/validateCategory.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', categoriesController?.findAll);
categoriesRouter.post('/categories', [validateCategory], categoriesController?.store);

export default categoriesRouter;