import connectDB from '../database/database.js';
import customersSchema from "../entities/customers.js";

const db = await connectDB();

export const validateCustomers = async (req, res, next) => {
  let errorsSchema;

  await customersSchema.validate(req.body, { abortEarly: false }).catch((errors) => {
    errorsSchema = errors;
  });

  if (errorsSchema) {
    return res.status(422).send({ message: errorsSchema });
  }

  const findOneCPF = await db.query('SELECT * FROM customers WHERE cpf = $1', [req.body.cpf]);
  if (findOneCPF.rows.length > 0) {
    return res.status(409).send('Cliente já existente');
  }

  
  next();
}