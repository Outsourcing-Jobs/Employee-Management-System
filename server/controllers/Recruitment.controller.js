import { Recruitment } from "../models/Recruitment.model.js"
import { Applicant } from "../models/Applicant.model.js"

export const HandleCreateRecruitment = async (req, res) => {
    try {
        const { jobtitle, description } = req.body

        if (!jobtitle || !description) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const recruitment = await Recruitment.findOne({ jobtitle: jobtitle, organizationID: req.ORGID })

        if (recruitment) {
            return res.status(409).json({ success: false, message: "Tin tuyển dụng cho vị trí này đã tồn tại" })
        }

        const newRecruitment = await Recruitment.create({
            jobtitle,
            description,
            organizationID: req.ORGID
        })

        return res.json({ success: true, message: "Tạo tin tuyển dụng thành công", data: newRecruitment })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleAllRecruitments = async (req, res) => {
    try {
        const recruitments = await Recruitment.find({ organizationID: req.ORGID }).populate("application")
        return res.status(200).json({ success: true, message: "Lấy danh sách tin tuyển dụng thành công", data: recruitments })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleRecruitment = async (req, res) => {
    try {
        const { recruitmentID } = req.params

        if (!recruitmentID) {
            return res.status(400).json({ success: false, message: "Mã định danh tuyển dụng là bắt buộc" })
        }

        const recruitment = await Recruitment.findOne({ _id: recruitmentID, organizationID: req.ORGID }).populate("application")
        
        if (!recruitment) {
             return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng" })
        }
        
        return res.status(200).json({ success: true, message: "Lấy thông tin tuyển dụng thành công", data: recruitment })
    } catch (error) {
        return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng" })
    }
}

export const HandleUpdateRecruitment = async (req, res) => {
    try {
        const { recruitmentID, jobtitle, description, departmentID, applicationIDArray } = req.body

        if (!recruitmentID || !jobtitle || !description || !departmentID) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const recruitment = await Recruitment.findOne({ _id: recruitmentID, organizationID: req.ORGID })

        if (!recruitment) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng" })
        }

        if (applicationIDArray) {
            const applicants = recruitment.application
            const selectedApplications = []
            const rejectedApplications = []

            for (let index = 0; index < applicationIDArray.length; index++) {
                if (!applicants.includes(applicationIDArray[index])) {
                    selectedApplications.push(applicationIDArray[index])
                }
                else {
                    rejectedApplications.push(applicationIDArray[index])
                }
            }

            if (rejectedApplications.length > 0) {
                return res.status(404).json({ success: false, message: `Một số ứng viên đã tồn tại trong vị trí ${recruitment.jobtitle}`, rejectedApplications: rejectedApplications })
            }

            for (let index = 0; index < selectedApplications.length; index++) {
                applicants.push(selectedApplications[index])
            }

            await recruitment.save()
            return res.status(200).json({ success: true, message: "Cập nhật tin tuyển dụng thành công", data: recruitment })
        }

        const updatedRecruitment = await Recruitment.findByIdAndUpdate(recruitmentID, { jobtitle, description, department: departmentID }, { new: true })
        return res.status(200).json({ success: true, message: "Cập nhật tin tuyển dụng thành công", data: updatedRecruitment })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}

export const HandleDeleteRecruitment = async (req, res) => {
    try {
        const { recruitmentID } = req.params

        const recruitment = await Recruitment.findByIdAndDelete(recruitmentID)

        if (!recruitment) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng để xóa" })
        }

        return res.status(200).json({ success: true, message: "Xóa tin tuyển dụng thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error.message })
    }
}