import connectDB from '../database/database.js';
import customersSchema from "../entities/customers.js";

const db = await connectDB();

export const validateUpdateCustomers = async (req, res, next) => {
  let errorsSchema;

  await customersSchema.validate(req.body, { abortEarly: false }).catch((errors) => {
    errorsSchema = errors;
  });

  if (errorsSchema) {
    return res.status(422).send({ message: errorsSchema });
  }
  
  next();
}