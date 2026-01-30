import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetRequests, HandleUpdateRequestStatus } from "../../../redux/Thunks/GenerateRequestThunk";

const HRInternalRequestsPage = () => {
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useSelector(
    (state) => state.GenerateRequestReducer
  );
  console.log("Internal Requests Data:", data);
  const [filters, setFilters] = useState({
    status: "Pending",
    employeeId: "",
    departmentId: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenModal(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setOpenModal(false);
  };

  /* FETCH DATA */
  useEffect(() => {
    dispatch(HandleGetRequests(filters));
  }, [filters]);

  return (
    <div className="p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý yêu cầu nội bộ
        </h1>
        <p className="text-sm text-gray-500">
          Danh sách yêu cầu từ nhân viên
        </p>
      </div>

      {/* ===== FILTER ===== */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* STATUS */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Trạng thái
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Tất cả</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Từ chối</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Phòng ban
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={filters.departmentId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  departmentId: e.target.value,
                })
              }
            >
              <option value="">Tất cả</option>
              {/* map department ở đây */}
            </select>
          </div>

          {/* FROM DATE */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Từ ngày
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDate: e.target.value,
                })
              }
            />
          </div>

          {/* TO DATE */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Đến ngày
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* SORT */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="requesttitle">Tiêu đề</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2"
            value={filters.order}
            onChange={(e) =>
              setFilters({ ...filters, order: e.target.value })
            }
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                status: "",
                employeeId: "",
                departmentId: "",
                startDate: "",
                endDate: "",
                sortBy: "createdAt",
                order: "desc",
              })
            }
            className="px-4 py-2 border rounded-lg text-gray-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : data?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có yêu cầu nào
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Nhân viên</th>
                <th className="px-4 py-3 text-left">Phòng ban</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-semibold">
                    {item.requesttitle}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.employee.firstname}{" "}
                      {item.employee.lastname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.employee.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {item.department.name}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          item.status === "Pending" &&
                          "bg-yellow-100 text-yellow-700"
                        }
                        ${
                          item.status === "Approved" &&
                          "bg-green-100 text-green-700"
                        }
                        ${
                          item.status === "Rejected" &&
                          "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {new Date(item.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleViewRequest(item)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {openModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* HEADER */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Chi tiết yêu cầu
            </h2>

            {/* CONTENT */}
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold">Tiêu đề:</span>{" "}
                {selectedRequest.requesttitle}
              </div>

              <div>
                <span className="font-semibold">Nội dung:</span>
                <p className="mt-1 text-gray-600 whitespace-pre-line">
                  {selectedRequest.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Nhân viên:</span>
                  <div>
                    {selectedRequest.employee.firstname}{" "}
                    {selectedRequest.employee.lastname}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedRequest.employee.email}
                  </div>
                </div>

                <div>
                  <span className="font-semibold">Phòng ban:</span>
                  <div>{selectedRequest.department.name}</div>
                </div>
              </div>

              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                <span className="font-medium">
                  {selectedRequest.status}
                </span>
              </div>

              <div>
                <span className="font-semibold">Ngày tạo:</span>{" "}
                {new Date(
                  selectedRequest.createdAt
                ).toLocaleDateString("vi-VN")}
              </div>
            </div>

            {/* ACTIONS */}
            {selectedRequest.status === "Pending" && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() =>
                    dispatch(
                      HandleUpdateRequestStatus({
                        requestID: selectedRequest._id,
                        status: "Rejected",
                      })
                    )
                  }
                >
                  Từ chối
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={() =>
                    dispatch(
                      HandleUpdateRequestStatus({
                        requestID: selectedRequest._id,
                        status: "Approved",
                      })
                    )
                  }
                >
                  Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HRInternalRequestsPage;
