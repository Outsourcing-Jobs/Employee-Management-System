import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const EntryPage = () => {
    return (
        <div className="extry-page-container h-[100vh] flex justify-center items-center">
            <div className="entry-page-content">
                <div className="flex flex-col items-center justify-center w-auto mb-10 entry-image">
                    <img src="../../src/assets/Welcome.png" alt="" className="sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg" />
                    <h1 className="text-xl text-blue-600 font-bold min-[300px]:text-lg min-[300px]:text-center">Chào mừng bạn đến với Hệ thống Quản lý Nhân viên, vui lòng chọn vai trò để tiếp tục</h1>
                </div>
                <div className="flex justify-center gap-5 buttons placeholder:items-center">
                    <Link to={"/auth/employee/login"}><Button className="text-lg font-bold text-white bg-blue-600">Nhân viên</Button></Link>
                    <Link to={"/auth/HR/signup"}><Button className="text-lg font-bold text-white bg-blue-600">HR-Admin</Button> </Link>
                </div>
            </div>
        </div >
    )
}