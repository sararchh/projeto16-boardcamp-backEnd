import express, { Router } from 'express';
import categoriesRouter from './categoriesRoutes.js';

const routes = Router();

routes.use(categoriesRouter);

routes.get('/', (req, res, next) => {
  return res.status(200).json({ message: "Servidor em operacao" })
});

routes.get('*', (req, res, next) => {
  return res.status(200).json({ message: "Não existe requisicao para rota solicitada!" })
})

export default routes;