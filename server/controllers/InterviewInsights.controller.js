import { Interviewinsight } from "../models/InterviewInsights.model.js"

export const HandleCreateInterview = async (req, res) => {
    try {
        const { applicantID, interviewerID } = req.body

        if (!applicantID || !interviewerID) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const interview = await Interviewinsight.findOne({ applicant: applicantID, organizationID: req.ORGID })

        if (interview) {
            return res.status(409).json({ success: false, message: "Bản ghi phỏng vấn cho ứng viên này đã tồn tại" })
        }

        const newInterview = await Interviewinsight.create({
            applicant: applicantID,
            interviewer: interviewerID,
            organizationID: req.ORGID
        })

        return res.status(201).json({ success: true, message: "Tạo bản ghi phỏng vấn thành công", data: newInterview })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleAllInterviews = async (req, res) => {
    try {
        const interviews = await Interviewinsight.find({ organizationID: req.ORGID }).populate("applicant interviewer", "firstname lastname email")
        return res.status(200).json({ success: true, message: "Lấy danh sách bản ghi phỏng vấn thành công", data: interviews })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleInterview = async (req, res) => {
    try {
        const { interviewID } = req.params
        const interview = await Interviewinsight.findOne({ _id: interviewID, organizationID: req.ORGID }).populate("applicant interviewer", "firstname lastname email")

        if (!interview) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi phỏng vấn" })
        }

        return res.status(200).json({ success: true, message: "Lấy thông tin bản ghi phỏng vấn thành công", data: interview })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleUpdateInterview = async (req, res) => {
    try {
        const { interviewID, UpdatedData } = req.body
        const interview = await Interviewinsight.findByIdAndUpdate(interviewID, UpdatedData, { new: true })
        if (!interview) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi phỏng vấn để cập nhật" })
        }
        return res.status(200).json({ success: true, message: "Cập nhật bản ghi phỏng vấn thành công", data: interview })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleDeleteInterview = async (req, res) => {
    try {
        const { interviewID } = req.params
        const interview = await Interviewinsight.findByIdAndDelete(interviewID)
        if (!interview) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi phỏng vấn để xóa" })
        }
        return res.status(200).json({ success: true, message: "Xóa bản ghi phỏng vấn thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}