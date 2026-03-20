import { ListWrapper, HeadingBar, ListContainer, RecruitmentList } from "../../../components/common/Dashboard/ListDesigns.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/common/loading.jsx";
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk.js";
import { HandleDeleteRecruitment, HandleGetRecruitments, HandlePatchRecruitment, HandlePostRecruitment } from "../../../redux/Thunks/HRRecruitmentPageThunk.js";

export const RecruitmentPage = () => {
  const dispatch = useDispatch();
  const RecruitmentState = useSelector(
    (state) => state.HRRecruitmentPageReducer
  );
  const departmentState = useSelector(
    (state) => state.HRDepartmentPageReducer
  );
  const [editingRecruitment, setEditingRecruitment] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    jobtitle: "",
    departmentID: "",
    description: ""
  });

  const [filters, setFilters] = useState({
    department: "ALL",
    dateFrom: "",
    dateTo: ""
  });

  const filteredRecruitments = (RecruitmentState.data || []).filter((item) => {
    // FILTER PHÒNG BAN
    if (
      filters.department !== "ALL" &&
      item.department !== filters.department
    ) {
      return false;
    }

    // FILTER NGÀY
    const getDateOnly = (date) =>
      new Date(date).toISOString().split("T")[0];

    const createdDate = getDateOnly(item.createdAt);
    if (filters.dateFrom) {
      const fromDate = getDateOnly(filters.dateFrom);
      if (createdDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const toDate = getDateOnly(filters.dateTo);
      if (createdDate > toDate) return false;
    }
    return true;
  });

  const table_headings = [
    "Vị trí tuyển dụng",
    "Phòng ban",
    "Số ứng viên",
    "Ngày tạo",
    "Hành động"
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentRecruitments =
    filteredRecruitments?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const totalPages = Math.ceil(
    (filteredRecruitments?.length || 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (RecruitmentState.fetchData) {
      dispatch(HandleGetRecruitments({ apiroute: "GETALL" }));
      setCurrentPage(1);
    }
    console.log("RecruitmentState.fetchData changed", RecruitmentState.fetchData);
  }, [RecruitmentState.fetchData]);

  useEffect(() => {
    dispatch(HandleGetRecruitments({ apiroute: "GETALL" }));
    dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleDelete = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá tuyển dụng này?")) return;

    dispatch(
      HandleDeleteRecruitment({
        apiroute: `DELETE.${id}`
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      HandlePostRecruitment({
        apiroute: "ADD",
        data: formData
      })
    );
    setOpenCreate(false);
    setFormData({ jobtitle: "", departmentID: "", description: "" });
  };

  const handleUpdate = () => {
    dispatch(
      HandlePatchRecruitment({
        apiroute: "UPDATE",
        data: {
          recruitmentID: editingRecruitment._id,
          jobtitle: editingRecruitment.jobtitle,
          description: editingRecruitment.description,
          departmentID: editingRecruitment.departmentID || editingRecruitment.department?._id || ""
        }
      })
    );
    setEditingRecruitment(null);
  };

  if (RecruitmentState.isLoading) {
    return <Loading />;
  }

  return (
    <div className="recruitment-page-content w-full mx-auto my-5 flex flex-col gap-5 h-[94%]">
      {/* HEADER */}
      <div className="flex items-center justify-between md:pe-5">
        <h1 className="min-[250px]:text-xl md:text-3xl font-bold">
          Tuyển dụng
        </h1>
        {/* <CreateRecruitmentDialogBox /> */}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-end md:pe-5">
        {/* PHÒNG BAN */}
        {/* <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600">
          Phòng ban
        </label>
        <select
          className="border rounded-lg px-3 py-2"
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
        >
          <option value="ALL">Tất cả</option>
          {departmentState?.data?.map((dept) => (
             <option key={dept._id} value={dept._id}>
                {dept.name}
             </option>
          ))} 
        </select>
      </div> */}

        {/* TỪ NGÀY */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">
            Từ ngày
          </label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
          />
        </div>

        {/* ĐẾN NGÀY */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">
            Đến ngày
          </label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters({ ...filters, dateTo: e.target.value })
            }
          />
        </div>

        {/* RESET */}
        <button
          onClick={() =>
            setFilters({ department: "ALL", dateFrom: "", dateTo: "" })
          }
          className="px-4 py-2 rounded-lg border-2 border-gray-400 text-gray-500 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {/* DATA */}
      <div className="flex flex-col gap-4 md:pe-5">
        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          + Thêm tuyển dụng
        </button>

        <ListWrapper>
          <HeadingBar
            table_layout={"grid-cols-5"}
            table_headings={table_headings}
          />
        </ListWrapper>

        <ListContainer>
          <RecruitmentList
            TargetedState={{
              data: currentRecruitments,
              type: "recruitment"
            }}
            onDelete={handleDelete}
            onEdit={setEditingRecruitment}
          />
        </ListContainer>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-50"
            >
              Trước
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = currentPage === pageNumber;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold border-2 transition-all
                      ${isActive
                        ? "bg-gray-500 border-gray-500 text-white scale-110"
                        : "border-gray-500 text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* CREATE DIALOG */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-[50px]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thêm tuyển dụng</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Vị trí (Job title)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.jobtitle}
                  onChange={(e) => setFormData({ ...formData, jobtitle: e.target.value })}
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phòng ban (Department)</label>
                <select
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.departmentID}
                  onChange={(e) => setFormData({ ...formData, departmentID: e.target.value })}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departmentState?.data?.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả (Description)</label>
                <textarea
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job details..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DIALOG */}
      {editingRecruitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-[50px]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Sửa tuyển dụng</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Vị trí</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingRecruitment.jobtitle}
                  onChange={(e) => setEditingRecruitment({ ...editingRecruitment, jobtitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả</label>
                <textarea
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  value={editingRecruitment.description}
                  onChange={(e) => setEditingRecruitment({ ...editingRecruitment, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phòng ban</label>
                <select
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingRecruitment.departmentID || editingRecruitment.department?._id || ""}
                  onChange={(e) => setEditingRecruitment({ ...editingRecruitment, departmentID: e.target.value })}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departmentState?.data?.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditingRecruitment(null)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
