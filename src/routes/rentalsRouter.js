import { Router } from 'express';

import rentalsControllers from '../controllers/rentalsControllers.js';
import { validateRentals } from '../middlewares/validateRentals.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsControllers?.findAll);
rentalsRouter.post('/rentals', [validateRentals], rentalsControllers?.store);

export default rentalsRouter;