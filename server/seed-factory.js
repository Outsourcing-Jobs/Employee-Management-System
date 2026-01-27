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

    // 1. Lương (Salary) - Giữ nguyên logic nhưng chú thích bằng tiền VND
    employees.forEach(emp => {
        for (let i = 0; i < 3; i++) {

            const now = new Date();
            const salaryMonth = now.getMonth() + 1; // 1–12
            const salaryYear = now.getFullYear();

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
                duedate: faker.date.future(),
                status: i === 0 ? "Pending" : "Paid",
                organizationID: orgId
            });
        }
    });

    // 2. Điểm danh (Attendance) - Giữ Enum tiếng Anh
    employees.forEach(emp => {
        const logs = Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
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

    // 3. Đơn nghỉ phép (Leave) - Việt hóa Lý do & Tiêu đề
    const leaveReasons = [
        "Giải quyết việc gia đình cá nhân",
        "Nghỉ ốm (có giấy xác nhận của bác sĩ)",
        "Nghỉ phép năm đi du lịch cùng gia đình",
        "Khám sức khỏe định kỳ",
        "Đưa con đi học ngày đầu tiên",
        "Về quê có việc hiếu hỉ"
    ];

    employees.slice(0, 15).forEach(emp => {
        data.leaves.push({
            employee: emp._id,
            startdate: faker.date.recent(),
            enddate: faker.date.soon(),
            title: faker.helpers.arrayElement(["Đơn xin nghỉ phép", "Đơn xin nghỉ ốm", "Xin nghỉ việc riêng"]),
            reason: faker.helpers.arrayElement(leaveReasons),
            status: faker.helpers.arrayElement(["Pending", "Approved", "Rejected"]),
            approvedby: hrAdminId,
            organizationID: orgId
        });
    });

    // 4. Thông báo (Notice) - Việt hóa Tiêu đề & Nội dung
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

    // 5. Phỏng vấn (Interview Insight) - Việt hóa Nhận xét
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
            interviewdate: faker.date.recent(),
            status: "Completed",
            organizationID: orgId
        });
    });

    // 6. Lịch công ty (Corporate Calendar) - Việt hóa Sự kiện
    const eventList = [
        "Tiệc tất niên công ty 2025",
        "Ngày hội Team Building bãi biển",
        "Hội thảo chia sẻ kiến thức công nghệ mới",
        "Lễ kỷ niệm ngày thành lập công ty",
        "Chương trình đào tạo kỹ năng mềm"
    ];

    data.events = eventList.map(name => ({
        eventtitle: name,
        eventdate: faker.date.future(),
        description: "Sự kiện được tổ chức nhằm mục đích gắn kết thành viên và nâng cao tinh thần làm việc.",
        audience: "Toàn thể nhân viên",
        organizationID: orgId
    }));

    // 7. Ngân sách (Balance) - Việt hóa tiêu đề
    data.balances = departments.map(d => ({
        title: `Ngân sách hoạt động ${d.name}`,
        description: `Dự chi các khoản chi phí vận hành và vật tư cho ${d.name} quý 1/2026`,
        availableamount: faker.number.int({ min: 100_000_000, max: 800_000_000 }),
        totalexpenses: faker.number.int({ min: 10_000_000, max: 80_000_000 }),
        expensemonth: "Tháng 01/2026",
        organizationID: orgId,
        createdBy: hrAdminId
    }));

    // 8. Yêu cầu phê duyệt (Generate Request) - Việt hóa yêu cầu
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