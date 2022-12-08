import connectDB from '../database/database.js';
import gameSchema from '../entities/game.js';

const db = await connectDB();

export const validateGame = async (req, res, next) => {
  let errorsSchema;

  await gameSchema.validate(req.body, { abortEarly: false }).catch((errors) => {
    errorsSchema = errors;
  });

  if (errorsSchema) {
    return res.status(422).send({ message: errorsSchema });
  }

  const { categoryId, name } = req.body;

  const findCategory = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);

  if (findCategory.rows.length === 0) {
    return res.status(400).send({ message: 'Categoria não encontrada' })
  }

  const findNameGame = await db.query('SELECT * FROM games WHERE name = $1', [name]);

  if (findNameGame.rows.length > 0) {
    return res.status(409).send({ message: 'Jogo existente, verifique!' })
  }

  next();
}