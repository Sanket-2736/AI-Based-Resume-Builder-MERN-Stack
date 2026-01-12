import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connection successfull!');
        })

        let mongodbURI = process.env.MONGO_URI;
        const projectName = 'ai-resume-builder';

        if(!mongodbURI){
            throw new Error('Connection string not found!');
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0, -1);
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`);
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;