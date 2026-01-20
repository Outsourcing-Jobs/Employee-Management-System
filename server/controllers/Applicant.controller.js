import { Applicant } from "../models/Applicant.model.js"

export const HandleCreateApplicant = async (req, res) => {
    try {
        const { firstname, lastname, email, contactnumber, appliedrole } = req.body

        if (!firstname || !lastname || !email || !contactnumber || !appliedrole) {
            throw new Error("Tất cả các trường thông tin là bắt buộc")
        }

        const applicant = await Applicant.findOne({ email: email, organizationID: req.ORGID })

        if (applicant) {
            return res.status(409).json({ success: false, message: "Ứng viên với email này đã tồn tại trong hệ thống" })
        }

        const newApplicant = await Applicant.create({
            firstname,
            lastname,
            email,
            contactnumber,
            appliedrole,
            organizationID: req.ORGID
        })

        res.status(201).json({ success: true, message: "Tạo hồ sơ ứng viên thành công", data: newApplicant })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleAllApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find({ organizationID: req.ORGID })
        return res.status(200).json({ success: true, message: "Lấy danh sách ứng viên thành công", data: applicants })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleApplicant = async (req, res) => {
    try {
        const { applicantID } = req.params
        const applicant = await Applicant.findOne({ _id: applicantID, organizationID: req.ORGID })

        if (!applicant) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin ứng viên" })
        }

        return res.status(200).json({ success: true, message: "Tìm thấy thông tin ứng viên thành công", data: applicant })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleUpdateApplicant = async (req, res) => {
    try {
        const { applicantID, UpdatedData } = req.body
        const applicant = await Applicant.findByIdAndUpdate(applicantID, UpdatedData, { new: true })

        if (!applicant) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ứng viên để cập nhật" })
        }

        return res.status(200).json({ success: true, message: "Cập nhật hồ sơ ứng viên thành công", data: applicant })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleDeleteApplicant = async (req, res) => {
    try {
        const { applicantID } = req.params
        const deletedApplicant = await Applicant.findByIdAndDelete(applicantID)

        if (!deletedApplicant) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ứng viên để xóa" })
        }

        return res.status(200).json({ success: true, message: "Xóa hồ sơ ứng viên thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}