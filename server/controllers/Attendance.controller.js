import { Attendance } from "../models/Attendance.model.js"
import { Employee } from "../models/Employee.model.js"

export const HandleInitializeAttendance = async (req, res) => {
    try {
        const { employeeID } = req.body

        const employee = await Employee.findOne({
            _id: employeeID,
            organizationID: req.ORGID
        })

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên"
            })
        }

        if (employee.attendance) {
            return res.status(400).json({
                success: false,
                message: "Attendance đã tồn tại"
            })
        }

        const newAttendance = await Attendance.create({
            employee: employeeID,
            organizationID: req.ORGID,
            status: "Not Specified",
            attendancelog: []
        })

        employee.attendance = newAttendance._id
        await employee.save()

        return res.status(201).json({
            success: true,
            message: "Khởi tạo attendance thành công",
            data: newAttendance
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ nội bộ",
            error
        })
    }
}

export const HandleAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ organizationID: req.ORGID }).populate("employee", "firstname lastname department")
        return res.status(200).json({ success: true, message: "Lấy tất cả bản ghi điểm danh thành công", data: attendance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleAttendance = async (req, res) => {
    try {
        const { attendanceID } = req.params

        if (!attendanceID) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID }).populate("employee", "firstname lastname department")

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi điểm danh" })
        }

        return res.status(200).json({ success: true, message: "Lấy chi tiết bản ghi điểm danh thành công", data: attendance })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleUpdateAttendance = async (req, res) => {
    try {
        const { currentdate } = req.body
        const employeeID = req.EMid

        // 1️⃣ Lấy employee
        const employee = await Employee.findOne({
            _id: employeeID,
            organizationID: req.ORGID
        })

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên"
            })
        }

        let attendance

        // 2️⃣ CHƯA CÓ ATTENDANCE → TẠO LUÔN
        if (!employee.attendance) {
            attendance = await Attendance.create({
                employee: employeeID,
                organizationID: req.ORGID,
                status: "Not Specified",
                attendancelog: []
            })

            employee.attendance = attendance._id
            await employee.save()
        } else {
            attendance = await Attendance.findOne({
                _id: employee.attendance,
                organizationID: req.ORGID
            })
        }

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bản ghi điểm danh"
            })
        }

        // 3️⃣ Xử lý ngày & giờ
        const today = new Date(currentdate)
        today.setHours(0, 0, 0, 0)

        const now = new Date()

        // 4️⃣ Tìm log hôm nay
        const log = attendance.attendancelog.find(item => {
            const d = new Date(item.logdate)
            d.setHours(0, 0, 0, 0)
            return d.getTime() === today.getTime()
        })

        // 5️⃣ CHECK-IN / CHECK-OUT
        if (!log) {
            // ✅ CHECK-IN
            attendance.attendancelog.push({
                logdate: today,
                logstatus: "Present",
                checkInTime: now,
                checkOutTime: null
            })
        } else if (log.checkInTime && !log.checkOutTime) {
            // ✅ CHECK-OUT
            log.checkOutTime = now
        } else {
            return res.status(400).json({
                success: false,
                message: "Hôm nay đã check-in và check-out rồi"
            })
        }

        await attendance.save()

        return res.status(200).json({
            success: true,
            message: "Chấm công thành công",
            data: attendance
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ nội bộ",
            error
        })
    }
}

export const HandleDeleteAttendance = async (req, res) => {
    try {
        const { attendanceID } = req.params
        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi điểm danh" })
        }

        const employee = await Employee.findById(attendance.employee)
        employee.attendance = null

        await employee.save()
        await attendance.deleteOne()

        return res.status(200).json({ success: true, message: "Xóa bản ghi điểm danh thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleHRChangeAttendance = async (req, res) => {
  try {
    const {
      employeeID,
      logdate,
      logstatus,
      checkInTime,
      checkOutTime
    } = req.body

    if (!employeeID || !logdate) {
      return res.status(400).json({
        success: false,
        message: "employeeID và logdate là bắt buộc"
      })
    }

    // 🔍 Tìm nhân viên
    const employee = await Employee.findOne({
      _id: employeeID,
      organizationID: req.ORGID
    })

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên"
      })
    }

    // 📁 Tìm hoặc tạo Attendance
    let attendance = await Attendance.findOne({
      employee: employeeID,
      organizationID: req.ORGID
    })

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employeeID,
        organizationID: req.ORGID,
        status: "Not Specified",
        attendancelog: []
      })

      employee.attendance = attendance._id
      await employee.save()
    }

    const targetDate = new Date(logdate)
    targetDate.setHours(0, 0, 0, 0)

    // 🔎 Tìm log theo ngày
    let log = attendance.attendancelog.find(item => {
      const d = new Date(item.logdate)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === targetDate.getTime()
    })

    // ➕ Nếu chưa có log → tạo mới
    if (!log) {
      log = {
        logdate: targetDate,
        logstatus: logstatus || "Present",
        checkInTime: checkInTime ? new Date(checkInTime) : null,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null
      }
      attendance.attendancelog.push(log)
    }
    // ✏️ Nếu có → update
    else {
      if (logstatus !== undefined) log.logstatus = logstatus
      if (checkInTime !== undefined)
        log.checkInTime = checkInTime ? new Date(checkInTime) : null
      if (checkOutTime !== undefined)
        log.checkOutTime = checkOutTime ? new Date(checkOutTime) : null
    }

    await attendance.save()

    return res.status(200).json({
      success: true,
      message: "HR cập nhật điểm danh thành công",
      data: attendance
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error
    })
  }
}
