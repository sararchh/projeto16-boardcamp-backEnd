import connectDB from '../database/database.js';
import categorySchema from '../entities/category.js';

const db = await connectDB();

export const validateCategory = async (req, res, next) => {
  let errorsSchema;


  await categorySchema.validate(req.body, { abortEarly: false }).catch((errors) => {
    errorsSchema = errors;
  });

  const { name: nameCategory } = req.body;
  const result = await db.query("SELECT * FROM categories where name =$1", [nameCategory]);

  if(result.rows.length > 0){
    return res.status(409).send({ message: 'Existe uma categoria com o mesmo nome!' });
  }

  if (errorsSchema) {
    return res.status(422).send({ message: errorsSchema });
  }

  next();
}

export default validateCategory;