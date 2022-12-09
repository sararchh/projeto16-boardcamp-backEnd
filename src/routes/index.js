import { Router } from 'express';

import categoriesRouter from './categoriesRoutes.js';
import gamesRouter from './gamesRouter.js';
import userRouter from './userRouter.js';

const routes = Router();

routes.use(categoriesRouter);
routes.use(gamesRouter);
routes.use(userRouter);

routes.get('/', (req, res, next) => {
  return res.status(200).json({ message: "Servidor em operacao" })
});

routes.get('*', (req, res, next) => {
  return res.status(200).json({ message: "Não existe requisicao para rota solicitada!" })
})

export default routes;