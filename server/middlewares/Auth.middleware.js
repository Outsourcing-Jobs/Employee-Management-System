import jwt from 'jsonwebtoken'
import { Employee } from '../models/Employee.model.js'
import { HR } from '../models/HR.model.js'

export const VerifyEmployeeToken = async (req, res, next) => {
    const token = req.cookies.EMtoken
    if (!token) {
        return res.status(401).json({ success: false, message: "Truy cập bị từ chối, vui lòng đăng nhập", gologin: true })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 1. Kiểm tra tồn tại trong Database
        const userExists = await Employee.exists({ _id: decoded.EMid });
        if (!userExists) {
            res.clearCookie("EMtoken")
            return res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị xóa", gologin: true })
        }

        req.EMid = decoded.EMid
        req.EMrole = decoded.EMrole
        req.ORGID = decoded.ORGID
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ hoặc Token không hợp lệ", error: error.message })
    }
}

export const VerifyhHRToken = async (req, res, next) => {
    const token = req.cookies.HRtoken
    if (!token) {
        return res.status(401).json({ success: false, message: "Truy cập bị từ chối, vui lòng đăng nhập", gologin: true })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 2. Kiểm tra tồn tại với Model HR
        const hrExists = await HR.exists({ _id: decoded.HRid });
        if (!hrExists) {
            res.clearCookie("HRtoken")
            return res.status(401).json({ success: false, message: "Tài khoản quản trị không tồn tại", gologin: true })
        }

        req.HRid = decoded.HRid
        req.ORGID = decoded.ORGID
        req.Role = decoded.HRrole
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ hoặc Token không hợp lệ", error: error.message })
    }
}
