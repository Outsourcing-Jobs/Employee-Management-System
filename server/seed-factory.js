import { faker } from '@faker-js/faker';

export const generateRichData = (orgId, hrAdminId, departments, employees, applicants) => {
    const data = {
        salaries: [],
        attendance: [],
        leaves: [],
        notices: [],
        requests: [],
        insights: [],
        events: [],
        balances: []
    };

    // 1. Lương (Salary) - Chỉnh về T1, T2, T3 năm 2026
    employees.forEach(emp => {
        [1, 2, 3].forEach((month) => { // Chạy 3 tháng đầu năm
            const salaryMonth = month;
            const salaryYear = 2026;

            const workingDays = faker.number.int({ min: 20, max: 26 });
            const basic = faker.number.int({ min: 12_000_000, max: 45_000_000 });
            const bonuses = faker.number.int({ min: 500_000, max: 2_000_000 });
            const deductions = faker.number.int({ min: 100_000, max: 500_000 });

            data.salaries.push({
                employee: emp._id,
                basicpay: basic,
                salaryMonth,
                salaryYear,
                workingDays,
                bonuses,
                deductions,
                netpay: basic + bonuses - deductions,
                currency: "VND",
                duedate: new Date(2026, month - 1, 28), // Cuối mỗi tháng
                status: month === 3 ? "Pending" : "Paid",
                organizationID: orgId
            });
        });
    });

    // 2. Điểm danh (Attendance) - Chỉnh logdate lùi lại từ 31/03/2026
    employees.forEach(emp => {
        const logs = Array.from({ length: 90 }).map((_, i) => { // Tăng lên 90 ngày để phủ hết Q1
            const date = new Date(2026, 2, 31); // Bắt đầu từ 31/03/2026
            date.setDate(date.getDate() - i);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            return {
                logdate: date,
                logstatus: isWeekend ? 'Not Specified' : faker.helpers.arrayElement(['Present', 'Present', 'Absent', 'Leave'])
            };
        });
        data.attendance.push({
            employee: emp._id,
            status: 'Present',
            attendancelog: logs,
            organizationID: orgId
        });
    });

    // 3. Đơn nghỉ phép (Leave) - Chỉnh date trong Q1/2026
    const leaveReasons = [
        "Giải quyết việc gia đình cá nhân",
        "Nghỉ ốm (có giấy xác nhận của bác sĩ)",
        "Nghỉ phép năm đi du lịch cùng gia đình",
        "Khám sức khỏe định kỳ",
        "Đưa con đi học ngày đầu tiên",
        "Về quê có việc hiếu hỉ"
    ];

    employees.slice(0, 15).forEach(emp => {
        const start = faker.date.between({ from: '2026-01-01', to: '2026-03-25' });
        const end = new Date(start);
        end.setDate(start.getDate() + 2);

        data.leaves.push({
            employee: emp._id,
            startdate: start,
            enddate: end,
            title: faker.helpers.arrayElement(["Đơn xin nghỉ phép", "Đơn xin nghỉ ốm", "Xin nghỉ việc riêng"]),
            reason: faker.helpers.arrayElement(leaveReasons),
            status: faker.helpers.arrayElement(["Pending", "Approved", "Rejected"]),
            approvedby: hrAdminId,
            organizationID: orgId
        });
    });

    // 4. Thông báo (Notice) - Giữ nguyên
    const noticeTemplates = [
        { t: "Thông báo họp nội bộ định kỳ", c: "Yêu cầu tất cả thành viên tham gia đầy đủ để cập nhật tiến độ dự án quý mới." },
        { t: "Cập nhật quy định văn hóa công ty", c: "Vui lòng kiểm tra email để nắm rõ các quy định mới về giờ giấc làm việc tại văn phòng." },
        { t: "Thông báo về việc sử dụng thiết bị", c: "Đề nghị nhân viên tắt các thiết bị điện trước khi rời văn phòng để đảm bảo an toàn cháy nổ." }
    ];

    data.notices.push(...departments.map(d => {
        const template = faker.helpers.arrayElement(noticeTemplates);
        return {
            title: `${template.t} - ${d.name}`,
            content: template.c,
            audience: "Department-Specific",
            department: d._id,
            createdby: hrAdminId,
            organizationID: orgId
        };
    }));

    // 5. Phỏng vấn (Interview Insight) - Chỉnh date trong Q1/2026
    const feedbacks = [
        "Ứng viên có tư duy logic tốt, nắm vững kiến thức cơ bản.",
        "Kỹ năng giao tiếp xuất sắc, phù hợp với văn hóa đội ngũ.",
        "Kinh nghiệm thực chiến phong phú, xử lý tình huống nhanh.",
        "Cần cải thiện thêm về kỹ năng ngoại ngữ.",
        "Rất tiềm năng cho vị trí Leader trong tương lai."
    ];

    applicants.forEach(app => {
        data.insights.push({
            applicant: app._id,
            feedback: faker.helpers.arrayElement(feedbacks),
            interviewer: hrAdminId,
            interviewdate: faker.date.between({ from: '2026-01-01', to: '2026-03-31' }),
            status: "Completed",
            organizationID: orgId
        });
    });

    // 6. Lịch công ty (Corporate Calendar) - Chỉnh date trong Q1/2026
    const eventList = [
        "Tiệc tân niên công ty 2026",
        "Ngày hội Team Building bãi biển",
        "Hội thảo chia sẻ kiến thức công nghệ mới",
        "Lễ kỷ niệm ngày thành lập công ty",
        "Chương trình đào tạo kỹ năng mềm"
    ];

    data.events = eventList.map(name => ({
        eventtitle: name,
        eventdate: faker.date.between({ from: '2026-01-01', to: '2026-03-31' }),
        description: "Sự kiện được tổ chức nhằm mục đích gắn kết thành viên và nâng cao tinh thần làm việc.",
        audience: "Toàn thể nhân viên",
        organizationID: orgId
    }));

    // 7. Ngân sách (Balance) - Giữ nguyên mô tả 2026
    data.balances = departments.map(d => ({
        title: `Ngân sách hoạt động ${d.name}`,
        description: `Dự chi các khoản chi phí vận hành và vật tư cho ${d.name} quý 1/2026`,
        availableamount: faker.number.int({ min: 100_000_000, max: 800_000_000 }),
        totalexpenses: faker.number.int({ min: 10_000_000, max: 80_000_000 }),
        expensemonth: "Tháng 03/2026",
        organizationID: orgId,
        createdBy: hrAdminId
    }));

    // 8. Yêu cầu phê duyệt (Generate Request) - Giữ nguyên
    const requestItems = [
        "Đăng ký cấp thêm màn hình rời 27 inch",
        "Yêu cầu cấp mới bộ chuột và bàn phím không dây",
        "Đăng ký mua bản quyền phần mềm thiết kế",
        "Yêu cầu nâng cấp RAM cho laptop làm việc",
        "Xin cấp thẻ gửi xe tháng"
    ];

    data.requests = employees.slice(0, 10).map(emp => ({
        requesttitle: faker.helpers.arrayElement(requestItems),
        requestconent: "Phục vụ cho nhu cầu công việc hiện tại đang quá tải thiết bị.",
        employee: emp._id,
        department: emp.department,
        status: "Pending",
        organizationID: orgId
    }));

    return data;
};



