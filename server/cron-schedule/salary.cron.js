import cron from "node-cron"
import { Employee } from "../models/Employee.model.js"
import { Salary } from "../models/Salary.model.js"
import { BaseSalary } from "../models/BaseSalary.model.js"
import { Attendance } from "../models/Attendance.model.js"


const STANDARD_HOURS = 8

const calculateWorkingDaysAndOT = (attendance, month, year, dailyRate) => {
    let workingDays = 0
    let otAmount = 0

    if (!attendance || !attendance.attendancelog) {
        return { workingDays: 0, otAmount: 0 }
    }

    attendance.attendancelog.forEach(log => {
        const logDate = new Date(log.logdate)
        if (
            logDate.getMonth() + 1 !== month ||
            logDate.getFullYear() !== year
        ) return

        if (log.logstatus === "Present" || log.logstatus === "Leave") {
            workingDays++
        }

        if (!log.checkInTime || !log.checkOutTime) return

        const workedHours =
            (new Date(log.checkOutTime) - new Date(log.checkInTime))
            / (1000 * 60 * 60)

        const otHours = workedHours - STANDARD_HOURS
        if (otHours <= 2) return

        if (otHours > 2 && otHours < 4) {
            otAmount += dailyRate * 0.25
        } else {
            otAmount += dailyRate * 0.5
        }
    })

    return { workingDays, otAmount }
}

cron.schedule("5 0 2 * *", async () => {
    console.log("🕐 Cron tính lương bắt đầu...")

    try {
        const now = new Date()

        let salaryMonth = now.getMonth() // tháng hiện tại - 1
        let salaryYear = now.getFullYear()

        if (salaryMonth === 0) {
            salaryMonth = 12
            salaryYear -= 1
        }

        const organizations = await Employee.distinct("organizationID")

        for (const orgID of organizations) {
            const employees = await Employee.find({ organizationID: orgID })

            for (const employee of employees) {

                const existed = await Salary.findOne({
                    employee: employee._id,
                    salaryMonth,
                    salaryYear,
                    organizationID: orgID
                })

                if (existed) continue

                const baseSalary = await BaseSalary.findOne({
                    employee: employee._id,
                    organizationID: orgID,
                    effectiveTo: null
                })

                if (!baseSalary) continue

                const attendance = await Attendance.findOne({
                    employee: employee._id,
                    organizationID: orgID
                })

                const { workingDays, otAmount } =
                    calculateWorkingDaysAndOT(
                        attendance,
                        salaryMonth,
                        salaryYear,
                        baseSalary.dailyRate
                    )

                const basicpay = workingDays * baseSalary.dailyRate
                const deductions = basicpay * 0.05
                const netpay = basicpay + otAmount - deductions

                const salary = await Salary.create({
                    employee: employee._id,
                    salaryMonth,
                    salaryYear,
                    workingDays,
                    dailyRate: baseSalary.dailyRate,
                    basicpay,
                    bonuses: 0,
                    deductions,
                    netpay,
                    currency: baseSalary.currency,
                    duedate: new Date(salaryYear, salaryMonth, 10),
                    organizationID: orgID
                })

                employee.salary.push(salary._id)
                await employee.save()
            }
        }

        console.log("✅ Cron tính lương hoàn tất")

    } catch (err) {
        console.error("❌ Lỗi cron lương:", err.message)
    }
})

cron.schedule("10 0 * * *", async () => {
    console.log("🕐 Cron auto update salary status...")

    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const result = await Salary.updateMany(
            {
                status: { $ne: "Paid" },
                duedate: { $lt: today }
            },
            {
                $set: { status: "Paid" }
            }
        )

        console.log(
            `✅ Đã auto Paid ${result.modifiedCount} bảng lương`
        )

    } catch (err) {
        console.error("❌ Lỗi cron update status:", err.message)
    }
})
