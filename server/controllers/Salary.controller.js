import mongoose from "mongoose"
import { Attendance } from "../models/Attendance.model.js"
import { BaseSalary } from "../models/BaseSalary.model.js"
import { Employee } from "../models/Employee.model.js"
import { Salary } from "../models/Salary.model.js"

const STANDARD_HOURS = 8

const calculateWorkingDaysAndOT = (attendance, month, year, dailyRate) => {
    let workingDays = 0
    let otAmount = 0

    if (!attendance || !attendance.attendancelog) {
        return { workingDays: 0, otAmount: 0 }
    }

    attendance.attendancelog.forEach(log => {
        const logDate = new Date(log.logdate)
        const logMonth = logDate.getMonth() + 1
        const logYear = logDate.getFullYear()

        if (logMonth !== month || logYear !== year) return

        // ✅ Công
        if (log.logstatus === "Present" || log.logstatus === "Leave") {
            workingDays += 1
        }

        if (!log.checkInTime || !log.checkOutTime) return

        const checkIn = new Date(log.checkInTime)
        const checkOut = new Date(log.checkOutTime)

        const workedHours =
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)

        const otHours = workedHours - STANDARD_HOURS
        if (otHours <= 2) return

        // 💰 OT theo rule mới
        if (otHours > 2 && otHours < 4) {
            otAmount += dailyRate * 0.25
        } else if (otHours >= 4) {
            otAmount += dailyRate * 0.5
        }
    })

    return { workingDays, otAmount }
}

export const HandleCreateSalary = async (req, res) => {
    try {
        const {
            employeeID,
            duedate,
            salaryMonth,
            salaryYear
        } = req.body

        if (
            !employeeID || !duedate ||
            !salaryMonth || !salaryYear
        ) {
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

        // ✅ LẤY BASE SALARY
        const baseSalary = await BaseSalary.findOne({
            employee: employeeID,
            organizationID: req.ORGID,
            effectiveTo: null
        })

        if (!baseSalary) {
            return res.status(400).json({
                success: false,
                message: "Nhân viên chưa có lương cơ bản"
            })
        }

        const dailyRate = baseSalary.dailyRate
        const currency = baseSalary.currency

        // ✅ LẤY ATTENDANCE
        const attendance = await Attendance.findOne({
            employee: employeeID,
            organizationID: req.ORGID
        })

        const { workingDays, otAmount } =
            calculateWorkingDaysAndOT(attendance, salaryMonth, salaryYear, dailyRate)

        const basicpay = workingDays * dailyRate
        const bonuses = 0
        const deductions = (basicpay * 5) / 100

        const netpay = basicpay + bonuses + otAmount - deductions

        // ❌ Check trùng lương
        const existedSalary = await Salary.findOne({
            employee: employeeID,
            salaryMonth,
            salaryYear,
            organizationID: req.ORGID
        })

        if (existedSalary) {
            return res.status(400).json({
                success: false,
                message: "Bảng lương tháng này đã tồn tại"
            })
        }

        const salary = await Salary.create({
            employee: employeeID,
            salaryMonth,
            salaryYear,
            workingDays,
            dailyRate,
            basicpay,
            bonuses,
            deductions,
            netpay,
            currency,
            duedate: new Date(duedate),
            organizationID: req.ORGID
        })

        employee.salary.push(salary._id)
        await employee.save()

        return res.status(200).json({
            success: true,
            message: "Tạo bảng lương thành công",
            data: salary
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ nội bộ",
            error: error.message
        })
    }
}

export const HandleAllSalary = async (req, res) => {
  try {
    // 1. Trích xuất các tham số từ Query Params
    const { status, employeeId, startDate, endDate, minNet, maxNet, sortBy, order } = req.query;

    // 1. Luôn đảm bảo organizationID tồn tại và đúng kiểu
    if (!req.ORGID) {
       return res.status(400).json({ success: false, message: "Thiếu ID tổ chức" });
    }
    let queryFilter = { organizationID: req.ORGID };

    if (status) queryFilter.status = status;
    if (employeeId) queryFilter.employee = employeeId;

    // 2. Xử lý logic thời gian
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthYearConditions = [];
      let curr = new Date(start);

      while (curr <= end) {
        monthYearConditions.push({
          salaryMonth: curr.getMonth() + 1,
          salaryYear: curr.getFullYear(),
        });
        curr.setMonth(curr.getMonth() + 1);
      }

      // Thay vì gán thẳng $or, ta dùng $and để gom cụm nếu cần, 
      // nhưng gán thẳng vào queryFilter vẫn chạy nếu viết đúng:
      if (monthYearConditions.length > 0) {
        queryFilter.$or = monthYearConditions;
      }
    }

    // 3. Quan trọng: Ép kiểu Number cho Netpay
    if (minNet || maxNet) {
      queryFilter.netpay = {};
      if (minNet) queryFilter.netpay.$gte = Number(minNet);
      if (maxNet) queryFilter.netpay.$lte = Number(maxNet);
    }

    // --- Debug: Log queryFilter ra console để xem nó trông thế nào ---
    console.log("Query Filter gửi xuống DB:", JSON.stringify(queryFilter, null, 2));

    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const salaryList = await Salary.find(queryFilter)
      .populate("employee", "firstname lastname department")
      .sort({ [sortField]: sortOrder });

      console.log(`Tìm thấy ${salaryList.length} bản ghi lương phù hợp với điều kiện.`, salaryList);
    return res.status(200).json({
      success: true,
      results: salaryList.length,
      message: "Lấy danh sách lương thành công",
      data: salaryList,
    });
  } catch (error) {
    console.error("Lỗi HandleAllSalary:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Lỗi máy chủ nội bộ khi lọc danh sách lương",
    });
  }
};

export const HandleSalary = async (req, res) => {
  try {
    const { salaryID } = req.params;
    const salary = await Salary.findOne({
      _id: salaryID,
      organizationID: req.ORGID,
    }).populate("employee", "firstname lastname department");

    if (!salary) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi lương" });
    }

    return res.status(200).json({
      success: true,
      message: "Tìm thấy dữ liệu lương thành công",
      data: salary,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error, message: "Lỗi máy chủ nội bộ" });
  }
};

export const HandleUpdateSalary = async (req, res) => {
  const {
    salaryID,
    basicpay,
    bonusePT,
    deductionPT,
    duedate,
    currency,
    status,
  } = req.body;
  try {
    const bonuses = (basicpay * bonusePT) / 100;
    const deductions = (basicpay * deductionPT) / 100;
    const netpay = basicpay + bonuses - deductions;

    const salary = await Salary.findByIdAndUpdate(
      salaryID,
      {
        basicpay: basicpay,
        bonuses: bonuses,
        deductions: deductions,
        netpay: netpay,
        currency: currency,
        duedate: new Date(duedate),
        status: status,
      },
      { new: true },
    );

    if (!salary) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy bản ghi lương để cập nhật",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật bảng lương thành công",
      data: salary,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Đã có lỗi xảy ra", error: error });
  }
};

export const UpdateSalaryStatus = async (req, res) => {
  const { salaryID, status } = req.body;

  const salary = await Salary.findByIdAndUpdate(
    salaryID,
    { status },
    { new: true }
  );

  return res.json({
    success: true,
    message: "Cập nhật trạng thái thành công",
    data: salary,
  });
};

export const HandleDeleteSalary = async (req, res) => {
  try {
    const { salaryID } = req.params;
    const salary = await Salary.findOne({
      _id: salaryID,
      organizationID: req.ORGID,
    });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi lương để xóa",
      });
    }

    const employee = await Employee.findById(salary.employee);
    if (employee) {
      employee.salary.splice(employee.salary.indexOf(salaryID), 1);
      await employee.save();
    }

    await salary.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Xóa bảng lương thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
      message: "Lỗi trong quá trình xóa bản ghi",
    });
  }
};

export const HandleGetSalaryByEmployee = async (req, res) => {
  try {
    const employeeId = req.EMid;
    const { month, year } = req.query;

    let matchFilter = {
      employee: new mongoose.Types.ObjectId(employeeId),
      organizationID: new mongoose.Types.ObjectId(req.ORGID)
    };

    if (month) matchFilter.salaryMonth = Number(month);
    if (year) matchFilter.salaryYear = Number(year);

    const result = await Salary.aggregate([
      {
        $match: matchFilter
      },
      {
        $group: {
          _id: null,
          totalBasicPay: { $sum: "$basicpay" },
          totalBonuses: { $sum: "$bonuses" },
          totalDeductions: { $sum: "$deductions" },
          totalNetPay: { $sum: "$netpay" },
          totalMonths: { $sum: 1 }
        }
      }
    ]);

    const salaries = await Salary.find(matchFilter)
      .populate("employee", "firstname lastname email")
      .sort({ salaryYear: -1, salaryMonth: -1 });

    return res.status(200).json({
      success: true,
      message: "Lấy salary theo employee thành công",
      totals: result[0] || {
        totalBasicPay: 0,
        totalBonuses: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        totalMonths: 0
      },
      results: salaries.length,
      data: salaries
    });

  } catch (error) {
    console.error("Get salary employee error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};