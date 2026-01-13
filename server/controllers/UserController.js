import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import Resume from "../models/Resume.js";

config();
const generateToken = (userId) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1d'});
        return token;
    } catch (error) {
        return null;
    }
}

export const registeredUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({
                success : false,
                message : "All fields required!"
            });
        }

            
        const user = await User.findOne({email});

        if(user){
            return res.json({
                success : false,
                message : "User already exist!"
            });            
        }

        const hashedPassword = await bcrypt.hash(password, 11);

        const newUser = await User.create({name, email, password : hashedPassword});
        newUser.password = undefined;
        const token = generateToken(newUser._id);
        return res.json({success : true, message : 'User registration successfull!', token});
    } catch (error) {
        console.log('Error: ', error);
        return res.json({success : false, message : 'Internal server error!'});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({
                success : false,
                message : "All fields required!"
            });
        }

            
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success : false,
                message : "User not found!"
            });            
        }

        if(!user.comparePassword(password)){
            return res.json({
                success : false,
                message : "Invalid password!"
            });            
        }

        user.password = undefined;

        const token = generateToken(user._id);
        return res.json({success : true, message : 'User login successfull!', token});
    } catch (error) {
        console.log('Error: ', error);
        return res.json({success : false, message : 'Internal server error!'});
    }
}

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
            
        const user = await User.findById(userId);

        if(!user){
            return res.json({
                success : false,
                message : "User not found!"
            });            
        }

        user.password = undefined;

        const token = generateToken(user._id);
        return res.json({success : true, message : 'User fetched!', user});
    } catch (error) {
        console.log('Error: ', error);
        return res.json({success : false, message : 'Internal server error!'});
    }
}

export const getUserResume = async (req, res) => {
    try {
        const userId = req.userId;

        const resumes = await Resume.find({userId});
        
        return res.json({success : true, message : 'Resumes fetched!', resumes});
    } catch (error) {
        console.log('Error: ', error);
        return res.json({success : false, message : 'Internal server error!'});
    }
}