import Docker from "dockerode";
import logger from "../config/logger.config";
import {PYTHON_IMAGE} from "../utils/constants";

async function pullimg(img:string){
    const docker = new Docker();
    return new Promise((res,rej)=>{
       docker.pull(img,(err:Error,stream:NodeJS.ReadableStream)=>{
            if(err){
                rej(err);
                return;
            }
            docker.modem.followProgress(
                stream,
                function onFinished(finalErr,output){
                    if(finalErr) return rej(finalErr);
                    res(output)
                },
                function onProgress(event) {
                    logger.info(event.status);
                }
            );
       });
    });
}
export async function pullAllImages(){
    const images=[PYTHON_IMAGE]; // add cpp image (gcc:14) later
    const promises=images.map(image=>pullimg(image));
    try{
        await Promise.all(promises);
        logger.info("All of The neccessary Image Pulled succesfully");
    }
    catch(err){
        logger.error("Error Pulling Images",err);
    }
}