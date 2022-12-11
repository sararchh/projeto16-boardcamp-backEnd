import { format, parseISO, subDays } from 'date-fns';

import connectDB from '../database/database.js';
import formattedDate from '../utils/formattedDate.js';
const db = await connectDB();

export default {
  findAll: async (req, res) => {
    try {
      const { customerId, gameId } = req.query;

      if (customerId) {
        const findAllRentalsByCustomer = await db.query(`SELECT rentals.*, 
        json_build_object('id',customers.id, 'name', customers.name) AS customer, 
        json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', games.name) AS game
          FROM rentals 
            JOIN customers
          ON rentals."customerId" = customers.id
            JOIN games
          ON rentals."gameId" = games.id
          WHERE rentals."customerId" = $1
        `, [customerId]);

        return res.status(200).send(findAllRentalsByCustomer.rows);
      }

      if (gameId) {
        const findAllRentalsById = await db.query(`SELECT rentals.*, 
        json_build_object('id',customers.id, 'name', customers.name) AS customer, 
        json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', games.name) AS game
          FROM rentals 
            JOIN customers
          ON rentals."customerId" = customers.id
            JOIN games
          ON rentals."gameId" = games.id
          WHERE rentals."gameId" = $1
        `, [gameId]);

        return res.status(200).send(findAllRentalsById.rows);
      }

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
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const rentalsExist = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
      if (rentalsExist.rows.length === 0) {
        return res.sendStatus(400);
      }

      if (rentalsExist.rows[0].returnDate === null) {
        return res.status(400).send('Aluguel não finalizado');
      }

      db.query(`DELETE FROM rentals WHERE  id = $1`, [id]);

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(400);
    }
  },

  returnRentals: async (req, res) => {
    try {
      const { id } = req.params;
      const returnDate = format(new Date(), 'yyy-MM-dd');

      const rentalsExist = await db.query(`SELECT * FROM rentals WHERE id =$1`, [id]);
      if (rentalsExist.rows.length === 0) {
        return res.status(404).send({ message: 'Aluguel não encontrado,verifique' });
      }

      const rentDate = rentalsExist.rows[0].rentDate;
      const daysRented = rentalsExist.rows[0].daysRented;
      const rentDateFormmatted = formattedDate(rentDate);

      const differenceInMilliseconds = new Date(rentDateFormmatted) - new Date(returnDate);
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      if (rentalsExist.rows[0].returnDate != null ) {
        return res.status(400).send({ message: 'Aluguel já finalizado!' })
      }

      if (Math.abs(differenceInDays) > daysRented) {
        const findGame = await db.query(`SELECT * FROM games WHERE id = $1`, [rentalsExist.rows[0].gameId]);
        const pricePerDay = findGame.rows[0].pricePerDay;

        const delayFee = pricePerDay * Math.abs(differenceInDays);

        await db.query(`UPDATE rentals SET "returnDate"=$1 , "delayFee"=$2  WHERE id=$3`, [returnDate, delayFee, id]);
        return res.sendStatus(200);
      }

      await db.query(`UPDATE rentals SET "returnDate"=$1 , "delayFee"=$2  WHERE id=$3`, [returnDate, 0, id]);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).send({ message: 'Erro ao finalizar aluguel, verifique!' })
    }
  }
}