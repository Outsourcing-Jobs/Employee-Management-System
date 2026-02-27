import { KeyDetailBoxContentWrapper } from "../../../components/common/Dashboard/contentwrappers.jsx"
import { SalaryChart } from "../../../components/common/Dashboard/salarychart.jsx"
import { DataTable } from "../../../components/common/Dashboard/datatable.jsx"
import { useEffect } from "react"
import { HandleGetAttendanceReport, HandleGetDashboard, HandleGetLeaveReport, HandleGetRecruitmentReport } from "../../../redux/Thunks/DashboardThunk.js"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Loading } from "../../../components/common/loading.jsx"
import department from "../../../assets/HR-Dashboard/department.png";
import employee2 from "../../../assets/HR-Dashboard/employee-2.png";
import leave from "../../../assets/HR-Dashboard/leave.png";
import request from "../../../assets/HR-Dashboard/request.png";
import { LeaveStatusChart } from "../../../components/common/Dashboard/LeaveStatusChart.jsx"
import { AttendanceStatusChart } from "../../../components/common/Dashboard/AttendanceStatusChart.jsx"
import { RecruitmentByMonthChart } from "../../../components/common/Dashboard/RecruitmentByMonthChart.jsx"
import { ApplicantStatusBarChart } from "../../../components/common/Dashboard/ApplicantStatusBarChart.jsx"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25,   // ⬅ chậm hơn
            delayChildren: 0.2       // ⬅ delay trước khi chạy
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,          // ⬅ chậm lại
            ease: [0.25, 0.8, 0.25, 1] // ⬅ cubic-bezier mượt
        }
    }
}

export const HRDashboardPage = () => {
    console.log("Reloaded")
    const DashboardState = useSelector((state) => state.dashboardreducer)
    const dispatch = useDispatch()
    const DataArray = [
        {
            image: employee2,
            dataname: "employees",
            path: "/HR/dashboard/employees",
            description:"Nhân viên"
        },
        {
            image: department,
            dataname: "departments",
            path: "/HR/dashboard/departments",
            description:"Phòng ban"
        },
        {
            image: leave,
            dataname: "leaves",
            path: "/HR/dashboard/leave",
            description:"Nghỉ phép"
        },
        {
            image: request,
            dataname: "requestes",
            path: "/HR/dashboard/internal-requests",
            description:"Yêu cầu"
        }
    ]

    useEffect(() => {
        const currentYear = new Date().getFullYear()
        dispatch(HandleGetDashboard({ apiroute: "GETDATA" }))
        dispatch(HandleGetLeaveReport())
        dispatch(HandleGetAttendanceReport())
        dispatch(HandleGetRecruitmentReport(currentYear))
    },[])

    if (DashboardState.isLoading) { 
        return (
            <Loading />
        )
    }
    // console.log("DashboardState.report: ", DashboardState.report)

    return (
        <>
            <KeyDetailBoxContentWrapper imagedataarray={DataArray} data={DashboardState.data} />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="salary-notices-container h-3/4 grid min-[250px]:grid-cols-1 lg:grid-cols-2 gap-4"
            >

                <motion.div variants={itemVariants}>
                    <LeaveStatusChart data={DashboardState.report} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AttendanceStatusChart data={DashboardState.attendanceReport} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SalaryChart balancedata={DashboardState.data} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <DataTable noticedata={DashboardState.data} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <RecruitmentByMonthChart data={DashboardState.recruitmentReport} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <ApplicantStatusBarChart data={DashboardState.recruitmentReport} />
                </motion.div>

            </motion.div>
        </>
    )
}