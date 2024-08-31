import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.js';
import recipeRouter from './routes/recipe.js';
import difficultyRouter from './routes/difficulty.js'; 
import categoryRouter from './routes/category.js'
import cuisineRouter from './routes/cuisine.js'
import reviewRouter from './routes/review.js'

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/reviewimg', express.static(path.join(__dirname, 'reviewimg')));

app.use('/api', userRouter);
app.use('/api', recipeRouter);
app.use('/api', difficultyRouter);
app.use('/api', categoryRouter);
app.use('/api', cuisineRouter);
app.use('/api', reviewRouter);

mongoose.connect("mongodb+srv://nandwanalakshta08:hNevLaTlq39HYUay@cluster0.hem3nqe.mongodb.net/", {
  dbName: "MERN_Recipe_You_tube",
})
.then(() => console.log("MongoDB Is Connected...!!"))
.catch((err) => console.log(err.message));

const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));






//username- nandwanalakshta08
//password- hNevLaTlq39HYUay
// uri- mongodb+srv://nandwanalakshta08:<password>@cluster0.hem3nqe.mongodb.net/
// App Password- lwpr mhsr xzqm pdze