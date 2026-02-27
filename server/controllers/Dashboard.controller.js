import { Employee } from "../models/Employee.model.js"
import { Department } from "../models/Department.model.js"
import { Leave } from "../models/Leave.model.js"
import { Salary } from "../models/Salary.model.js"
import { Notice } from "../models/Notice.model.js"
import { GenerateRequest } from "../models/GenerateRequest.model.js"
import { Balance } from "../models/Balance.model.js"
import mongoose from "mongoose"
import { Attendance } from "../models/Attendance.model.js"
import { Recruitment } from "../models/Recruitment.model.js"
import { Applicant } from "../models/Applicant.model.js"

export const HandleHRDashboard = async (req, res) => {
    try {
        const employees = await Employee.countDocuments({ organizationID: req.ORGID })
        const departments = await Department.countDocuments({ organizationID: req.ORGID })
        const leaves = await Leave.countDocuments({ organizationID: req.ORGID })
        const requestes = await GenerateRequest.countDocuments({ organizationID: req.ORGID })
        const balance = await Balance.find({ organizationID: req.ORGID })
        const notices = await Notice.find({ organizationID: req.ORGID })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("createdby", "firstname lastname")

        return res.status(200).json({ 
            success: true, 
            data: { 
                employees: employees, 
                departments: departments, 
                leaves: leaves, 
                requestes: requestes, 
                balance: balance, 
                notices: notices 
            } 
        })
    }
    catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error, 
            message: "Lỗi máy chủ nội bộ khi lấy dữ liệu Dashboard" 
        })
    }
}

export const HandleDashboardReport = async (req, res) => {
  try {
    const orgID = new mongoose.Types.ObjectId(req.ORGID);

    /* ==============================
       1️⃣ Tổng số nhân viên
    ============================== */
    const totalEmployees = await Employee.countDocuments({
      organizationID: orgID,
    });

    /* ==============================
       2️⃣ Tổng số đơn nghỉ
    ============================== */
    const totalLeaves = await Leave.countDocuments({
      organizationID: orgID,
    });

    /* ==============================
       3️⃣ Thống kê theo trạng thái
    ============================== */
    const leaveStatusStats = await Leave.aggregate([
      { $match: { organizationID: orgID } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    /* ==============================
       4️⃣ Thống kê số đơn theo tháng
    ============================== */
    const leaveByMonth = await Leave.aggregate([
      { $match: { organizationID: orgID } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    /* ==============================
       5️⃣ Tổng số ngày nghỉ đã duyệt
    ============================== */
    const approvedLeaves = await Leave.aggregate([
      {
        $match: {
          organizationID: orgID,
          status: "Approved",
        },
      },
      {
        $project: {
          days: {
            $divide: [
              { $subtract: ["$enddate", "$startdate"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: "$days" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy báo cáo thống kê thành công",
      data: {
        totalEmployees,
        totalLeaves,
        leaveStatusStats,
        leaveByMonth,
        totalApprovedDays:
          approvedLeaves.length > 0 ? approvedLeaves[0].totalDays : 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const HandleAttendanceReport = async (req, res) => {
  try {
    const orgID = new mongoose.Types.ObjectId(req.ORGID);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    /* ==============================
       1️⃣ Tổng số nhân viên
    ============================== */
    const totalEmployees = await Employee.countDocuments({
      organizationID: orgID
    });

    /* ==============================
       2️⃣ Tổng số lượt chấm công
    ============================== */
    const totalAttendanceLogs = await Attendance.aggregate([
      { $match: { 
        "attendancelog.logdate": {
        $gte: startOfMonth,
        $lt: endOfMonth
      } } },
      { $unwind: "$attendancelog" },
      { $count: "totalLogs" }
    ]);

    const totalLogs =
      totalAttendanceLogs.length > 0
        ? totalAttendanceLogs[0].totalLogs
        : 0;

    /* ==============================
       3️⃣ Thống kê theo trạng thái
    ============================== */
    const attendanceStatusStats = await Attendance.aggregate([
      { $match: { organizationID: orgID } },
      { $unwind: "$attendancelog" },
      {
        $match: {
          "attendancelog.logdate": {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: "$attendancelog.logstatus",
          count: { $sum: 1 }
        }
      }
    ]);

    /* ==============================
       4️⃣ Tỷ lệ đi làm (% Present)
    ============================== */
    const presentCount = attendanceStatusStats.find(
      item => item._id === "Present"
    );

    const presentPercentage =
      totalLogs > 0
        ? ((presentCount?.count || 0) / totalLogs) * 100
        : 0;

    /* ==============================
       5️⃣ Thống kê theo tháng
    ============================== */
    const attendanceByDay = await Attendance.aggregate([
      { $match: { organizationID: orgID } },
      { $unwind: "$attendancelog" },
      {
        $match: {
          "attendancelog.logdate": {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$attendancelog.logdate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy báo cáo thống kê điểm danh thành công",
      data: {
        totalEmployees,
        totalLogs,
        attendanceStatusStats,
        presentPercentage: presentPercentage.toFixed(2),
        attendanceByDay
      }
    });

  } catch (error) {
    console.error("Attendance Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ"
    });
  }
};

export const HandleStatisticsByYear = async (req, res) => {
    try {
        const { year } = req.params

        if (!year) {
            return res.status(400).json({
                success: false,
                message: "Năm là bắt buộc"
            })
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`)
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`)

        /* ================= RECRUITMENT ================= */

        const totalRecruitments = await Recruitment.countDocuments({
            organizationID: req.ORGID,
            createdAt: { $gte: startDate, $lte: endDate }
        })

        const recruitmentsByMonth = await Recruitment.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        const recruitmentsByDepartment = await Recruitment.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "departmentInfo"
                }
            }
        ])

        /* ================= APPLICANT ================= */

        const totalApplicants = await Applicant.countDocuments({
            organizationID: req.ORGID,
            createdAt: { $gte: startDate, $lte: endDate }
        })

        const applicantsByMonth = await Applicant.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        const applicantsByStatus = await Applicant.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$recruitmentstatus",
                    count: { $sum: 1 }
                }
            }
        ])

        const applicantsByRole = await Applicant.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$appliedrole",
                    count: { $sum: 1 }
                }
            }
        ])

        /* ================= DEPARTMENT ================= */

        const totalDepartments = await Department.countDocuments({
            organizationID: req.ORGID
        })

        const employeesByDepartment = await Department.aggregate([
            {
                $match: {
                    organizationID: new mongoose.Types.ObjectId(req.ORGID)
                }
            },
            {
                $project: {
                    name: 1,
                    employeeCount: { $size: "$employees" }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            message: `Thống kê năm ${year} thành công`,
            data: {
                recruitment: {
                    total: totalRecruitments,
                    byMonth: recruitmentsByMonth,
                    byDepartment: recruitmentsByDepartment
                },
                applicant: {
                    total: totalApplicants,
                    byMonth: applicantsByMonth,
                    byStatus: applicantsByStatus,
                    byRole: applicantsByRole
                },
                department: {
                    total: totalDepartments,
                    employeesByDepartment: employeesByDepartment
                }
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ nội bộ",
            error: error.message
        })
    }
}