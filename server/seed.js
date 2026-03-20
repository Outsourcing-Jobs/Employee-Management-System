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
import { BaseSalary } from './models/BaseSalary.model.js';
import { generateRichData } from './seed-factory.js';

dotenv.config();

const START_2026 = new Date(2026, 0, 1);
const END_2026 = new Date(2026, 2, 31);

const randomDateQ1_2026 = () => faker.date.between({ from: START_2026, to: END_2026 });

const fullSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🛠  Đang dọn dẹp Database...");

        const allModels = [Organization, HumanResources, BaseSalary, Department, Employee, Applicant, Salary, Notice, Attendance, Leave, Interviewinsight, GenerateRequest, Recruitment, CorporateCalendar, Balance];
        for (const m of allModels) await m.deleteMany({});

        const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Trịnh", "Mai", "Tạ", "Châu", "Tôn", "Quách"];
        const tenNam = ["Anh", "Hải", "Dũng", "Tuấn", "Nam", "Long", "Phong", "Khôi", "Hùng", "Khoa", "Thành", "Tài", "Đạt", "Bảo", "Sơn", "Trung", "Thắng", "Hoàng", "Phúc", "Vinh", "Toàn", "Quân", "Lộc", "Nhật", "Kiên", "Cường", "Thiện", "Hiếu", "Tín", "Khánh", "Hào", "Bình"];
        const tenNu = ["Hà", "Linh", "Trang", "Mai", "Lan", "Hương", "Ngọc", "Thảo", "Vy", "Yến", "Nhung", "Phương", "Trâm", "Chi", "Quỳnh", "My", "Diệu", "Tuyết", "Ánh", "Bích", "Loan", "Oanh", "Hạnh", "Nhi", "Thư", "An", "Kim", "Huyền", "Thu", "Mỹ", "Tâm"];
        const tenDemNam = ["Văn", "Hữu", "Đức", "Minh", "Quang", "Công", "Xuân", "Hoàng", "Thanh", "Ngọc", "Phúc", "Gia", "Trung", "Anh", "Khánh", "Tuấn"];
        const tenDemNu = ["Thị", "Ngọc", "Thanh", "Xuân", "Hoài", "Tuệ", "Kim", "Thu", "Bích", "Mỹ", "Diệu", "Hồng", "Ánh", "Phương", "Mai", "Lan"];

        function removeVietnameseTones(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/\s+/g, "");
        }

        function randomPhoneVN() {
            const prefixes = ["03", "05", "07", "08", "09"];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            return prefix + Math.floor(10000000 + Math.random() * 90000000);
        }

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

        const deptNames = ["Phòng Phát triển Phần mềm", "Phòng Đảm bảo Chất lượng", "Phòng Thiết kế Product", "Phòng An ninh mạng"];
        const depts = await Department.insertMany(deptNames.map(name => ({
            name, description: `Bộ phận chuyên môn thuộc ${name}`, organizationID: newOrg._id
        })));

        const hashedPasswordEmployee = await bcrypt.hash("Employee@123", 10);
        const emps = [];

        await Employee.insertMany(
            [
                {
                    firstname: "Đoàn",
                    lastname: "Đức Hải",
                    gender: true,
                    email: "hdoan82300@gmail.com",
                    password: hashedPasswordEmployee,
                    contactnumber: "0912345678",
                    role: "Employee",
                    department: depts[0]._id,
                    organizationID: newOrg._id,
                    isverified: true
                },
                {
                    firstname: "Đặng",
                    lastname: "Hồng",
                    gender: false,
                    email: "danghong@gmail.com",
                    password: hashedPasswordEmployee,
                    contactnumber: "0987654321",
                    role: "Employee",
                    department: depts[1]._id,
                    organizationID: newOrg._id,
                    isverified: true
                },
                {
                    firstname: "Trần",
                    lastname: "Thị Dạ Thương",
                    gender: false,
                    email: "dathuong@gmail.com",
                    password: hashedPasswordEmployee,
                    contactnumber: "0987654321",
                    role: "Employee",
                    department: depts[1]._id,
                    organizationID: newOrg._id,
                    isverified: true
                }
            ]);

        for (const d of depts) {
            for (let i = 0; i < 5; i++) {
                const isMale = Math.random() < 0.5;
                const firstName = ho[Math.floor(Math.random() * ho.length)];
                const middleName = isMale ? tenDemNam[Math.floor(Math.random() * tenDemNam.length)] : tenDemNu[Math.floor(Math.random() * tenDemNu.length)];
                const lastName = isMale ? tenNam[Math.floor(Math.random() * tenNam.length)] : tenNu[Math.floor(Math.random() * tenNu.length)];
                const fullName = `${firstName} ${middleName} ${lastName}`;

                emps.push({
                    firstname: firstName,
                    lastname: `${middleName} ${lastName}`,
                    gender: isMale,
                    email: `${removeVietnameseTones(fullName).toLowerCase()}${i}@fpt.com`,
                    password: hashedPasswordEmployee,
                    contactnumber: randomPhoneVN(),
                    role: "Employee",
                    department: d._id,
                    organizationID: newOrg._id,
                    isverified: true
                });
            }
        }

        const savedEmps = await Employee.insertMany(emps);

        console.log("💰 Đang seed BaseSalary (T1–T3 / 2026)...");
        await BaseSalary.insertMany(savedEmps.map(e => ({
            employee: e._id,
            dailyRate: faker.number.int({ min: 500_000, max: 2_500_000 }),
            currency: "VND",
            effectiveFrom: new Date(2026, 0, 1),
            organizationID: newOrg._id
        })));

        const recs = await Recruitment.insertMany(["Lập trình viên Senior Java", "Chuyên viên NodeJS"].map(job => ({
            jobtitle: job, description: `Tuyển gấp vị trí ${job} cho dự án Global.`,
            department: depts[0]._id, organizationID: newOrg._id
        })));

        const apps = await Applicant.insertMany(
            Array.from({ length: 20 }).map((_, i) => ({
                firstname: ho[Math.floor(Math.random() * ho.length)],
                lastname: tenNam[Math.floor(Math.random() * tenNam.length)],
                email: `applicant${i + 1}@gmail.com`,
                contactnumber: randomPhoneVN(),
                appliedrole: faker.helpers.arrayElement(["Software Engineer", "Frontend Dev"]),
                organizationID: newOrg._id
            }))
        );

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

        console.log("🔗 Đang thiết lập các liên kết ID...");
        for (const emp of savedEmps) {
            await Employee.findByIdAndUpdate(emp._id, {
                salary: salaries.filter(s => s.employee.equals(emp._id)).map(s => s._id),
                leaverequest: leaves.filter(l => l.employee.equals(emp._id)).map(l => l._id),
                generaterequest: requests.filter(r => r.employee.equals(emp._id)).map(r => r._id),
                attendance: attendances.find(a => a.employee.equals(emp._id))?._id
            });
        }

        for (const d of depts) {
            await Department.findByIdAndUpdate(d._id, {
                employees: savedEmps.filter(e => e.department.equals(d._id)).map(e => e._id),
                notice: notices.filter(n => n.department?.equals(d._id)).map(n => n._id)
            });
        }

        newOrg.employees = savedEmps.map(e => e._id);
        newOrg.HRs = [newHR._id];
        await newOrg.save();

        console.log("✅ SEED DỮ LIỆU THÀNH CÔNG (T1-T3/2026)");
        process.exit();
    } catch (err) {
        console.error("❌ Lỗi Seed:", err);
        process.exit(1);
    }
};

fullSeed();