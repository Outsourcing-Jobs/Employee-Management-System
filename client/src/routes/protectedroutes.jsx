import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { HandleGetEmployees } from "../redux/Thunks/EmployeeThunk.js"

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.employeereducer)
    const dispatch = useDispatch()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await dispatch(HandleGetEmployees({ apiroute: "CHECKELOGIN" })).unwrap()
            } catch (error) {

            } finally {
                setIsChecking(false)
            }
        }
        checkAuth()
    }, [dispatch])


    if (isChecking) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-sm font-medium text-slate-500">Đang xác thực...</p>
            </div>
        )
    }

    return isAuthenticated ? children : <Navigate to="/" replace />
}