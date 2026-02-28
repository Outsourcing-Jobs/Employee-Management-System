import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// Import tất cả models (giả sử các file model nằm cùng thư mục với seed file)
import { Organization } from './models/Organization.model.js';
import { Department } from './models/Department.model.js';
import { HumanResources } from './models/HR.model.js';
import { Employee } from './models/Employee.model.js';
import { Balance } from './models/Balance.model.js';
import { Notice } from './models/Notice.model.js';
import { BaseSalary } from './models/BaseSalary.model.js';
import { Leave } from './models/Leave.model.js';
import { Attendance } from './models/Attendance.model.js';
import { UserNotification } from './models/UserNotification.model.js';
import { Recruitment } from './models/Recruitment.model.js';
import { Applicant } from './models/Applicant.model.js';
import { GenerateRequest } from './models/GenerateRequest.model.js';
import { CorporateCalendar } from './models/CorporateCalendar.model.js';
import { Salary } from './models/Salary.model.js';
import { Interviewinsight } from './models/InterviewInsights.model.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/hr_management_system'; // Thay bằng URI của bạn

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa toàn bộ dữ liệu cũ để seed lại sạch
    await Promise.all([
      Organization.deleteMany({}),
      Department.deleteMany({}),
      HumanResources.deleteMany({}),
      Employee.deleteMany({}),
      Balance.deleteMany({}),
      Notice.deleteMany({}),
      BaseSalary.deleteMany({}),
      Leave.deleteMany({}),
      Attendance.deleteMany({}),
      UserNotification.deleteMany({}),
      Recruitment.deleteMany({}),
      Applicant.deleteMany({}),
      GenerateRequest.deleteMany({}),
      CorporateCalendar.deleteMany({}),
      Salary.deleteMany({}),
      Interviewinsight.deleteMany({}),
    ]);
    console.log('🗑️ Đã xóa dữ liệu cũ');
    const hashedPassword = await bcrypt.hash("Hr@123456", 10);
    
    // ====================== 1. TẠO ORGANIZATION ======================
    const org = await Organization.create({
      name: "Công ty TNHH Công nghệ Việt Nam",
      description: "Công ty chuyên cung cấp giải pháp phần mềm, dịch vụ IT và tư vấn chuyển đổi số hàng đầu Việt Nam",
      OrganizationURL: "congtyvietnam.com",
      OrganizationMail: "info@congtyvietnam.com",
    });

    console.log('🏢 Đã tạo Organization');

    // ====================== 2. TẠO DEPARTMENTS ======================
    const departmentNames = [
      "Phòng Nhân sự", "Phòng Công nghệ Thông tin", "Phòng Tài chính Kế toán",
      "Phòng Marketing", "Phòng Bán hàng", "Phòng Hành chính - Tổng hợp", "Phòng Nghiên cứu Phát triển"
    ];

    const departments = [];
    for (const name of departmentNames) {
      const dept = await Department.create({
        name,
        description: `Phòng ban chuyên trách ${name.toLowerCase()} tại Công ty TNHH Công nghệ Việt Nam`,
        organizationID: org._id,
      });
      departments.push(dept);
    }
    console.log(`📂 Đã tạo ${departments.length} Departments`);

    // ====================== 3. TẠO HUMAN RESOURCES (HR) ======================
    const hrFirstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng"];
    const hrLastNames = ["Thị Lan", "Văn Hải", "Minh Quân", "Thị Hương", "Đức Anh"];

    const hrs = [];
    for (let i = 0; i < 8; i++) {
      const hr = await HumanResources.create({
        firstname: hrFirstNames[i % hrFirstNames.length],
        lastname: hrLastNames[i % hrLastNames.length],
        email: `hr${i + 1}@congtyvietnam.com`,
        password: hashedPassword,
        contactnumber: `+849${(1234567 + i).toString().padStart(7, '0')}`,
        role: "HR-Admin",
        department: departments[i % departments.length]._id,
        organizationID: org._id,
      });

      // Cập nhật Department.HumanResources
      await Department.findByIdAndUpdate(
        hr.department,
        { $push: { HumanResources: hr._id } }
      );

      hrs.push(hr);
    }
    console.log(`👨‍💼 Đã tạo ${hrs.length} Human Resources`);

    // ====================== 4. TẠO EMPLOYEES ======================
    const empFirstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Vũ", "Đặng", "Bùi", "Đỗ"];
    const empLastNames = ["Văn An", "Thị Hương", "Minh Quân", "Thị Lan", "Quang Huy", "Thành Đạt", "Ngọc Anh", "Phương Linh", "Hoài Nam", "Thị Ngọc"];

    const employees = [];
    for (let i = 0; i < 45; i++) { // 45 nhân viên - rất nhiều data
      const dept = departments[i % departments.length];

      const emp = await Employee.create({
        firstname: empFirstNames[i % empFirstNames.length],
        lastname: empLastNames[i % empLastNames.length],
        email: `nv${i + 1}@congtyvietnam.com`,
        password: "Nv@123456",
        contactnumber: `+849${(2345678 + i).toString().padStart(7, '0')}`,
        role: "Employee",
        gender: i % 3 !== 0, // xen kẽ nam/nữ
        department: dept._id,
        organizationID: org._id,
      });

      // Cập nhật Department.employees
      await Department.findByIdAndUpdate(dept._id, { $push: { employees: emp._id } });

      employees.push(emp);
    }
    console.log(`👥 Đã tạo ${employees.length} Employees`);

    // ====================== 5. TẠO ATTENDANCE cho mỗi Employee ======================
    for (const emp of employees) {
      const att = await Attendance.create({
        employee: emp._id,
        status: "Present",
        attendancelog: [
          {
            logdate: new Date("2026-02-01"),
            logstatus: "Present",
            checkInTime: new Date("2026-02-01T08:00:00"),
            checkOutTime: new Date("2026-02-01T17:30:00"),
          },
          {
            logdate: new Date("2026-02-02"),
            logstatus: "Present",
            checkInTime: new Date("2026-02-02T08:15:00"),
            checkOutTime: new Date("2026-02-02T18:00:00"),
          },
        ],
        organizationID: org._id,
      });

      // Liên kết ngược Employee.attendance
      await Employee.findByIdAndUpdate(emp._id, { attendance: att._id });
    }
    console.log(`📅 Đã tạo Attendance cho tất cả Employees`);

    // ====================== 6. TẠO BASE SALARY ======================
    for (const emp of employees) {
      await BaseSalary.create({
        employee: emp._id,
        dailyRate: 650000,
        currency: "VND",
        effectiveFrom: new Date("2024-01-01"),
        organizationID: org._id,
      });
    }
    console.log(`💰 Đã tạo BaseSalary cho tất cả Employees`);

    // ====================== 7. TẠO SALARY (nhiều tháng) ======================
    for (const emp of employees) {
    // Thay đổi: Cho tháng chạy từ 3 đến 8 để đảm bảo duedate luôn ở tương lai (so với tháng 2/2026)
    for (let month = 3; month <= 8; month++) { 
        const sal = await Salary.create({
        employee: emp._id,
        basicpay: 15000000,
        salaryMonth: month,
        salaryYear: 2026,
        workingDays: 22,
        bonuses: 2500000,
        deductions: 800000,
        netpay: 16700000,
        currency: "VND",
        // Sửa ở đây: Đảm bảo ngày đến hạn là tương lai
        duedate: new Date(2026, month - 1, 25), 
        status: "Pending", // Thường các kỳ hạn tương lai sẽ để Pending
        organizationID: org._id,
        });

        // Liên kết Employee.salary
        await Employee.findByIdAndUpdate(emp._id, { $push: { salary: sal._id } });
    }
    }
    console.log(`💵 Đã cập nhật logic và tạo Salary records thành công`);
    console.log(`💵 Đã tạo 270 Salary records`);

    // ====================== 8. TẠO LEAVE ======================
    const leaveReasons = [
      "Nghỉ phép năm theo quy định công ty",
      "Nghỉ ốm có giấy xác nhận bác sĩ",
      "Việc gia đình đột xuất",
      "Đi công tác theo kế hoạch dự án",
      "Nghỉ thai sản"
    ];

    for (let i = 0; i < 35; i++) {
      const emp = employees[i % employees.length];
      const hr = hrs[i % hrs.length];

      const leave = await Leave.create({
        employee: emp._id,
        startdate: new Date(2026, 1, 10 + i),
        enddate: new Date(2026, 1, 15 + i),
        title: "Đơn xin nghỉ phép",
        reason: leaveReasons[i % leaveReasons.length],
        status: ["Pending", "Approved", "Rejected"][i % 3],
        approvedby: hr._id,
        organizationID: org._id,
      });

      // Liên kết Employee.leaverequest
      await Employee.findByIdAndUpdate(emp._id, { $push: { leaverequest: leave._id } });
    }
    console.log(`📄 Đã tạo 35 Leave requests`);

    // ====================== 9. TẠO RECRUITMENT ======================
    const jobTitles = [
      "Lập trình viên Fullstack", "Chuyên viên Marketing Digital",
      "Kế toán viên tổng hợp", "Nhân viên Kinh doanh", "Quản lý Dự án IT",
      "Tester phần mềm", "Chuyên viên Nhân sự"
    ];

    const recruitments = [];
    for (let i = 0; i < 7; i++) {
      const rec = await Recruitment.create({
        jobtitle: jobTitles[i],
        description: "Yêu cầu tuyển dụng vị trí này với kinh nghiệm từ 2 năm trở lên, kỹ năng chuyên môn cao và tinh thần trách nhiệm.",
        department: departments[i % departments.length]._id,
        organizationID: org._id,
      });
      recruitments.push(rec);
    }
    console.log(`📋 Đã tạo ${recruitments.length} Recruitment`);

    // ====================== 10. TẠO APPLICANT ======================
    const applicants = [];
    for (let i = 0; i < 28; i++) {
      const app = await Applicant.create({
        firstname: empFirstNames[i % empFirstNames.length],
        lastname: empLastNames[i % empLastNames.length],
        email: `ungvien${i + 1}@gmail.com`,
        contactnumber: `+849${(3456789 + i).toString().padStart(7, '0')}`,
        appliedrole: jobTitles[i % jobTitles.length],
        recruitmentstatus: ["Pending", "Conduct-Interview", "Interview Completed", "Rejected"][i % 4],
        organizationID: org._id,
      });

      // Liên kết Recruitment.application
      const rec = recruitments[i % recruitments.length];
      await Recruitment.findByIdAndUpdate(rec._id, { $push: { application: app._id } });

      applicants.push(app);
    }
    console.log(`👤 Đã tạo ${applicants.length} Applicants`);

    // ====================== 11. TẠO INTERVIEW INSIGHTS ======================
    for (let i = 0; i < 18; i++) {
      await Interviewinsight.create({
        applicant: applicants[i % applicants.length]._id,
        feedback: "Ứng viên có kinh nghiệm tốt, kỹ năng giao tiếp rõ ràng, phù hợp với văn hóa công ty.",
        interviewer: hrs[i % hrs.length]._id,
        interviewdate: new Date(2026, 1, 5 + i),
        responsedate: new Date(2026, 1, 10 + i),
        status: "Completed",
        organizationID: org._id,
      });
    }
    console.log(`🎤 Đã tạo 18 Interview Insights`);

    // ====================== 12. TẠO NOTICE ======================
    const noticeTitles = [
      "Thông báo nghỉ Tết Nguyên Đán 2026",
      "Cập nhật chính sách lương thưởng quý I/2026",
      "Lịch đào tạo nội bộ tháng 3",
      "Thông báo thay đổi giờ làm việc",
      "Kế hoạch team building quý II"
    ];

    const notices = [];
    for (let i = 0; i < 22; i++) {
      const audienceType = ["ALL_EMPLOYEES", "Department-Specific", "Employee-Specific"][i % 3];

      let deptsList = [];
      let empsList = [];

      if (audienceType === "Department-Specific") {
        deptsList = [departments[i % departments.length]._id];
      } else if (audienceType === "Employee-Specific") {
        empsList = [employees[i % employees.length]._id];
      }

      const notice = await Notice.create({
        title: noticeTitles[i % noticeTitles.length],
        content: "Kính gửi toàn thể cán bộ nhân viên, Công ty xin thông báo nội dung quan trọng sau đây. Vui lòng thực hiện đúng quy định.",
        audience: audienceType,
        status: "DONE",
        channels: ["system", "mail"],
        createdby: hrs[i % hrs.length]._id,
        organizationID: org._id,
        departments: deptsList,
        employee: empsList,
      });

      notices.push(notice);

      // Liên kết Department.notice & Employee.notice
      if (deptsList.length > 0) {
        await Department.findByIdAndUpdate(deptsList[0], { $push: { notice: notice._id } });
      }
      if (empsList.length > 0) {
        await Employee.findByIdAndUpdate(empsList[0], { $push: { notice: notice._id } });
      }

      // Tạo UserNotification cho một số nhân viên
      if (audienceType === "ALL_EMPLOYEES") {
        for (let j = 0; j < 8; j++) {
          await UserNotification.create({
            notice: notice._id,
            employee: employees[j]._id,
            channel: "system",
            status: "SENT",
          });
        }
      }
    }
    console.log(`📢 Đã tạo ${notices.length} Notices và các UserNotification`);

    // ====================== 13. TẠO GENERATE REQUEST ======================
    const requestTitles = [
      "Yêu cầu cấp máy tính mới",
      "Yêu cầu nghỉ phép đặc biệt",
      "Yêu cầu hỗ trợ đào tạo chứng chỉ",
      "Yêu cầu thay đổi vị trí công tác",
      "Yêu cầu tăng lương"
    ];

    for (let i = 0; i < 25; i++) {
      const emp = employees[i % employees.length];
      const dept = departments[i % departments.length];
      const hr = hrs[i % hrs.length];

      const req = await GenerateRequest.create({
        requesttitle: requestTitles[i % requestTitles.length],
        requestconent: "Tôi kính đề nghị Ban lãnh đạo xem xét và phê duyệt yêu cầu này theo đúng quy trình công ty.",
        employee: emp._id,
        department: dept._id,
        approvedby: hr._id,
        status: ["Pending", "Approved", "Denied"][i % 3],
        organizationID: org._id,
      });

      // Liên kết Employee.generaterequest
      await Employee.findByIdAndUpdate(emp._id, { $push: { generaterequest: req._id } });
    }
    console.log(`📝 Đã tạo 25 Generate Requests`);

    // ====================== 14. TẠO CORPORATE CALENDAR ======================
    const eventTitles = [
      "Họp toàn công ty quý I/2026",
      "Team Building - Công viên Đầm Sen",
      "Lễ kỷ niệm 5 năm thành lập công ty",
      "Đào tạo kỹ năng lãnh đạo",
      "Ngày hội sức khỏe nhân viên",
      "Họp đánh giá KPI quý II"
    ];

    for (let i = 0; i < 12; i++) {
      await CorporateCalendar.create({
        eventtitle: eventTitles[i % eventTitles.length],
        eventdate: new Date(2026, 2 + (i % 6), 15 + (i % 10)),
        description: "Sự kiện quan trọng của công ty, toàn thể nhân viên vui lòng tham gia đầy đủ.",
        audience: "ALL_EMPLOYEES",
        organizationID: org._id,
      });
    }
    console.log(`📅 Đã tạo 12 Corporate Calendar events`);

    // ====================== 15. TẠO BALANCE ======================
    for (let i = 0; i < 15; i++) {
      await Balance.create({
        title: `Báo cáo cân đối kế toán tháng ${i + 1}/2026`,
        description: "Báo cáo chi tiết tình hình tài chính, thu chi và dự báo quý tới.",
        availableamount: 1250000000 + i * 45000000,
        totalexpenses: 780000000 + i * 12000000,
        expensemonth: `Tháng ${i + 1}/2026`,
        organizationID: org._id,
        createdBy: hrs[i % hrs.length]._id,
      });
    }
    console.log(`📊 Đã tạo 15 Balance records`);

    // ====================== 16. CẬP NHẬT ORGANIZATION (employees + HRs) ======================
    await Organization.findByIdAndUpdate(org._id, {
      $push: {
        employees: { $each: employees.map(e => e._id) },
        HRs: { $each: hrs.map(h => h._id) },
      },
    });

    console.log('🎉 HOÀN THÀNH SEED DATA - Tổng cộng rất nhiều dữ liệu thực tế bằng tiếng Việt!');
    console.log(`   • 1 Organization`);
    console.log(`   • 7 Departments`);
    console.log(`   • 8 HRs`);
    console.log(`   • 45 Employees`);
    console.log(`   • 270 Salaries`);
    console.log(`   • 35 Leaves`);
    console.log(`   • 7 Recruitments`);
    console.log(`   • 28 Applicants`);
    console.log(`   • 18 Interview Insights`);
    console.log(`   • 22 Notices`);
    console.log(`   • 25 Generate Requests`);
    console.log(`   • 12 Corporate Calendars`);
    console.log(`   • 15 Balances`);
    console.log(`   • Hàng trăm UserNotification, Attendance...`);

  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB');
  }
}

seedDatabase();