import { Employee } from "../models/Employee.model.js";
import { Salary } from "../models/Salary.model.js";

export const HandleCreateSalary = async (req, res) => {
  try {
    const { employeeID, basicpay, bonusePT, deductionPT, duedate, currency } =
      req.body;

    if (
      !employeeID ||
      !basicpay ||
      !bonusePT ||
      !deductionPT ||
      !duedate ||
      !currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Tất cả các trường thông tin là bắt buộc",
      });
    }

    const employee = await Employee.findById(employeeID);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    const bonuses = (basicpay * bonusePT) / 100;
    const deductions = (basicpay * deductionPT) / 100;
    const netpay = basicpay + bonuses - deductions;

    const salarycheck = await Salary.findOne({
      employee: employeeID,
      basicpay: basicpay,
      bonuses: bonuses,
      deductions: deductions,
      netpay: netpay,
      currency: currency,
      duedate: new Date(duedate),
    });

    if (salarycheck) {
      return res.status(400).json({
        success: false,
        message: "Bản ghi lương cụ thể này đã tồn tại cho nhân viên",
      });
    }

    const salary = await Salary.create({
      employee: employeeID,
      basicpay: basicpay,
      bonuses: bonuses,
      deductions: deductions,
      netpay: netpay,
      currency: currency,
      duedate: new Date(duedate),
      organizationID: req.ORGID,
    });

    employee.salary.push(salary._id);
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Tạo bảng lương thành công",
      data: salary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

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
      ORGID,
    } = req.query;

    // 2. Khởi tạo Object Filter mặc định với Organization ID (Bắt buộc)
    let queryFilter = { organizationID: ORGID };

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
