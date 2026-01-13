import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if(!token){
            return res.json({success: false, message : 'User unauthenticated!'});
        }

        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('error in middleware: ', error);
    }
}

export default protect;