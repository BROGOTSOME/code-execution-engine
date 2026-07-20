import {Queue} from "bullmq";
import logger from "../config/logger.config";
import { redisConfig } from "../config/redis.config";

export const submissionQueue = new Queue("submission",{
    connection: redisConfig,
        defaultJobOptions:{
            attempts:3,
            backoff:{
                type:"exponential",
                delay:1000
            }
        }
}); 
submissionQueue.on("error",(error)=>{
    logger.error(`Submission Queue Intizaition Error ${error}`);
});
submissionQueue.on("waiting",(job)=>{
    logger.info(`Submission job waiting: ${job.id}`);
});
