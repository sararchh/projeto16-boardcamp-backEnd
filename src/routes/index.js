import express, { Router } from 'express';
import categoriesRouter from './categoriesRoutes.js';
import gamesRouter from './gamesRouter.js';

const routes = Router();

routes.use(categoriesRouter);
routes.use(gamesRouter);

routes.get('/', (req, res, next) => {
  return res.status(200).json({ message: "Servidor em operacao" })
});

routes.get('*', (req, res, next) => {
  return res.status(200).json({ message: "Não existe requisicao para rota solicitada!" })
})

export default routes;