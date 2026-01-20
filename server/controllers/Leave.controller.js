import { Employee } from "../models/Employee.model.js"
import { HumanResources } from "../models/HR.model.js"
import { Leave } from "../models/Leave.model.js"


export const HandleCreateLeave = async (req, res) => {
    try {
        const { employeeID, startdate, enddate, title, reason } = req.body

        if (!employeeID || !startdate || !enddate || !title || !reason) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const employee = await Employee.findOne({ _id: employeeID, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }

        const checkleave = await Leave.findOne({
            employee: employeeID,
            startdate: new Date(startdate),
            enddate: new Date(enddate)
        })


        if (checkleave) {
            return res.status(400).json({ success: false, message: "Bản ghi nghỉ phép đã tồn tại cho nhân viên này" })
        }

        const leave = await Leave.create({
            employee: employeeID,
            startdate: new Date(startdate),
            enddate: new Date(enddate),
            title,
            reason,
            organizationID: req.ORGID
        })

        employee.leaverequest.push(leave._id)
        await employee.save()

        return res.status(200).json({ success: true, message: "Tạo yêu cầu nghỉ phép thành công", data: leave })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ organizationID: req.ORGID }).populate("employee approvedby", "firstname lastname department")
        return res.status(200).json({ success: true, message: "Lấy danh sách nghỉ phép thành công", data: leaves })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleLeave = async (req, res) => {
    try {
        const { leaveID } = req.params
        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID }).populate("employee approvedby", "firstname lastname department")

        if (!leave) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi nghỉ phép" })
        }

        return res.status(200).json({ success: true, message: "Lấy thông tin nghỉ phép thành công", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleUpdateLeaveByEmployee = async (req, res) => {
    try {
        const { leaveID, startdate, enddate, title, reason } = req.body

        if (!leaveID || !startdate || !enddate || !title || !reason) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })

        if (!leave) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi nghỉ phép" })
        }

        leave.startdate = new Date(startdate)
        leave.enddate = new Date(enddate)
        leave.title = title
        leave.reason = reason

        await leave.save()

        return res.status(200).json({ success: true, message: "Cập nhật yêu cầu nghỉ phép thành công", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleUpdateLeavebyHR = async (req, res) => {
    try {
        const { leaveID, status, HRID } = req.body

        if (!leaveID || !status || !HRID) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })
        const HR = await HumanResources.findById(HRID)

        if (!leave) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi nghỉ phép" })
        }

        if (!HR) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin HR" })
        }

        leave.status = status
        leave.approvedby = HRID

        await leave.save()
        return res.status(200).json({ success: true, message: "Phê duyệt nghỉ phép thành công", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleDeleteLeave = async (req, res) => {
    try {
        const { leaveID } = req.params
        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })

        if (!leave) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi nghỉ phép" })
        }

        const employee = await Employee.findById(leave.employee)
        const index = employee.leaverequest.indexOf(leaveID)
        employee.leaverequest.splice(index, 1)

        await employee.save()
        await leave.deleteOne()

        return res.status(200).json({ success: true, message: "Xóa bản ghi nghỉ phép thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}