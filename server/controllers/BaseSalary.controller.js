import { BaseSalary } from "../models/BaseSalary.model.js"
import { Employee } from "../models/Employee.model.js"


export const HandleCreateBaseSalary = async (req, res) => {
  try {
    const { employeeID, dailyRate, currency, effectiveFrom } = req.body

    if (!employeeID || !dailyRate || !effectiveFrom) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      })
    }

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

    // ❌ Đã có base salary active
    const existed = await BaseSalary.findOne({
      employee: employeeID,
      organizationID: req.ORGID,
      effectiveTo: null
    })

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Nhân viên đã có lương cơ bản"
      })
    }

    const baseSalary = await BaseSalary.create({
      employee: employeeID,
      dailyRate,
      currency: currency || "VND",
      effectiveFrom: new Date(effectiveFrom),
      organizationID: req.ORGID
    })

    return res.status(201).json({
      success: true,
      message: "Tạo lương cơ bản thành công",
      data: baseSalary
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message
    })
  }
}

export const HandleGetBaseSalaryByEmployee = async (req, res) => {
  try {
    const { employeeID } = req.params

    const baseSalary = await BaseSalary.findOne({
      employee: employeeID,
      organizationID: req.ORGID,
      effectiveTo: null
    }).populate("employee", "firstname lastname email")

    if (!baseSalary) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên chưa có lương cơ bản"
      })
    }

    return res.status(200).json({
      success: true,
      data: baseSalary
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message
    })
  }
}

export const HandleGetAllBaseSalaries = async (req, res) => {
  try {
    const baseSalaries = await BaseSalary.find({
      organizationID: req.ORGID,
      effectiveTo: null
    }).populate("employee", "firstname lastname email")

    return res.status(200).json({
      success: true,
      data: baseSalaries
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message
    })
  }
}

export const HandleUpdateBaseSalary = async (req, res) => {
  try {
    const { employeeID } = req.params
    const { dailyRate, currency, effectiveFrom } = req.body

    if (!dailyRate || !effectiveFrom) {
      return res.status(400).json({
        success: false,
        message: "dailyRate và effectiveFrom là bắt buộc"
      })
    }

    const currentBaseSalary = await BaseSalary.findOne({
      employee: employeeID,
      organizationID: req.ORGID,
      effectiveTo: null
    })

    if (!currentBaseSalary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lương cơ bản hiện tại"
      })
    }

    // 🔒 Đóng lương cũ
    currentBaseSalary.effectiveTo = new Date()
    await currentBaseSalary.save()

    // ➕ Tạo lương mới
    const newBaseSalary = await BaseSalary.create({
      employee: employeeID,
      dailyRate,
      currency: currency || currentBaseSalary.currency,
      effectiveFrom: new Date(effectiveFrom),
      organizationID: req.ORGID
    })

    return res.status(200).json({
      success: true,
      message: "Cập nhật lương cơ bản thành công",
      data: newBaseSalary
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message
    })
  }
}

export const HandleDeleteBaseSalary = async (req, res) => {
  try {
    const { employeeID } = req.params

    const deleted = await BaseSalary.findOneAndDelete({
      employee: employeeID,
      organizationID: req.ORGID,
      effectiveTo: null
    })

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lương cơ bản để xoá"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Xoá lương cơ bản thành công"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message
    })
  }
}
