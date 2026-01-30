import { HandleGetHumanResources } from "../redux/Thunks/HRThunk.js"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { Navigate, useNavigate, useLocation } from "react-router-dom"
import { Loading } from "../components/common/loading.jsx"

export const HRProtectedRoutes = ({ children }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { isAuthenticated, isAuthourized, isVerified, isLoading, error } = useSelector((state) => state.HRReducer)

    useEffect(() => {
        // Chỉ gọi API check quyền nếu chưa có thông tin và không đang loading
        if (!isAuthenticated && !isLoading) {
            dispatch(HandleGetHumanResources({ apiroute: "CHECKLOGIN" }))
            dispatch(HandleGetHumanResources({ apiroute: "CHECK_VERIFY_EMAIL" }))
        }
    }, [dispatch, isAuthenticated])

    if (isLoading) return <Loading />

    // 1. Nếu chưa login -> đá về trang login (lưu lại cái trang định vào để login xong quay lại)
    if (!isAuthenticated) {
        return <Navigate to="/auth/HR/login" state={{ from: location }} replace />
    }

    // 2. Đã login nhưng chưa verify email
    if (isAuthenticated && !isVerified) {
        return <Navigate to="/auth/HR/reset-email-validation" replace />
    }

    // 3. Đã login nhưng không có quyền (ví dụ role không phải HR)
    if (isAuthenticated && !isAuthourized) {
        return <Navigate to="/auth/HR/login" replace /> 
    }

    // Cuối cùng: Thỏa mãn hết thì mới cho vào trang con
    return children
}