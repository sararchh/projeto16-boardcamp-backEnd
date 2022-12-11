import { Router } from 'express';

import rentalsControllers from '../controllers/rentalsControllers.js';
import { validateRentals } from '../middlewares/validateRentals.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsControllers?.findAll);
rentalsRouter.post('/rentals', [validateRentals], rentalsControllers?.store);
rentalsRouter.post('/rentals/:id/return', rentalsControllers?.returnRentals);
rentalsRouter.delete('/rentals/:id', rentalsControllers?.delete);

export default rentalsRouter;