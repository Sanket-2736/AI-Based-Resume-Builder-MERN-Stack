import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/' , (req, res) => {
    res.send("Api running successfully!");
});

app.listen(PORT, () => {
    console.log('App running at http://localhost:' + PORT);
});

connectDB();