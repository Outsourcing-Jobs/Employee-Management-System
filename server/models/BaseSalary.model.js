import mongoose from "mongoose"
import { Schema } from "mongoose"

const BaseSalarySchema = new Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
        unique: true // 🔒 1 employee chỉ có 1 lương cơ bản hiện hành
    },

    dailyRate: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        default: "VND"
    },

    effectiveFrom: {
        type: Date,
        required: true
    },

    effectiveTo: {
        type: Date,
        default: null // null = đang áp dụng
    },

    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    }
}, { timestamps: true })

export const BaseSalary = mongoose.model("BaseSalary", BaseSalarySchema)
