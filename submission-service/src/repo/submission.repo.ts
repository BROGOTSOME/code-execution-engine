//all the action on databases -- submission schema will be govened by this file
import {ISubmission,ISubmissionData,SubmissionStatus,Submission} from "../models/submission.model";
//interface for database driven action/functions / functionality 
export interface ISubmissionRepository{
    create(submissionData:Partial<ISubmission>): Promise<ISubmission>;
    findById(id:string):Promise<ISubmission | null>;
    findByProblemId(problemId:string):Promise<ISubmission[]>;
    deleteById(id:string):Promise<boolean>;
    updateStatus(id:string,status:SubmissionStatus,submissionData:ISubmissionData):Promise<ISubmission|null>;
}
//exporting all functionality of operation we are providing in entire submission-serivce 
export class SubmissionRepository implements ISubmissionRepository{
    async create(submissionData:Partial<ISubmission>):Promise<ISubmission>{
        const newSubmission = await Submission.create(submissionData);
        return newSubmission;
    }
    async findById(id:string):Promise<ISubmission|null>{
        const submission=await Submission.findById(id);
        return submission;
    }
    async findByProblemId(problemId:string):Promise<ISubmission[]>{
        const submissions=await Submission.find({problemId});
        return submissions;
    }
    async deleteById(id: string): Promise<boolean> {
        const result = await Submission.findByIdAndDelete(id);
        return result !== null; 
    }

    async updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null> {
        const submission = await Submission.findByIdAndUpdate(id, { status, submissionData }, { new: true });
        return submission;
    }
    
}