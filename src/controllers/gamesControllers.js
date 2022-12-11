import connectDB from '../database/database.js';

const db = await connectDB();

export default {
  findAll: async (req, res) => {
    try {
      const { name } = req.query;

      if (name) {
        const findOneGame = await db.query(`SELECT * FROM games WHERE lower(name) LIKE lower($1)`, [name + '%']);
        return res.status(200).send(findOneGame.rows);
      }

      const findAllGames = await db.query('SELECT * FROM games');

      return res.status(200).send(findAllGames.rows);
    } catch (error) {
      return res.sendStatus(404);
    }
  },

  store: async (req, res) => {
    try {
      const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

      await db.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

      return res.sendStatus(201);

    } catch (error) {
      console.log({ error });
      return res.sendStatus(404);
    }
  }
};