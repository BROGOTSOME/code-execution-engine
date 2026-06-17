import mongoose from 'mongoose';
import logger from "./logger.config";
import {serverConfig} from '.';
export const  connectDB= async()=>{
    try{
            const dburl=serverConfig.DB_URL;
            await mongoose.connect(dburl);
            logger.info("Connected to MongoDb");
        
            //event handler 
        mongoose.connection.on("error", (error) => {
            logger.error("MongoDB connection error", error);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed");
            process.exit(0);
        })
        
    }
    catch(err){
        logger.error("Failed to Connect to Database",err);
        process.exit(1);
    }
};
