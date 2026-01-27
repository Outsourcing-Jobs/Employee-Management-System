import { Department } from "../models/Department.model.js";
import { Employee } from "../models/Employee.model.js";
import { GenerateRequest } from "../models/GenerateRequest.model.js";

export const HandleCreateGenerateRequest = async (req, res) => {
  try {
    const { requesttitle, requestconent, employeeID } = req.body;

    if (!requesttitle || !requestconent || !employeeID) {
      return res.status(400).json({
        success: false,
        message: "Tất cả các trường thông tin là bắt buộc",
      });
    }

    const employee = await Employee.findOne({
      _id: employeeID,
      organizationID: req.ORGID,
    });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    const department = await Department.findOne({
      _id: employee.department,
      organizationID: req.ORGID,
    });

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phòng ban" });
    }

    const generaterequest = await GenerateRequest.findOne({
      requesttitle: requesttitle,
      requestconent: requestconent,
      employee: employeeID,
      department: employee.department,
    });

    if (generaterequest) {
      return res
        .status(409)
        .json({ success: false, message: "Yêu cầu này đã tồn tại" });
    }

    const newGenerateRequest = await GenerateRequest.create({
      requesttitle: requesttitle,
      requestconent: requestconent,
      employee: employeeID,
      department: employee.department,
      organizationID: req.ORGID,
    });

    employee.generaterequest.push(newGenerateRequest._id);
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Gửi yêu cầu thành công",
      data: newGenerateRequest,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleAllGenerateRequest = async (req, res) => {
  try {
    // 1. Trích xuất tham số từ Query Params
    const {
      status,
      employeeId,
      departmentId,
      startDate,
      endDate,
      sortBy,
      order
    } = req.query;

    // 2. Khởi tạo filter mặc định theo tổ chức
    let queryFilter = { organizationID: req.ORGID };

    // --- BỘ LỌC (FILTERS) ---

    // Lọc theo trạng thái: 'Pending', 'Approved', 'Denied'
    if (status) {
      queryFilter.status = status;
    }

    // Lọc theo nhân viên gửi yêu cầu
    if (employeeId) {
      queryFilter.employee = employeeId;
    }

    // Lọc theo phòng ban
    if (departmentId) {
      queryFilter.department = departmentId;
    }

    // Lọc theo khoảng thời gian tạo yêu cầu (createdAt)
    if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) {
        queryFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        queryFilter.createdAt.$lte = end;
      }
    }

    // --- SẮP XẾP (SORTING) ---
    let sortOptions = {};
    const sortField = sortBy || "createdAt"; // Mặc định xếp theo ngày tạo
    const sortOrder = order === "asc" ? 1 : -1; // Mặc định mới nhất lên đầu (desc)
    sortOptions[sortField] = sortOrder;

    // 3. Thực hiện truy vấn và populate dữ liệu liên quan
    const requests = await GenerateRequest.find(queryFilter)
      .populate(
        "employee department approvedby",
        "firstname lastname name email",
      )
      .sort(sortOptions);

    // 4. Trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách yêu cầu thành công",
      results: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Lỗi HandleAllGenerateRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

export const HandleGenerateRequest = async (req, res) => {
  try {
    const { requestID } = req.params;
    const request = await GenerateRequest.findOne({
      _id: requestID,
      organizationID: req.ORGID,
    }).populate("employee department", "firstname lastname name");
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu" });
    }
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin yêu cầu thành công",
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleUpdateRequestByEmployee = async (req, res) => {
  try {
    const { requestID, requesttitle, requestconent } = req.body;
    const request = await GenerateRequest.findByIdAndUpdate(
      requestID,
      { requesttitle, requestconent },
      { new: true },
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu để cập nhật",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật yêu cầu thành công",
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleUpdateRequestByHR = async (req, res) => {
  try {
    const { requestID, approvedby, status } = req.body;

    const request = await GenerateRequest.findByIdAndUpdate(
      requestID,
      { approvedby, status },
      { new: true },
    );

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái yêu cầu thành công",
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

export const HandleDeleteRequest = async (req, res) => {
  try {
    const { requestID } = req.params;
    const request = await GenerateRequest.findOne({
      _id: requestID,
      organizationID: req.ORGID,
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu để xóa" });
    }

    const employee = await Employee.findById(request.employee);

    const index = employee.generaterequest.indexOf(requestID);
    employee.generaterequest.splice(index, 1);
    await employee.save();

    await request.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Xóa yêu cầu thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};
