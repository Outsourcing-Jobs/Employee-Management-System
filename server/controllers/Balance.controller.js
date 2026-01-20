import { Balance } from "../models/Balance.model.js"

export const HandleCreateBalance = async (req, res) => {
    try {
        const { title, description, availableamount, totalexpenses, expensemonth } = req.body

        if (!title || !description || !availableamount || !totalexpenses || !expensemonth) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const balance = await Balance.findOne({
            expensemonth,
        })

        if (balance) {
            return res.status(409).json({ success: false, message: "Bản ghi số dư cho tháng này đã tồn tại" })
        }

        const newbalance = await Balance.create({
            title,
            description,
            availableamount,
            totalexpenses,
            expensemonth,
            submitdate: new Date(),
            organizationID: req.ORGID,
            createdBy: req.HRid
        })

        return res.json({ success: true, message: "Tạo bản ghi số dư thành công", balance: newbalance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleAllBalances = async (req, res) => {
    try {
        const balances = await Balance.find({ organizationID: req.ORGID })
        return res.status(200).json({ success: true, message: "Lấy danh sách số dư thành công", balances: balances })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleBalance = async (req, res) => {
    try {
        const { balanceID } = req.params
        const balance = await Balance.findOne({ _id: balanceID, organizationID: req.ORGID })

        if (!balance) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi số dư" })
        }

        return res.status(200).json({ success: true, message: "Tìm thấy bản ghi số dư thành công", balance: balance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleUpdateBalance = async (req, res) => {
    try {
        const { balanceID, UpdatedData } = req.body
        const balance = await Balance.findByIdAndUpdate(balanceID, UpdatedData, { new: true })
        if (!balance) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi số dư để cập nhật" })
        }
        return res.status(200).json({ success: true, message: "Cập nhật bản ghi số dư thành công", data: balance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleDeleteBalance = async (req, res) => {
    try {
        const { balanceID } = req.params
        const deletedBalance = await Balance.findByIdAndDelete(balanceID)
        if (!deletedBalance) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi số dư để xóa" })
        }
        return res.status(200).json({ success: true, message: "Xóa bản ghi số dư thành công" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}