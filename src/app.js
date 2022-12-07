import express from 'express';
import cors from 'cors';

import connectDB from './database/database.js';
import routes from './routes/index.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes); 

 await connectDB();

export default app;