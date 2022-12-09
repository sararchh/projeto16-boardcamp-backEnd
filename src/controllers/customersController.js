import connectDB from '../database/database.js';

const db = await connectDB();

export default {
  findAll: async (req, res) => {
    try {
      const { cpf } = req.query;

      if (cpf) {
        const findOneClient = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [cpf + '%']);
        return res.status(200).send({ data: findOneClient.rows })
      }

      const findAllClients = await db.query(`SELECT * FROM customers`);
      return res.status(200).send({ data: findAllClients.rows });
    } catch (error) {
      return res.sendStatus(404);
    }
  },

  store: async (req, res) => {
    try {
      const { name, phone, cpf, birthday } = req.body;

      await db.query(`INSERT INTO customers (name, phone,cpf,birthday) VALUES ($1,$2,$3,$4)`, [name, phone, cpf, birthday]);

      return res.sendStatus(201);
    } catch (error) {
      return res.sendStatus(404);
    }
  },

  findById: async (req, res) => {
    try {
      const { id } = req.params;

      const response = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);

      return res.status(200).send({ data: response.rows });
    } catch (error) {
      return res.sendStatus(404);
    }
  },

  updatedOne: async (req, res) => {
    try {
      const { name, phone, cpf, birthday } = req.body;
      const { id } = req.params;

      await db.query(`UPDATE customers SET name= $1, phone= $2, cpf= $3, birthday= $4 WHERE id=$5`, [name, phone, cpf, birthday, id]);

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
};