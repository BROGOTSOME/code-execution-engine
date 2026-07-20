import axios from 'axios';
import {serverConfig} from "../config/index";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export interface ITestcase{
    input:string,
    output:string
}
export interface IProblemDetails{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string; // optional field 
    testcases: ITestcase[];
    createdAt: Date;    
    updatedAt: Date;
}
export interface IProblemResponse{
    data:IProblemDetails;
    message:string;
    success:boolean;
}
export async function getProblemById(id: string): Promise<IProblemDetails | null> {
    const url = `${serverConfig.PROBLEM_SERVICE}/problems/${id}`;
    logger.info("Getting problem by ID", { url, id });

    try {
        const response = await axios.get<IProblemResponse>(url);

        if (response.data?.success) {
            return response.data.data;
        }

        // Handles the edge case where HTTP status is 200, but the API body says success: false
        logger.warn("Problem API responded but success flag was false", { 
            id, 
            responseData: response.data 
        });
        
        throw new InternalServerError("Problem API returned an unsuccessful response");

    } catch (err: unknown) {
        // 1. Handle specific Axios HTTP/Network errors
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const errorMessage = err.response?.data?.message || err.message;

            // If the problem simply doesn't exist, returning null is standard practice
            if (status === 404) {
                logger.info(`Problem not found for ID: ${id}`);
                return null; 
            }

            // For timeouts, 500s, or other network failures, log the full context
            logger.error("Axios error while fetching problem details", {
                id,
                status,
                message: errorMessage,
                url
            });

            // Throwing here allows the caller to know a system failure occurred, 
            // rather than mistakenly thinking the problem just didn't exist (null).
            throw new InternalServerError(`Failed to get problem details. API responded with status ${status || 'unknown'}`);
        }

        // 2. Handle non-Axios errors (e.g., custom errors thrown in the try block or code bugs)
    if (err instanceof InternalServerError) {
            throw err;
        }    

        logger.error("Unexpected error fetching problem details", { id, err });
        throw new InternalServerError("An unexpected error occurred while fetching problem details");
    }
}
