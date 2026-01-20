import { HumanResources } from "../models/HR.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { GenerateJwtTokenAndSetCookiesHR } from "../utils/generatejwttokenandsetcookies.js"
import { SendVerificationEmail, SendWelcomeEmail, SendForgotPasswordEmail, SendResetPasswordConfimation } from "../mailtrap/emails.js"
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js"
import { Organization } from "../models/Organization.model.js"

export const HandleHRSignup = async (req, res) => {
    try {
        const { firstname, lastname, email, password, contactnumber, name, description, OrganizationURL, OrganizationMail } = req.body

        if (!name || !description || !OrganizationURL || !OrganizationMail) {
            throw new Error("Vui lòng nhập đầy đủ thông tin tổ chức")
        }

        if (!firstname || !lastname || !email || !password || !contactnumber) {
            throw new Error("Vui lòng nhập đầy đủ thông tin cá nhân")
        }

        const organization = await Organization.findOne({ name: name, OrganizationURL: OrganizationURL, OrganizationMail: OrganizationMail })

        const HR = await HumanResources.findOne({ email: email })

        if (HR) {
            return res.status(400).json({ success: false, message: "Tài khoản HR đã tồn tại, vui lòng đăng nhập hoặc tạo tài khoản mới", type: "signup" })
        }

        if (!organization && !HR) {

            const newOrganization = await Organization.create({
                name,
                description,
                OrganizationURL,
                OrganizationMail
            })

            const hashedpassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newHR = await HumanResources.create({
                firstname,
                lastname,
                email,
                password: hashedpassword,
                contactnumber,
                role: "HR-Admin",
                organizationID: newOrganization._id,
                verificationtoken: verificationcode,
                verificationtokenexpires: Date.now() + 5 * 60 * 1000
            })

            newOrganization.HRs.push(newHR._id)
            await newOrganization.save()

            GenerateJwtTokenAndSetCookiesHR(res, newHR._id, newHR.role, newOrganization._id)
            const VerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
            return res.status(201).json({ success: true, message: "Tạo tổ chức và đăng ký tài khoản HR thành công", VerificationEmailStatus: VerificationEmailStatus, type: "signup", HRid: newHR._id })
        }

        if (organization && !HR) {

            const hashedpassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newHR = await HumanResources.create({
                firstname,
                lastname,
                email,
                password: hashedpassword,
                contactnumber,
                role: "HR-Admin",
                organizationID: organization._id,
                verificationtoken: verificationcode,
                verificationtokenexpires: Date.now() + 5 * 60 * 1000
            })

            organization.HRs.push(newHR._id)
            await organization.save()

            GenerateJwtTokenAndSetCookiesHR(res, newHR._id, newHR.role, organization._id)
            const VerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
            return res.status(201).json({ success: true, message: "Đăng ký tài khoản HR vào tổ chức thành công", type: "signup", VerificationEmailStatus: VerificationEmailStatus, HRid: newHR._id })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "signup" })
    }
}

export const HandleHRVerifyEmail = async (req, res) => {
    const { verificationcode } = req.body
    try {
        const HR = await HumanResources.findOne({ verificationtoken: verificationcode, organizationID: req.ORGID, verificationtokenexpires: { $gt: Date.now() } })

        if (!HR) {
            return res.status(401).json({ success: false, message: "Mã xác thực không hợp lệ hoặc đã hết hạn", type: "HRverifyemail" })
        }

        HR.isverified = true;
        HR.verificationtoken = undefined;
        HR.verificationtokenexpires = undefined;
        await HR.save()

        const SendWelcomeEmailStatus = await SendWelcomeEmail(HR.email, HR.firstname, HR.lastname, HR.role)
        return res.status(200).json({ success: true, message: "Xác thực Email thành công", SendWelcomeEmailStatus: SendWelcomeEmailStatus, type: "HRverifyemail" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "HRverifyemail" })
    }
}


export const HandleHRLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const HR = await HumanResources.findOne({ email: email })

        if (!HR) {
            return res.status(400).json({ success: false, message: "Thông tin đăng nhập không chính xác, vui lòng thử lại", type: "HRLogin" })
        }

        const isMatch = await bcrypt.compare(password, HR.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Thông tin đăng nhập không chính xác, vui lòng thử lại", type: "HRLogin" })
        }

        GenerateJwtTokenAndSetCookiesHR(res, HR._id, HR.role, HR.organizationID)
        HR.lastlogin = new Date()
        await HR.save()
        return res.status(200).json({ success: true, message: "Đăng nhập quyền quản trị (HR) thành công", type: "HRLogin" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error, type: "HRLogin" })
    }
}

export const HandleHRLogout = async (req, res) => {
    try {
        res.clearCookie("HRtoken")
        return res.status(200).json({ success: true, message: "Đăng xuất tài khoản HR thành công" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleHRCheck = async (req, res) => {
    try {
        const HR = await HumanResources.findOne({ _id: req.HRid, organizationID: req.ORGID })
        if (!HR) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin HR", type: "checkHR" })
        }
        return res.status(200).json({ success: true, message: "HR đã đăng nhập", type: "checkHR" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "Lỗi hệ thống", type: "checkHR" })
    }
}

export const HandleHRForgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const HR = await HumanResources.findOne({ email: email, organizationID: req.ORGID, _id: req.HRid })

        if (!HR) {
            return res.status(404).json({ success: false, message: "Email HR không tồn tại, vui lòng kiểm tra lại", type: "HRforgotpassword" })
        }

        const resetToken = crypto.randomBytes(25).toString('hex')
        const resetTokenExpires = Date.now() + 1000 * 60 * 60 // 1 giờ 

        HR.resetpasswordtoken = resetToken;
        HR.resetpasswordexpires = resetTokenExpires;
        await HR.save()

        const URL = `${process.env.CLIENT_URL}/auth/HR/resetpassword/${resetToken}`
        const SendResetPasswordEmailStatus = await SendForgotPasswordEmail(email, URL)
        return res.status(200).json({ success: true, message: "Email đặt lại mật khẩu đã được gửi thành công", SendResetPasswordEmailStatus: SendResetPasswordEmailStatus, type: "HRforgotpassword" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error, type: "HRforgotpassword" })
    }
}

export const HandleHRResetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    try {
        if (req.cookies.HRtoken) {
            res.clearCookie("HRtoken")
        }

        const HR = await HumanResources.findOne({ resetpasswordtoken: token, resetpasswordexpires: { $gt: Date.now() } })

        if (!HR) {
            return res.status(401).json({ success: false, message: "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", resetpassword: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        HR.password = hashedPassword
        HR.resetpasswordtoken = undefined;
        HR.resetpasswordexpires = undefined;
        await HR.save()

        const SendPasswordResetEmailStatus = await SendResetPasswordConfimation(HR.email)
        return res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công", SendPasswordResetEmailStatus: SendPasswordResetEmailStatus, resetpassword: true })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error, resetpassword: false })
    }
}

export const HandleHRResetverifyEmail = async (req, res) => {
    const { email } = req.body
    try {
        const HR = await HumanResources.findOne({ email: email, _id: req.HRid, organizationID: req.ORGID })

        if (!HR) {
            return res.status(404).json({ success: false, message: "Email HR không tồn tại, vui lòng nhập đúng email", type: "HRResendVerifyEmail" })
        }

        if (HR.isverified) {
            return res.status(400).json({ success: false, message: "Email HR đã được xác thực trước đó", type: "HRResendVerifyEmail" })
        }

        const verificationcode = GenerateVerificationToken(6)
        HR.verificationtoken = verificationcode
        HR.verificationtokenexpires = Date.now() + 5 * 60 * 1000

        await HR.save()

        const SendVerificationEmailStatus = await SendVerificationEmail(email, verificationcode)
        return res.status(200).json({ success: true, message: "Mã xác thực mới đã được gửi thành công", SendVerificationEmailStatus: SendVerificationEmailStatus, type: "HRResendVerifyEmail" })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleHRcheckVerifyEmail = async (req, res) => {
    try {
        const HR = await HumanResources.findOne({ _id: req.HRid, organizationID: req.ORGID })

        if (HR.isverified) {
            return res.status(200).json({ sucess: true, message: "Email HR đã được xác thực", type: "HRcodeavailable", alreadyverified: true })
        }

        if ((HR.verificationtoken) && (HR.verificationtokenexpires > Date.now())) {
            return res.status(200).json({ success: true, message: "Mã xác thực hiện tại vẫn còn hiệu lực", type: "HRcodeavailable" })
        }

        return res.status(404).json({ success: false, message: "Mã xác thực không hợp lệ hoặc đã hết hạn", type: "HRcodeavailable" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error, type: "HRcodeavailable" })
    }
}