import { Router } from 'express';
import gamesControllers from '../controllers/gamesControllers.js';
import { validateGame } from '../middlewares/validateGame.js';

const gamesRouter = Router();

gamesRouter.get('/games', gamesControllers?.findAll);
gamesRouter.post('/games', [validateGame], gamesControllers?.store);

export default gamesRouter;