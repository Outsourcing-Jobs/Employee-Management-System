import mongoose from 'mongoose'
import { Schema } from "mongoose";

const NoticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    audience: {
        type: String,
        required: true,
        enum: ["Department-Specific", "Employee-Specific", "ALL_EMPLOYEES"]
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED'],
        default: 'PENDING'
    },
    channels: {
        type: [String],
        enum: ['mail', 'system'],
        default: ['system']
    },
    error: {
        type: String
    },
    departments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
    ],
    employee: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        }
    ],
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "HumanResources"
    },
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    }
},
    {
        timestamps: true
    });

export const Notice = mongoose.model("Notice", NoticeSchema)