import ExcelJS from "exceljs";
import { Salary } from "../models/Salary.model.js";
import { Employee } from "../models/Employee.model.js";
import { HumanResources } from "../models/HR.model.js";
import { Department } from "../models/Department.model.js";
import { Applicant } from "../models/Applicant.model.js";
import { Balance } from "../models/Balance.model.js";
import { Leave } from "../models/Leave.model.js";
import PDFDocument from "pdfkit-table";
import path from "path";

export const HandleExportSalaryByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year)
      return res.status(400).json({ message: "Tháng và năm là bắt buộc" });

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);

    // 1. LẤY DỮ LIỆU TỔNG HỢP THÁNG
    const summaryData = await Salary.aggregate([
      { $match: { duedate: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: null,
          totalBasic: { $sum: "$basicpay" },
          totalBonus: { $sum: "$bonuses" },
          totalDeduction: { $sum: "$deductions" },
          totalNet: { $sum: "$netpay" },
          count: { $sum: 1 },
          paid: { $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          delayed: { $sum: { $cond: [{ $eq: ["$status", "Delayed"] }, 1, 0] } },
        },
      },
    ]);

    // 2. LẤY CHI TIẾT LƯƠNG THEO TỪNG NHÂN VIÊN
    const detailedSalaries = await Salary.find({
      duedate: { $gte: start, $lt: end },
    }).populate("employee");

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(`Tháng ${month}-${year}`);

    /* ================= TIÊU ĐỀ BÁO CÁO ================= */
    ws.mergeCells("A1:H1");
    ws.getCell("A1").value = `BÁO CÁO LƯƠNG CHI TIẾT THÁNG ${month}/${year}`;
    ws.getCell("A1").font = { bold: true, size: 16 };
    ws.getCell("A1").alignment = { horizontal: "center" };

    ws.addRow(["Tổng số phiếu lương:", summaryData[0]?.count || 0]);
    ws.addRow(["Số phiếu đã thanh toán:", summaryData[0]?.paid || 0]);
    ws.addRow(["Số phiếu chưa thanh toán:", summaryData[0]?.pending || 0]);
    ws.addRow(["Số phiếu trễ hạn:", summaryData[0]?.delayed || 0]);
    ws.addRow([]);

    /* ================= BẢNG CHI TIẾT ================= */
    ws.getRow(7).values = [
      "STT",
      "Họ và tên nhân viên",
      "Lương cơ bản",
      "Tiền thưởng",
      "Khấu trừ",
      "Lương thực lãnh",
      "Trạng thái",
      "Ngày thanh toán",
    ];

    ws.getRow(7).font = { bold: true };
    ws.getRow(7).alignment = { horizontal: "center" };

    ws.columns = [
      { key: "stt", width: 6 },
      { key: "name", width: 30 },
      { key: "basic", width: 18 },
      { key: "bonus", width: 18 },
      { key: "deduction", width: 18 },
      { key: "net", width: 18 },
      { key: "status", width: 15 },
      { key: "payDate", width: 18 },
    ];

    detailedSalaries.forEach((s, index) => {
      const fullName = s.employee
        ? `${s.employee.firstname} ${s.employee.lastname}`
        : "Không xác định";

      const row = ws.addRow({
        stt: index + 1,
        name: fullName,
        basic: s.basicpay,
        bonus: s.bonuses,
        deduction: s.deductions,
        net: s.netpay,
        status:
          s.status === "Paid"
            ? "Đã thanh toán"
            : s.status === "Pending"
              ? "Chưa thanh toán"
              : "Trễ hạn",
        payDate: s.paymentdate
          ? new Date(s.paymentdate).toLocaleDateString("vi-VN")
          : "-",
      });

      // Định dạng tiền VNĐ
      [3, 4, 5, 6].forEach((colIndex) => {
        row.getCell(colIndex).numFmt = "#,##0 ₫";
      });

      row.getCell(1).alignment = { horizontal: "center" };
      row.getCell(7).alignment = { horizontal: "center" };
    });

    /* ================= DÒNG TỔNG CỘNG ================= */
    if (summaryData.length > 0) {
      const totalRow = ws.addRow({
        name: "TỔNG CỘNG",
        basic: summaryData[0].totalBasic,
        bonus: summaryData[0].totalBonus,
        deduction: summaryData[0].totalDeduction,
        net: summaryData[0].totalNet,
      });

      totalRow.font = { bold: true };
      [3, 4, 5, 6].forEach((colIndex) => {
        totalRow.getCell(colIndex).numFmt = "#,##0 ₫";
      });
    }

    /* ================= BORDER BẢNG ================= */
    ws.eachRow((row, rowNumber) => {
      if (rowNumber >= 7) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    /* ================= RESPONSE ================= */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bao_cao_luong_chi_tiet_thang_${month}_${year}.xlsx`,
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const HandleExportSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Tháng và năm là bắt buộc" });
    }

    const query = {
      duedate: {
        $gte: new Date(Number(year), Number(month) - 1, 1),
        $lt: new Date(Number(year), Number(month), 1),
      },
    };

    if (employeeId) query.employee = employeeId;

    const salaries = await Salary.find(query).populate("employee");

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Lương nhân viên");

    /* ================= TIÊU ĐỀ ================= */
    ws.mergeCells("A1:G1");
    ws.getCell("A1").value =
      `BÁO CÁO CHI TIẾT LƯƠNG NHÂN VIÊN - THÁNG ${month}/${year}`;
    ws.getCell("A1").font = { bold: true, size: 14 };
    ws.getCell("A1").alignment = { horizontal: "center" };

    /* ================= HEADER BẢNG ================= */
    ws.getRow(3).values = [
      "Họ và tên nhân viên",
      "Email",
      "Lương cơ bản",
      "Tiền thưởng",
      "Khấu trừ",
      "Lương thực lãnh",
      "Trạng thái",
    ];

    ws.getRow(3).font = { bold: true };
    ws.getRow(3).alignment = { horizontal: "center" };

    ws.columns = [
      { key: "name", width: 30 },
      { key: "email", width: 30 },
      { key: "basic", width: 18 },
      { key: "bonus", width: 18 },
      { key: "deduction", width: 18 },
      { key: "net", width: 18 },
      { key: "status", width: 18 },
    ];

    /* ================= DỮ LIỆU ================= */
    salaries.forEach((s) => {
      const fullName = s.employee
        ? `${s.employee.firstname} ${s.employee.lastname}`
        : "Không xác định";

      const row = ws.addRow({
        name: fullName,
        email: s.employee?.email || "Không có",
        basic: s.basicpay,
        bonus: s.bonuses,
        deduction: s.deductions,
        net: s.netpay,
        status:
          s.status === "Paid"
            ? "Đã thanh toán"
            : s.status === "Pending"
              ? "Chưa thanh toán"
              : "Trễ hạn",
      });

      // Định dạng tiền VNĐ
      [3, 4, 5, 6].forEach((col) => {
        row.getCell(col).numFmt = "#,##0 ₫";
      });
    });

    /* ================= RESPONSE ================= */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bao_cao_luong_nhan_vien_${month}_${year}.xlsx`,
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const HandleExportSalaryByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Năm là bắt buộc" });
    }

    const start = new Date(Number(year), 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const monthlyData = await Salary.aggregate([
      { $match: { duedate: { $gte: start, $lt: end } } },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $group: {
          _id: { month: { $month: "$duedate" } },
          totalBasic: { $sum: "$basicpay" },
          totalBonus: { $sum: "$bonuses" },
          totalDeduction: { $sum: "$deductions" },
          totalNet: { $sum: "$netpay" },
          employees: { $addToSet: "$employee._id" },
          paid: { $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          delayed: { $sum: { $cond: [{ $eq: ["$status", "Delayed"] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          employeeCount: { $size: "$employees" },
          totalBasic: 1,
          totalBonus: 1,
          totalDeduction: 1,
          totalNet: 1,
          paid: 1,
          pending: 1,
          delayed: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    /* ================= TỔNG HỢP NĂM ================= */
    const yearSummary = monthlyData.reduce(
      (acc, m) => {
        acc.basic += m.totalBasic;
        acc.bonus += m.totalBonus;
        acc.deduction += m.totalDeduction;
        acc.net += m.totalNet;
        return acc;
      },
      { basic: 0, bonus: 0, deduction: 0, net: 0 },
    );

    const wb = new ExcelJS.Workbook();

    /* ================= SHEET 1: TỔNG HỢP ================= */
    const summarySheet = wb.addWorksheet("Tổng hợp năm");

    summarySheet.mergeCells("A1:D1");
    summarySheet.getCell("A1").value = `BÁO CÁO LƯƠNG NĂM ${year}`;
    summarySheet.getCell("A1").font = { bold: true, size: 16 };
    summarySheet.getCell("A1").alignment = { horizontal: "center" };

    summarySheet.mergeCells("A2:D2");
    summarySheet.getCell("A2").value =
      `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`;
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    summarySheet.addRow([]);
    summarySheet.addRows([
      ["Tổng lương cơ bản", yearSummary.basic],
      ["Tổng tiền thưởng", yearSummary.bonus],
      ["Tổng khấu trừ", yearSummary.deduction],
      ["Tổng lương thực lãnh", yearSummary.net],
    ]);

    summarySheet.getColumn(1).width = 30;
    summarySheet.getColumn(2).width = 25;

    summarySheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        row.getCell(2).numFmt = "#,##0 ₫";
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    /* ================= SHEET 2: CHI TIẾT THEO THÁNG ================= */
    const monthSheet = wb.addWorksheet("Chi tiết theo tháng");

    monthSheet.mergeCells("A1:I1");
    monthSheet.getCell("A1").value = "BÁO CÁO LƯƠNG CHI TIẾT THEO THÁNG";
    monthSheet.getCell("A1").font = { bold: true, size: 14 };
    monthSheet.getCell("A1").alignment = { horizontal: "center" };

    monthSheet.getRow(3).values = [
      "Tháng",
      "Số nhân viên",
      "Lương cơ bản",
      "Tiền thưởng",
      "Khấu trừ",
      "Lương thực lãnh",
      "Đã thanh toán",
      "Chưa thanh toán",
      "Trễ hạn",
    ];

    monthSheet.columns = [
      { key: "month", width: 10 },
      { key: "employeeCount", width: 15 },
      { key: "totalBasic", width: 18 },
      { key: "totalBonus", width: 18 },
      { key: "totalDeduction", width: 18 },
      { key: "totalNet", width: 18 },
      { key: "paid", width: 15 },
      { key: "pending", width: 18 },
      { key: "delayed", width: 15 },
    ];

    monthSheet.getRow(3).font = { bold: true };
    monthSheet.getRow(3).alignment = { horizontal: "center" };

    monthlyData.forEach((m) => {
      const row = monthSheet.addRow(m);

      row.eachCell((cell, col) => {
        if (col >= 3 && col <= 6) {
          cell.numFmt = "#,##0 ₫";
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    /* ================= RESPONSE ================= */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bao_cao_luong_nam_${year}.xlsx`,
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const HandleExportAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Danh sách nhân viên");

    // --- PHẦN 1: TIÊU ĐỀ (Dùng Cell cụ thể để tránh bị columns ghi đè) ---
    ws.mergeCells("A1:H1");
    const titleCell = ws.getCell("A1");
    titleCell.value = "DANH SÁCH TOÀN BỘ NHÂN VIÊN"; // Gán lại giá trị chuẩn
    titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    ws.getRow(2).values = [
      `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`,
    ];

    // --- PHẦN 2: ĐỊNH NGHĨA COLUMN KEY (Không gán Header ở đây để tránh lỗi ghi đè) ---
    ws.columns = [
      { key: "stt", width: 8 },
      { key: "fullName", width: 25 },
      { key: "email", width: 30 },
      { key: "phone", width: 18 },
      { key: "role", width: 15 },
      { key: "dept", width: 25 },
      { key: "joinedDate", width: 15 },
      { key: "status", width: 15 },
    ];

    // Tự tay gán Header vào hàng 4
    const headerValues = [
      "STT",
      "Họ tên",
      "Email",
      "Số điện thoại",
      "Chức vụ",
      "Phòng ban",
      "Ngày tham gia",
      "Trạng thái",
    ];
    const headerRow = ws.getRow(4);
    headerRow.values = headerValues;

    // Định dạng cho Header Row
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE1E1E1" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // --- PHẦN 3: ĐỔ DỮ LIỆU ---
    employees.forEach((emp, index) => {
      const row = ws.addRow({
        stt: index + 1,
        fullName: `${emp.firstname} ${emp.lastname}`,
        email: emp.email,
        phone: emp.contactnumber,
        role: emp.role,
        dept: emp.department?.name || "Chưa phân bổ",
        joinedDate: new Date(emp.createdAt).toLocaleDateString("vi-VN"),
        status: emp.isverified ? "Đã xác minh" : "Chưa xác minh",
      });

      // Căn chỉnh và Border cho từng dòng
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // Căn giữa các cột STT, Role, Ngày, Trạng thái
        if ([1, 5, 7, 8].includes(colNumber)) {
          cell.alignment = { horizontal: "center" };
        }
      });
    });

    // --- PHẦN 4: RESPONSE ---
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_nhan_vien.xlsx",
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xuất báo cáo" });
  }
};

export const HandleExportAllHR = async (req, res) => {
  try {
    // 1. Lấy dữ liệu HR và populate thông tin phòng ban
    const hrs = await HumanResources.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Danh sách HR");

    // --- PHẦN 1: TIÊU ĐỀ (Tránh lỗi ghi đè bằng cách gán cụ thể ô) ---
    ws.mergeCells("A1:H1");
    const titleCell = ws.getCell("A1");
    titleCell.value = "DANH SÁCH QUẢN TRỊ VIÊN NHÂN SỰ (HR)";
    titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC0504D" }, // Màu đỏ gạch để phân biệt với bảng nhân viên
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    ws.getRow(2).values = [
      `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`,
    ];
    ws.addRow([]); // Dòng trống hàng số 3

    // --- PHẦN 2: ĐỊNH NGHĨA KEY CỘT (Không gán header ở đây) ---
    ws.columns = [
      { key: "stt", width: 8 },
      { key: "fullName", width: 25 },
      { key: "email", width: 30 },
      { key: "phone", width: 18 },
      { key: "dept", width: 25 },
      { key: "lastLogin", width: 20 },
      { key: "status", width: 15 },
      { key: "role", width: 12 },
    ];

    // Tự tay gán Header vào hàng 4
    const headerRow = ws.getRow(4);
    headerRow.values = [
      "STT",
      "Họ tên HR",
      "Email liên hệ",
      "Số điện thoại",
      "Bộ phận quản lý",
      "Đăng nhập cuối",
      "Trạng thái",
      "Quyền",
    ];

    // Định dạng Header Row
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE1E1E1" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // --- PHẦN 3: ĐỔ DỮ LIỆU ---
    hrs.forEach((hr, index) => {
      const row = ws.addRow({
        stt: index + 1,
        fullName: `${hr.firstname} ${hr.lastname}`,
        email: hr.email,
        phone: hr.contactnumber,
        dept: hr.department?.name || "Toàn hệ thống",
        lastLogin: hr.lastlogin
          ? new Date(hr.lastlogin).toLocaleString("vi-VN")
          : "Chưa đăng nhập",
        status: hr.isverified ? "Đã xác minh" : "Chưa xác minh",
        role: hr.role,
      });

      // Kẻ khung và căn chỉnh
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // Căn giữa STT, Ngày đăng nhập, Trạng thái, Quyền
        if ([1, 6, 7, 8].includes(colNumber)) {
          cell.alignment = { horizontal: "center" };
        }
      });
    });

    // --- PHẦN 4: RESPONSE ---
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_HR.xlsx",
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xuất báo cáo HR" });
  }
};

export const ExportFullSystemPDF = async (req, res) => {
  try {
    const orgId = req.ORGID;
    if (!orgId)
      return res.status(400).json({ message: "Thiếu organizationID" });

    // Khởi tạo tài liệu PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    // 1. CẤU HÌNH FONT CHỮ (BẮT BUỘC ĐỂ HIỂN THỊ TIẾNG VIỆT)
    // Đảm bảo bạn đã để file Roboto-Roboto-Regular.ttf vào thư mục fonts
    const fontPath = path.resolve("utils/Roboto-Regular.ttf");
    doc.font(fontPath);

    // Thiết lập Header trả về file PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Bao_Cao_Tong_The_He_Thong.pdf`,
    );
    doc.pipe(res);

    // =====================================================================
    // TRANG 1: TỔNG QUAN & NHÂN SỰ
    // =====================================================================
    doc.fontSize(22).text("BÁO CÁO TỔNG THỂ HỆ THỐNG", { align: "center" });
    doc
      .fontSize(10)
      .text(`Ngày xuất báo cáo: ${new Date().toLocaleString("vi-VN")}`, {
        align: "center",
      });
    doc.moveDown(2);

    // Lấy số liệu thống kê tổng quát
    const counts = {
      emp: await Employee.countDocuments({ organizationID: orgId }).catch(
        () => 0,
      ),
      dept: await Department.countDocuments({ organizationID: orgId }).catch(
        () => 0,
      ),
      hr: await HumanResources.countDocuments({ organizationID: orgId }).catch(
        () => 0,
      ),
      applicant: await Applicant.countDocuments({
        organizationID: orgId,
      }).catch(() => 0),
    };

    doc.fontSize(14).text("1. Thống kê nguồn lực:", { underline: true });
    doc.fontSize(12).text(`- Tổng số phòng ban: ${counts.dept}`);
    doc.text(`- Tổng số nhân viên: ${counts.emp}`);
    doc.text(`- Đội ngũ quản trị (HR): ${counts.hr}`);
    doc.text(`- Tổng số ứng viên: ${counts.applicant}`);
    doc.moveDown();

    // Bảng danh sách nhân viên
    const empData = await Employee.find({ organizationID: orgId })
      .populate("department")
      .limit(15)
      .catch(() => []);

    const tableEmployees = {
      title: "Danh sách nhân viên (Cập nhật mới nhất)",
      headers: ["Họ tên", "Email", "Phòng ban", "Chức vụ", "Trạng thái"],
      rows:
        empData.length > 0
          ? empData.map((e) => [
              `${e.firstname} ${e.lastname}`,
              e.email,
              e.department?.name || "N/A",
              e.role,
              e.isverified ? "Đã xác minh" : "Chưa xác minh",
            ])
          : [["Chưa có dữ liệu", "-", "-", "-", "-"]],
    };
    await doc.table(tableEmployees, { width: 530 });

    // =====================================================================
    // TRANG 2: TÀI CHÍNH & LƯƠNG
    // =====================================================================
    doc.addPage();
    doc.fontSize(16).text("2. Thống kê Tài chính & Lương", { underline: true });
    doc.moveDown();

    const salaries = await Salary.find({ organizationID: orgId })
      .populate("employee")
      .limit(15)
      .catch(() => []);

    const tableSalaries = {
      title: "Chi tiết phiếu lương nhân viên",
      headers: ["Nhân viên", "Lương cơ bản", "Thực lãnh", "Trạng thái"],
      rows:
        salaries.length > 0
          ? salaries.map((s) => [
              s.employee
                ? `${s.employee.firstname} ${s.employee.lastname}`
                : "N/A",
              s.basicpay?.toLocaleString("vi-VN") + " ₫",
              s.netpay?.toLocaleString("vi-VN") + " ₫",
              s.status,
            ])
          : [["Chưa có dữ liệu", "-", "-", "-"]],
    };
    await doc.table(tableSalaries, { width: 530 });

    // =====================================================================
    // TRANG 3: TUYỂN DỤNG & NGHỈ PHÉP
    // =====================================================================
    doc.addPage();
    doc.fontSize(16).text("3. Tình hình Tuyển dụng", { underline: true });
    doc.moveDown();

    const applicants = await Applicant.find({ organizationID: orgId })
      .limit(10)
      .catch(() => []);
    const tableApplicants = {
      title: "Danh sách ứng viên mới",
      headers: ["Họ tên", "Vị trí ứng tuyển", "Số điện thoại", "Trạng thái"],
      rows:
        applicants.length > 0
          ? applicants.map((a) => [
              `${a.firstname} ${a.lastname}`,
              a.appliedrole || "N/A",
              a.contactnumber || "N/A",
              a.recruitmentstatus || "N/A",
            ])
          : [["Chưa có dữ liệu", "-", "-", "-"]],
    };
    await doc.table(tableApplicants, { width: 530 });

    doc.moveDown(2);
    doc.fontSize(16).text("4. Quản lý Nghỉ phép", { underline: true });
    doc.moveDown();

    const leaves = await Leave.find({ organizationID: orgId })
      .populate("employee")
      .limit(10)
      .catch(() => []);

    const tableLeaves = {
      title: "Đơn xin nghỉ phép gần đây",
      headers: ["Nhân viên", "Lý do", "Thời gian", "Trạng thái"],
      rows:
        leaves.length > 0
          ? leaves.map((l) => [
              l.employee
                ? `${l.employee.firstname} ${l.employee.lastname}`
                : "N/A",
              l.reason || "N/A",
              new Date(l.startdate).toLocaleDateString("vi-VN"),
              l.status,
            ])
          : [["Chưa có dữ liệu", "-", "-", "-"]],
    };
    await doc.table(tableLeaves, { width: 530 });

    // Kết thúc file PDF
    doc.end();
  } catch (error) {
    console.error("PDF Export Error:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Lỗi khi tạo báo cáo PDF", error: error.message });
    }
  }
};
