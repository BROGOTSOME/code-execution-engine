import mongoose from "mongoose";
import logger from "./logger.config"
import {serverConfig} from ".";

export const connectDB= async()=>{
    try{
        const dburl=serverConfig.DB_URL;
        await mongoose.connect(dburl);
        logger.info("Connected To MongoDb");

        mongoose.connection.on("error",(error)=>{
                logger.error("MongoDB Connection Error");
        });
        mongoose.connection.on("disconnected",()=>{
            logger.info("MongoDB Disconnected");
        });
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed");
            process.exit(0);
        })
        
    }
    catch(err){
        logger.error("Failed to connect to mongodb", err);
        process.exit(1);
    }
};
