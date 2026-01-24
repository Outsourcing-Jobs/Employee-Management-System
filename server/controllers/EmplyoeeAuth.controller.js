import { Employee } from "../models/Employee.model.js"
import bcrypt from 'bcrypt'
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js"
import { SendVerificationEmail, SendWelcomeEmail, SendForgotPasswordEmail, SendResetPasswordConfimation } from "../mail/mail.service.js"
import { GenerateJwtTokenAndSetCookiesEmployee } from "../utils/generatejwttokenandsetcookies.js"
import crypto from "crypto"
import { Organization } from "../models/Organization.model.js"


export const HandleEmplyoeeSignup = async (req, res) => {
    const { firstname, lastname, email, password, contactnumber } = req.body
    try {

        if (!firstname || !lastname || !email || !password || !contactnumber) {
            throw new Error("Tất cả các trường thông tin là bắt buộc")
        }

        const organization = await Organization.findOne({ _id: req.ORGID })

        if (!organization) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tổ chức hoặc công ty" })
        }

        try {
            // const checkEmployee = await Employee.findOne({ email: email })

            // if (checkEmployee) {
            //     return res.status(400).json({ success: false, message: `Nhân viên này đã tồn tại, vui lòng truy cập trang đăng nhập hoặc tạo nhân viên mới.` })
            // }

            const hashedPassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newEmployee = await Employee.create({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashedPassword,
                contactnumber: contactnumber,
                role: "Employee",
                verificationtoken: verificationcode,
                verificationtokenexpires: Date.now() + 5 * 60 * 1000,
                organizationID: organization._id
            })

            organization.employees.push(newEmployee._id)
            await organization.save()

            // GenerateJwtTokenAndSetCookiesEmployee(res, newEmployee._id, newEmployee.role, organization._id)
            // const VerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
            // SendVerificationEmailStatus: VerificationEmailStatus

            return res.status(201).json({ success: true, message: "Employee Registered Successfully", newEmployee: newEmployee.email, type: "EmployeeCreate" })

            } catch (error) {
                res.status(400).json({ success: false, message: "Rất tiếc! Đã có lỗi xảy ra", error: error });
            }

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
    }
}

export const HandleEmplyoeeVerifyEmail = async (req, res) => {
    const { verificationcode } = req.body

    try {
        const ValidateEmployee = await Employee.findOne({ 
            verificationtoken: verificationcode, 
            verificationtokenexpires: { $gt: Date.now() }, 
            organizationID: req.ORGID 
        })

        if (!ValidateEmployee) {
            return res.status(404).json({ success: false, message: "Mã xác thực không hợp lệ hoặc đã hết hạn" })
        }

        ValidateEmployee.isverified = true;
        ValidateEmployee.verificationtoken = undefined;
        ValidateEmployee.verificationtokenexpires = undefined;
        await ValidateEmployee.save()

        const SendWelcomeEmailStatus = await SendWelcomeEmail(ValidateEmployee.email, ValidateEmployee.firstname, ValidateEmployee.lastname)

        return res.status(200).json({ 
            success: true, 
            message: "Xác thực email nhân viên thành công", 
            validatedEmployee: ValidateEmployee, 
            SendWelcomeEmailStatus: SendWelcomeEmailStatus 
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleResetEmplyoeeVerifyEmail = async (req, res) => {
    const { email } = req.body

    try {
        const employee = await Employee.findOne({ email: email })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Email nhân viên không tồn tại, vui lòng nhập lại đúng email" })
        }

        if (employee.isverified) {
            return res.status(404).json({ success: false, message: "Email nhân viên đã được xác thực trước đó" })
        }

        const verificationcode = GenerateVerificationToken(6)
        employee.verificationtoken = verificationcode
        employee.verificationtokenexpires = Date.now() + 5 * 60 * 1000
        await employee.save()

        const SendVerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
        return res.status(200).json({ success: true, message: "Email xác thực đã được gửi thành công", SendVerificationEmailStatus: SendVerificationEmailStatus })

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error })
    }
}

export const HandleEmplyoeeLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const employee = await Employee.findOne({ email: email })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Thông tin đăng nhập không hợp lệ, vui lòng kiểm tra lại" })
        }

        const isMatch = await bcrypt.compare(password, employee.password)

        if (!isMatch) {
            return res.status(404).json({ success: false, message: "Thông tin đăng nhập không hợp lệ, vui lòng kiểm tra lại" })
        }

        GenerateJwtTokenAndSetCookiesEmployee(res, employee._id, employee.role, employee.organizationID)
        employee.lastlogin = new Date()

        await employee.save()
        return res.status(200).json({ success: true, message: "Đăng nhập nhân viên thành công" })

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleEmployeeCheck = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.EMid, organizationID: req.ORGID })
        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" })
        }
        return res.status(200).json({ success: true, message: "Nhân viên đã đăng nhập" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi hệ thống" })
    }
}

export const HandleEmplyoeeLogout = async (req, res) => {
    try {
        res.clearCookie("EMtoken")
        return res.status(200).json({ success: true, message: "Đăng xuất thành công" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" })
    }
}

export const HandleEmplyoeeForgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const employee = await Employee.findOne({ email: email, organizationID: req.ORGID })

        if (!employee) {
            return res.status(401).json({ success: false, message: "Email nhân viên không tồn tại, vui lòng nhập lại đúng email" })
        }

        const resetToken = crypto.randomBytes(25).toString('hex')
        const resetTokenExpires = Date.now() + 1000 * 60 * 60 // 1 giờ

        employee.resetpasswordtoken = resetToken;
        employee.resetpasswordexpires = resetTokenExpires;
        await employee.save()

        const URL = `${process.env.CLIENT_URL}/auth/employee/resetpassword/${resetToken}`
        const SendForgotPasswordEmailStatus = await SendForgotPasswordEmail(email, URL)
        return res.status(200).json({ success: true, message: "Email đặt lại mật khẩu đã được gửi thành công", SendForgotPasswordEmailStatus: SendForgotPasswordEmailStatus })

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleEmplyoeeSetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    try {
        if (req.cookies.token) {
            res.clearCookie("EMtoken")
        }
        const employee = await Employee.findOne({ resetpasswordtoken: token, resetpasswordexpires: { $gt: Date.now() } })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", resetpassword: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        employee.password = hashedPassword
        employee.resetpasswordtoken = undefined
        employee.resetpasswordexpires = undefined
        await employee.save()

        const SendResetPasswordConfimationStatus = await SendResetPasswordConfimation(employee.email)
        return res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công", SendResetPasswordConfimationStatus: SendResetPasswordConfimationStatus, resetpassword: true })
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleEmployeeCheckVerifyEmail = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.EMid, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên", type: "Employeecodeavailable" })
        }

        if (employee.isverified) {
            return res.status(200).json({ success: false, message: "Email nhân viên đã được xác thực", type: "Employeecodeavailable" })
        }

        if ((employee.verificationtoken) && (employee.verificationtokenexpires > Date.now())) {
            return res.status(200).json({ success: true, message: "Mã xác thực vẫn còn hiệu lực", type: "Employeecodeavailable" })
        }

        return res.status(200).json({ success: false, message: "Mã xác thực không hợp lệ hoặc đã hết hạn", type: "Employeecodeavailable" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}