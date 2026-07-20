import { Document, Schema, model } from "mongoose";
    
export enum SubmissionLanguage{
    CPP="cpp",
    PYTHON="py"
}
export enum SubmissionStatus {
    COMPLETED = "completed",
    PENDING = "pending",
}
export interface ISubmissionData{
    testcaseid:string,
    status:string,
}
export interface ISubmission extends Document{
    problemId: string;
    code: string;
    language:SubmissionLanguage;
    status: SubmissionStatus;
    submissionData: ISubmissionData;
    createdAt: Date;
    updatedAt: Date;
    id:string;
};
const SubmissionSchema= new Schema<ISubmission>({
    problemId: { 
        type: String, 
        required: [true, "Problem Id required for the submission"] 
    },
    code:{
        type:String,
        required:[true,"Blud send the code"]
    },
    language: { 
        type: String, 
        required: [true, "Language is required for evaluation"],
        enum: Object.values(SubmissionLanguage)
    },
    status: { 
        type: String, 
        required: true, 
        default: SubmissionStatus.PENDING,
        enum: Object.values(SubmissionStatus)
    },
    submissionData: {
        type: Object,
        required: true,
        default: {}
    }
},{
    timestamps: true,
    toJSON: {
        transform: (_, record) => {
            const doc = record as any;
            delete doc.__v;
            doc.id = doc._id.toString();
            delete doc._id;
            return doc;
        }
    }

});
SubmissionSchema.index({ status: 1, createdAt: -1 });

export const Submission=model<ISubmission>("Submission",SubmissionSchema);

