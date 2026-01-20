import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Models
import { Organization } from './models/Organization.model.js';
import { HumanResources } from './models/HR.model.js';
import { Department } from './models/Department.model.js';
import { Employee } from './models/Employee.model.js';
import { Applicant } from './models/Applicant.model.js';
import { Salary } from './models/Salary.model.js';
import { Notice } from './models/Notice.model.js';
import { Attendance } from './models/Attendance.model.js';
import { Leave } from './models/Leave.model.js';
import { Interviewinsight } from './models/InterviewInsights.model.js';
import { GenerateRequest } from './models/GenerateRequest.model.js';
import { Recruitment } from './models/Recruitment.model.js';
import { CorporateCalendar } from './models/CorporateCalendar.model.js';
import { Balance } from './models/Balance.model.js';

import { generateRichData } from './seed-factory.js';

dotenv.config();

const fullSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🛠  Đang dọn dẹp Database...");
        
        const allModels = [Organization, HumanResources, Department, Employee, Applicant, Salary, Notice, Attendance, Leave, Interviewinsight, GenerateRequest, Recruitment, CorporateCalendar, Balance];
        for (const m of allModels) await m.deleteMany({});

        // 1. Tạo Gốc (FPT Software)
        const newOrg = await Organization.create({
            name: "FPT Software",
            description: "Tập đoàn công nghệ hàng đầu Việt Nam",
            OrganizationURL: "https://fpt-software.com",
            OrganizationMail: "hr@fpt.com"
        });

        const hashedPassword = await bcrypt.hash("AdminPassword123", 10);
        const newHR = await HumanResources.create({
            firstname: "Admin", lastname: "Hệ Thống",
            email: "admin@fpt.com", password: hashedPassword,
            contactnumber: "0987654321", role: "HR-Admin",
            organizationID: newOrg._id, isverified: true 
        });

        // 2. Phòng ban tiếng Việt
        const deptNames = ["Phòng Phát triển Phần mềm", "Phòng Đảm bảo Chất lượng", "Phòng Thiết kế Product", "Phòng An ninh mạng"];
        const depts = await Department.insertMany(deptNames.map(name => ({
            name, description: `Bộ phận chuyên môn thuộc ${name}`, organizationID: newOrg._id
        })));

        // 3. Nhân viên
        const emps = [];
        for (const d of depts) {
            for (let i = 0; i < 5; i++) {
                emps.push({
                    firstname: faker.person.firstName(), lastname: faker.person.lastName(),
                    email: faker.internet.email().toLowerCase(), password: hashedPassword,
                    contactnumber: faker.phone.number(), role: "Employee",
                    department: d._id, organizationID: newOrg._id, isverified: true
                });
            }
        }
        const savedEmps = await Employee.insertMany(emps);

        // 4. Tuyển dụng & Ứng viên
        const recs = await Recruitment.insertMany(["Lập trình viên Senior Java", "Chuyên viên NodeJS"].map(job => ({
            jobtitle: job, description: `Tuyển gấp vị trí ${job} cho dự án Global.`,
            department: depts[0]._id, organizationID: newOrg._id
        })));

        const apps = await Applicant.insertMany(Array.from({ length: 20 }).map(() => ({
            firstname: faker.person.firstName(), lastname: faker.person.lastName(),
            email: faker.internet.email().toLowerCase(), contactnumber: faker.phone.number(),
            appliedrole: faker.helpers.arrayElement(["Software Engineer", "Frontend Dev"]), 
            organizationID: newOrg._id
        })));

        // 5. Sinh dữ liệu từ Factory
        const rich = generateRichData(newOrg._id, newHR._id, depts, savedEmps, apps);

        const [salaries, attendances, leaves, notices, insights, requests] = await Promise.all([
            Salary.insertMany(rich.salaries),
            Attendance.insertMany(rich.attendance),
            Leave.insertMany(rich.leaves),
            Notice.insertMany(rich.notices),
            Interviewinsight.insertMany(rich.insights),
            GenerateRequest.insertMany(rich.requests),
            CorporateCalendar.insertMany(rich.events),
            Balance.insertMany(rich.balances)
        ]);

        console.log("🔗 Đang thiết lập các liên kết ID (Mapping References)...");

        // 6. ĐỒNG BỘ QUAN HỆ (Update References)
        for (const emp of savedEmps) {
            const eSalaries = salaries.filter(s => s.employee.equals(emp._id)).map(s => s._id);
            const eLeaves = leaves.filter(l => l.employee.equals(emp._id)).map(l => l._id);
            const eRequests = requests.filter(r => r.employee.equals(emp._id)).map(r => r._id);
            const eAttendance = attendances.find(a => a.employee.equals(emp._id));

            await Employee.findByIdAndUpdate(emp._id, {
                salary: eSalaries,
                leaverequest: eLeaves,
                generaterequest: eRequests,
                attendance: eAttendance?._id
            });
        }

        for (const d of depts) {
            const dEmps = savedEmps.filter(e => e.department.equals(d._id)).map(e => e._id);
            const dNotices = notices.filter(n => n.department?.equals(d._id)).map(n => n._id);
            await Department.findByIdAndUpdate(d._id, { employees: dEmps, notice: dNotices });
        }

        for (const r of recs) {
            await Recruitment.findByIdAndUpdate(r._id, { 
                application: apps.slice(0, 10).map(a => a._id) 
            });
        }

        newOrg.employees = savedEmps.map(e => e._id);
        newOrg.HRs = [newHR._id];
        await newOrg.save();

        console.log(`
        ✅ SEED DỮ LIỆU THÀNH CÔNG (NỘI DUNG TIẾNG VIỆT)
        -----------------------------------------------
        🏢 Công ty: 1 (FPT Software)
        👥 Nhân viên: ${savedEmps.length}
        💰 Lương (VND): ${salaries.length} bản ghi
        📅 Điểm danh: 30 ngày/nhân viên
        📂 Quan hệ ID: Đã kết nối hoàn tất
        `);
        process.exit();
    } catch (err) {
        console.error("❌ Lỗi Seed:", err);
        process.exit(1);
    }
};

fullSeed();