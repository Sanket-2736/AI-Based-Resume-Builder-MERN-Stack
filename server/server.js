import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/authRoutes.js'
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/' , (req, res) => {
    res.send("Api running successfully!");
});

app.use('/api/user', userRouter);

await connectDB();
app.listen(PORT, () => {
    console.log('App running at http://localhost:' + PORT);
});