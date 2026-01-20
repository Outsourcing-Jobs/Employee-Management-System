import { Department } from "../models/Department.model.js" 
import { Employee } from "../models/Employee.model.js"
import { Organization } from "../models/Organization.model.js"

export const HandleAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID }).populate("department", "name").select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest isverified")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployees" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleAllEmployeesIDS = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID }).populate("department", "name").select("firstname lastname department")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployeesIDS" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleEmployeeByHR = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId, organizationID: req.ORGID }).select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest")

        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }
        
        return res.status(200).json({ success: true, data: employee, type: "GetEmployee" })
    }
    catch (error) {
        return res.status(404).json({ success: false, error: error, message: "Không tìm thấy nhân viên" }) 
    }
}

export const HandleEmployeeByEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.EMid, organizationID: req.ORGID }).select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest")

        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }

        return res.json({ success: true, message: "Lấy dữ liệu nhân viên thành công", data: employee })

    } catch (error) {
        return res.json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleEmployeeUpdate = async (req, res) => {
    try {
        const { employeeId, updatedEmployee } = req.body

        const checkeemployee = await Employee.findById(employeeId)

        if (!checkeemployee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }

        const employee = await Employee.findByIdAndUpdate(employeeId, updatedEmployee, { new: true }).select("firstname lastname email contactnumber department")
        return res.status(200).json({ success: true, message: "Cập nhật nhân viên thành công", data: employee })

    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleEmployeeDelete = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }

        const department = await Department.findById(employee.department)

        if (department) {
            department.employees.splice(department.employees.indexOf(employeeId), 1)
            await department.save()
        }

        const organization = await Organization.findById(employee.organizationID)

        if (!organization) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tổ chức" })
        }

        organization.employees.splice(organization.employees.indexOf(employeeId), 1)

        await organization.save()
        await employee.deleteOne()

        return res.status(200).json({ success: true, message: "Xóa nhân viên thành công", type : "EmployeeDelete" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi máy chủ nội bộ" })
    }
}