import { CorporateCalendar } from "../models/CorporateCalendar.model.js"

export const HandleCreateEvent = async (req, res) => {
    try {
        const { eventtitle, eventdate, description, audience } = req.body

        if (!eventtitle || !eventdate || !description || !audience) {
            return res.status(400).json({ success: false, message: "Tất cả các trường thông tin là bắt buộc" })
        }

        const event = await CorporateCalendar.findOne({ eventtitle: eventtitle, organizationID: req.ORGID })

        if (event) {
            return res.status(409).json({ success: false, message: "Sự kiện này đã tồn tại" })
        }

        const newEvent = await CorporateCalendar.create({
            eventtitle: eventtitle,
            eventdate: eventdate,
            description: description,
            audience: audience,
            organizationID: req.ORGID
        })

        return res.status(200).json({ success: true, message: "Tạo sự kiện thành công", data: newEvent })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleAllEvents = async (req, res) => {
    try {
        const events = await CorporateCalendar.find({ organizationID: req.ORGID })
        return res.status(200).json({ success: true, message: "Lấy danh sách sự kiện thành công", data: events })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleEvent = async (req, res) => {
    try {
        const { eventID } = req.params
        const event = await CorporateCalendar.findOne({ _id: eventID, organizationID: req.ORGID })

        if (!event) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện" })
        }

        return res.status(200).json({ success: true, message: "Lấy chi tiết sự kiện thành công", data: event })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleUpdateEvent = async (req, res) => {
    try {
        const { eventID, updatedData } = req.body
        const event = await CorporateCalendar.findByIdAndUpdate(eventID, updatedData, { new: true })

        if (!event) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện để cập nhật" })
        }

        return res.status(200).json({ success: true, message: "Cập nhật sự kiện thành công", data: event })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}

export const HandleDeleteEvent = async (req, res) => {
    try {
        const { eventID } = req.params
        const deletedEvent = await CorporateCalendar.findByIdAndDelete(eventID)

        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện để xóa" })
        }

        return res.status(200).json({ success: true, message: "Xóa sự kiện thành công" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: error })
    }
}