import { Department } from "../models/Department.model.js"
import { HumanResources } from "../models/HR.model.js"
import { Organization } from "../models/Organization.model.js"

export const HandleAllHR = async (req, res) => {
    try {
        const HR = await HumanResources.find({ organizationID: req.ORGID }).populate("department")
        return res.status(200).json({ success: true, message: "Lấy danh sách nhân sự (HR) thành công", data: HR })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleHR = async (req, res) => {
    try {
        const { HRID } = req.params
        const HR = await HumanResources.findOne({ _id: HRID, organizationID: req.ORGID })

        if (!HR) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nhân sự" })
        }

        return res.status(200).json({ success: true, message: "Tìm thấy hồ sơ nhân sự thành công", data: HR })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleUpdateHR = async (req, res) => {
    try {
        const { HRID, Updatedata } = req.body

        if (!HRID || !Updatedata) {
            return res.status(400).json({ success: false, message: "Thiếu mã định danh (HRID) hoặc dữ liệu cập nhật" })
        }

        const updatedHR = await HumanResources.findByIdAndUpdate(HRID, Updatedata, { new: true })

        if (!updatedHR) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nhân sự để cập nhật" })
        }

        return res.status(200).json({ success: true, message: "Cập nhật hồ sơ nhân sự thành công", data: updatedHR })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleDeleteHR = async (req, res) => {
    try {
        const { HRID } = req.params

        const HR = await HumanResources.findOne({ _id: HRID, organizationID: req.ORGID })

        if (!HR) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nhân sự" })
        }

        if (HR.department) {
            const department = await Department.findById(HR.department)

            if (department && department.HumanResources.includes(HRID)) {
                const index = department.HumanResources.indexOf(HRID)
                department.HumanResources.splice(index, 1)
            }

            await department.save()
        }

        const organization = await Organization.findById(req.ORGID)
        if (organization) {
            const hrIndex = organization.HRs.indexOf(HRID)
            if (hrIndex > -1) {
                organization.HRs.splice(hrIndex, 1)
                await organization.save()
            }
        }

        await HR.deleteOne()
        
        return res.status(200).json({ success: true, message: "Xóa hồ sơ nhân sự thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}