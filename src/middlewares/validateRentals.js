import connectDB from '../database/database.js';
import rentalsSchema from "../entities/rentals.js";

const db = await connectDB();

export const validateRentals = async (req, res, next) => {
  let errorsSchema;
  const { customerId, gameId, daysRented } = req.body;

  await rentalsSchema.validate(req.body, { abortEarly: false }).catch((errors) => {
    errorsSchema = errors;
  });

  if (errorsSchema) {
    return res.status(422).send({ message: errorsSchema });
  }
  
  const findClient = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
  if (findClient.rows.length === 0) {
    return res.status(400).send('Cliente inexistente');
  }

  const findGame = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
  if (findGame.rows.length === 0) {
    return res.status(400).send('Jogo inexistente');
  }

  if (daysRented <= 0) {
    return res.status(400).send('Dias inválido');
  }

  next();
}