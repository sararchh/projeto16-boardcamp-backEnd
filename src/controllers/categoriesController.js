import express from 'express';
import connectDB from '../database/database.js';

const db = await connectDB();

export default {
  findAll: async (req, res) => {
    try {

      const result = await db.query("SELECT * FROM categories;");

      return res.status(201).send(result.rows);

    } catch (error) {
      return res.status(404).send({ message: 'Erro ao buscar categorias, verifique!' });
    }
  },

  store: async (req, res) => {
    try {
      const { name } = req.body;

      const result = await db.query("INSERT INTO categories (name) values ($1)", [name]);

      if (result.rowCount > 0) {
        return res.status(200).send({ message: "Inserido com sucesso!" });
      }

    } catch (error) {
      return res.status(404).send({ message: 'Erro ao inserir categoria, verifique!' });
    }
  }
};