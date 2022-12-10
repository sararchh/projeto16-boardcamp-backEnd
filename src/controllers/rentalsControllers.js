import { format } from 'date-fns';

import connectDB from '../database/database.js';
const db = await connectDB();

export default {
  findAll: async (req, res) => {
    try {
      const findAllGames = await db.query(`SELECT rentals.*, 
      json_build_object('id',customers.id, 'name', customers.name) AS customer, 
      json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', games.name) AS game
        FROM rentals 
          JOIN customers
        ON rentals."customerId" = customers.id
          JOIN games
        ON rentals."gameId" = games.id
      `);

      return res.status(200).send(findAllGames.rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  },

  store: async (req, res) => {
    try {
      const { customerId, gameId, daysRented } = req.body;

      const rentDate = format(new Date(), 'yyy-MM-dd');
      const returnDate = null;
      const delayFee = null;

      const findPricePerDayGame = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
      let originalPrice = (findPricePerDayGame.rows[0].pricePerDay) * daysRented;

      const findStockTotalGame = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
      let stockTotalGame = findStockTotalGame.rows[0].stockTotal;

      const findRentalsIsOpenGame = await db.query(`SELECT "daysRented" FROM rentals WHERE "gameId"=$1`, [gameId]);

      let totalRentalsIsOpeGame = 0;
      findRentalsIsOpenGame.rows.map((i) => totalRentalsIsOpeGame += (i.daysRented));

      if (totalRentalsIsOpeGame > stockTotalGame) {
        return res.status(400).send({ message: 'Estoque indisponível' });
      }

      db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee" ) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

      return res.sendStatus(201);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}