import { useState } from "react";
import dayjs from "dayjs";

export const ViewHRDialogBox = ({ hr }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
      >
        Chi tiết
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Thông tin nhân sự</h2>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                hr.isverified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {hr.isverified ? "Đã xác minh" : "Chưa xác minh"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3">
                <b className="text-gray-600">Họ tên:</b>
                <span className="col-span-2 font-medium">{hr.firstname} {hr.lastname}</span>
              </div>

              <div className="grid grid-cols-3">
                <b className="text-gray-600">Email:</b>
                <span className="col-span-2">{hr.email}</span>
              </div>

              <div className="grid grid-cols-3">
                <b className="text-gray-600">Điện thoại:</b>
                <span className="col-span-2">{hr.contactnumber || "Chưa cập nhật"}</span>
              </div>

              <div className="grid grid-cols-3">
                <b className="text-gray-600">Vai trò:</b>
                <span className="col-span-2 italic text-blue-600 font-semibold">{hr.role}</span>
              </div>

              <div className="grid grid-cols-3 border-t pt-3">
                <b className="text-gray-600 text-sm">Đăng nhập cuối:</b>
                <span className="col-span-2 text-sm">
                  {hr.lastlogin ? dayjs(hr.lastlogin).format("DD/MM/YYYY HH:mm") : "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3">
                <b className="text-gray-600 text-sm">Ngày tạo:</b>
                <span className="col-span-2 text-sm text-gray-500">
                  {dayjs(hr.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};