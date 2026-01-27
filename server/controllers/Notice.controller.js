import { Department } from "../models/Department.model.js";
import { Employee } from "../models/Employee.model.js";
import { HumanResources } from "../models/HR.model.js";
import { Notice } from "../models/Notice.model.js";

export const HandleCreateNotice = async (req, res) => {
  try {
    const { title, content, audience, departmentID, employeeID, HRID } =
      req.body;

    if (audience === "Department-Specific") {
      if (!title || !content || !audience || !departmentID || !HRID) {
        return res.status(404).json({
          success: false,
          message: "Vui lòng cung cấp đầy đủ tất cả các trường thông tin",
        });
      }

      const department = await Department.findById(departmentID);

      if (!department) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy phòng ban" });
      }

      const checknotice = await Notice.findOne({
        title: title,
        content: content,
        audience: audience,
        department: departmentID,
        createdby: HRID,
      });

      if (checknotice) {
        return res
          .status(400)
          .json({ success: false, message: "Thông báo cụ thể này đã tồn tại" });
      }

      const notice = await Notice.create({
        title: title,
        content: content,
        audience: audience,
        department: departmentID,
        createdby: HRID,
        organizationID: req.ORGID,
      });

      department.notice.push(notice._id);
      await department.save();

      return res.status(200).json({
        success: true,
        message: "Tạo thông báo cho phòng ban thành công",
        data: notice,
      });
    }

    if (audience === "Employee-Specific") {
      if (!title || !content || !audience || !employeeID || !HRID) {
        return res.status(404).json({
          success: false,
          message: "Vui lòng cung cấp đầy đủ tất cả các trường thông tin",
        });
      }

      const employee = await Employee.findById(employeeID);

      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy nhân viên" });
      }

      const checknotice = await Notice.findOne({
        title: title,
        content: content,
        audience: audience,
        employee: employeeID,
        createdby: HRID,
      });

      if (checknotice) {
        return res
          .status(400)
          .json({ success: false, message: "Thông báo cụ thể này đã tồn tại" });
      }

      const notice = await Notice.create({
        title: title,
        content: content,
        audience: audience,
        employee: employeeID,
        createdby: HRID,
        organizationID: req.ORGID,
      });

      employee.notice.push(notice._id);
      await employee.save();

      return res.status(200).json({
        success: true,
        message: "Tạo thông báo cho nhân viên thành công",
        data: notice,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleAllNotice = async (req, res) => {
  try {
    const {
      audience,
      departmentId,
      employeeId,
      startDate,
      endDate,
      sortBy,
      order,
      // ORGID,
    } = req.query;

    // 1. Khởi tạo filter mặc định theo tổ chức
    let queryFilter = { organizationID: req.ORGID };

    // --- BỘ LỌC (FILTERS) ---

    // Lọc theo đối tượng nhận: "Department-Specific" hoặc "Employee-Specific"
    if (audience) {
      queryFilter.audience = audience;
    }

    // Lọc theo phòng ban cụ thể
    if (departmentId) {
      queryFilter.department = departmentId;
    }

    // Lọc theo nhân viên cụ thể
    if (employeeId) {
      queryFilter.employee = employeeId;
    }

    // Lọc theo khoảng thời gian tạo thông báo
    if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) queryFilter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        queryFilter.createdAt.$lte = end;
      }
    }

    // --- SẮP XẾP (SORTING) ---
    let sortOptions = {};
    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    sortOptions[sortField] = sortOrder;

    // 2. Thực hiện truy vấn và populate thông tin liên quan
    const notices = await Notice.find(queryFilter)
      .populate(
        "employee department createdby",
        "firstname lastname name description email",
      )
      .sort(sortOptions);

    // 3. Phân loại dữ liệu trả về
    // Sử dụng .filter để tách mảng giúp code sạch và dễ đọc hơn
    const data = {
      department_notices: notices.filter(
        (n) => n.audience === "Department-Specific" || n.department,
      ),
      employee_notices: notices.filter(
        (n) => n.audience === "Employee-Specific" || n.employee,
      ),
    };

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách thông báo thành công",
      results: notices.length,
      data: data,
    });
  } catch (error) {
    console.error("Lỗi HandleAllNotice:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

export const HandleNotice = async (req, res) => {
  try {
    const { noticeID } = req.params;

    const notice = await Notice.findOne({
      _id: noticeID,
      organizationID: req.ORGID,
    });

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông báo" });
    }

    await notice.populate(
      "employee department createdby",
      "firstname lastname department name description",
    );
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết thông báo thành công",
      data: notice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleUpdateNotice = async (req, res) => {
  try {
    const { noticeID, UpdatedData } = req.body;
    const notice = await Notice.findByIdAndUpdate(noticeID, UpdatedData, {
      new: true,
    });

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông báo" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông báo thành công",
      data: notice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};

export const HandleDeleteNotice = async (req, res) => {
  try {
    const { noticeID } = req.params;

    const notice = await Notice.findById(noticeID);

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bản ghi thông báo" });
    }

    if (notice.employee) {
      const employee = await Employee.findById(notice.employee);
      if (employee) {
        employee.notice.splice(employee.notice.indexOf(noticeID), 1);
        await employee.save();
      }
      await notice.deleteOne();

      return res
        .status(200)
        .json({ success: true, message: "Xóa thông báo thành công" });
    }

    if (notice.department) {
      const department = await Department.findById(notice.department);
      if (department) {
        department.notice.splice(department.notice.indexOf(noticeID), 1);
        await department.save();
      }
      await notice.deleteOne();

      return res
        .status(200)
        .json({ success: true, message: "Xóa thông báo thành công" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ", error: error });
  }
};
