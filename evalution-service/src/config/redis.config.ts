//todo redisConfig Vs createNewRedisConenction 
import ioredis from 'ioredis';
import logger from './logger.config';

export const redisConfig = {
    host: process.env.REDIS_HOST||"localhost",
    port: Number(process.env.REDIS_PORT)|| 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => {
        if(times > 3) {
            return null;
        }
        return Math.min(times * 100, 3000); // 3 seconds
    }
}
export const redis = new ioredis(redisConfig);

redis.on("connect",()=>{
    logger.info("Redis Connection is Made");
})
redis.on("error",(error)=>{
    logger.error("Error Redis Connection",error);
})
export const createNewRedisConnection = () => {
    return new ioredis(redisConfig);
}

