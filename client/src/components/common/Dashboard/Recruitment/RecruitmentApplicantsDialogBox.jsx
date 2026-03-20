import { useState } from "react";
import { useDispatch } from "react-redux";
import { apiService } from "../../../../redux/apis/apiService.js";
import { HandleGetRecruitments } from "../../../../redux/Thunks/HRRecruitmentPageThunk.js";

export const RecruitmentApplicantsDialogBox = ({ recruitment }) => {
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contactnumber: "",
    appliedrole: recruitment.jobtitle,
    recruitmentID: recruitment._id,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddApplicant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.post("/api/v1/applicant/create-applicant", formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        setOpenAdd(false);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          contactnumber: "",
          appliedrole: recruitment.jobtitle,
          recruitmentID: recruitment._id,
        });
        // Tải lại toàn bộ dữ liệu tuyển dụng để frontend update danh sách mới
        dispatch(HandleGetRecruitments({ apiroute: "GETALL" }));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi thêm ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const applications = recruitment.application || [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 outline-none"
      >
        Chi tiết
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[700px] p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">
                Danh sách ứng viên
              </h2>
              <button
                onClick={() => setOpenAdd(!openAdd)}
                className="px-4 py-2 bg-blue-600 font-semibold text-white rounded-lg text-sm shadow hover:bg-blue-700 transition"
              >
                {openAdd ? "Hủy Thêm" : "+ Thêm ứng viên"}
              </button>
            </div>

            {openAdd && (
              <form
                onSubmit={handleAddApplicant}
                className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4 space-y-3"
              >
                <h3 className="font-semibold text-lg text-blue-800">
                  Thêm Ứng Viên Mới
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ (First name)</label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tên (Last name)</label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số điện thoại
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.contactnumber}
                      onChange={(e) =>
                        setFormData({ ...formData, contactnumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Vị trí ứng tuyển (Fixed)
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded p-2 text-sm bg-gray-200 cursor-not-allowed text-gray-700"
                      value={formData.appliedrole}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 transition"
                  >
                    {loading ? "Đang xử lý..." : "Lưu ứng viên"}
                  </button>
                </div>
              </form>
            )}

            <div className="max-h-[400px] overflow-auto space-y-2 pr-1">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="border rounded-lg p-3 flex justify-between items-center shadow-sm hover:shadow transition bg-white"
                  >
                    <div>
                      <div className="font-semibold text-gray-800 text-md flex items-center gap-2">
                        {app.firstname} {app.lastname}
                      </div>
                      <div className="text-sm text-gray-500 font-medium my-0.5">
                        {app.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        Vị trí: <span className="font-medium">{app.appliedrole}</span>
                      </div>
                    </div>

                    <span className="text-xs px-3 py-1 font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
                      {app.recruitmentstatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-6 bg-gray-50 rounded-lg border border-dashed text-sm">
                  Chưa có ứng viên nào cho vị trí này.
                </div>
              )}
            </div>

            <div className="flex justify-end mt-5 border-t pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 bg-gray-500 font-semibold text-white rounded-lg hover:bg-gray-600 transition shadow"
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
