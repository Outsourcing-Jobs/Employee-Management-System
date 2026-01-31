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
    const {
      status,
      employeeId,
      startDate,
      endDate,
      minNet,
      maxNet,
      sortBy,
      order,
      // ORGID,
    } = req.query;

    // 2. Khởi tạo Object Filter mặc định với Organization ID (Bắt buộc)
    let queryFilter = { organizationID: req.ORGID };

    // --- BỘ LỌC CHI TIẾT (FILTERS) ---

    // Lọc theo trạng thái lương: Pending, Delayed, Paid
    if (status) {
      queryFilter.status = status;
    }

    // Lọc theo một nhân viên cụ thể
    if (employeeId) {
      queryFilter.employee = employeeId;
    }

    // Lọc theo khoảng thời gian tạo phiếu (createdAt)
    if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) {
        queryFilter.createdAt.$gte = new Date(startDate); // Lớn hơn hoặc bằng
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Lấy đến cuối ngày
        queryFilter.createdAt.$lte = end; // Nhỏ hơn hoặc bằng
      }
    }

    // Lọc theo khoảng lương thực lãnh (netpay)
    if (minNet || maxNet) {
      queryFilter.netpay = {};
      if (minNet) queryFilter.netpay.$gte = Number(minNet);
      if (maxNet) queryFilter.netpay.$lte = Number(maxNet);
    }

    // --- SẮP XẾP (SORTING) ---

    let sortOptions = {};
    // Các trường hỗ trợ: createdAt, netpay, duedate, basicpay
    const sortField = sortBy || "createdAt";
    // Thứ tự: asc (1) hoặc desc (-1)
    const sortOrder = order === "asc" ? 1 : -1;
    sortOptions[sortField] = sortOrder;

    // 3. Thực hiện truy vấn cơ sở dữ liệu
    const salaryList = await Salary.find(queryFilter)
      .populate("employee", "firstname lastname department") // Lấy thông tin nhân viên liên quan
      .sort(sortOptions);

    // 4. Trả về kết quả JSON
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách lương thành công",
      results: salaryList.length,
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
