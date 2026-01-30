import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/common/loading.jsx";
import { ListWrapper, HeadingBar, ListContainer } from "../../../components/common/Dashboard/ListDesigns";

import { HandleGetHRs, HandleDeleteHR } from "../../../redux/Thunks/HRProfileThunk.js";
import { ViewHRDialogBox } from "../../../components/common/Dashboard/HR/ViewHRDialogBox.jsx";

export const HRManagementPage = () => {
  const dispatch = useDispatch();
  const hrState = useSelector((state) => state.HRManagementReducer);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const table_headings = ["Nhân sự", "Email", "Liên hệ", "Vai trò", "Hành động"];

  // Fetch data
  useEffect(() => {
    dispatch(HandleGetHRs({ apiroute: "GETALL" }));
  }, [dispatch]);

  // Re-fetch when success actions occur
  useEffect(() => {
    if (hrState.fetchData) {
      dispatch(HandleGetHRs({ apiroute: "GETALL" }));
      setCurrentPage(1);
    }
  }, [hrState.fetchData, dispatch]);

  /* LOGIC: SEARCH & FILTER */
  const filteredData = (hrState.data || []).filter((item) => {
    const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
    const email = item.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  /* LOGIC: PAGINATION */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (hrState.isLoading) return <Loading />;

  return (
    <div className="w-full mx-auto my-5 flex flex-col gap-5 h-[94%] px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý nhân sự</h1>
        <p className="text-gray-500 font-medium">Tổng số: {filteredData.length}</p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col w-full sm:w-1/3">
          <label className="text-sm font-bold text-gray-600 mb-1">Tìm kiếm nhân sự</label>
          <input
            type="text"
            placeholder="Nhập tên hoặc email..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button 
          onClick={() => setSearchTerm("")}
          className="px-4 py-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          Xóa lọc
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 flex flex-col min-h-0">
        <ListWrapper>
          <HeadingBar
            table_layout="grid-cols-5"
            table_headings={table_headings}
          />
        </ListWrapper>

        <ListContainer>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {currentItems.length > 0 ? (
              currentItems.map((hr) => (
                <div 
                  key={hr._id} 
                  className="grid grid-cols-5 items-center p-4 bg-white border rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-gray-700">
                    {hr.firstname} {hr.lastname}
                  </div>
                  <div className="text-gray-600 truncate pr-2">{hr.email}</div>
                  <div className="text-gray-600">{hr.contactnumber || "N/A"}</div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                      {hr.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ViewHRDialogBox hr={hr} />
                    <button
                      onClick={() => {
                        if(window.confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) {
                          dispatch(HandleDeleteHR({ apiroute: `DELETE.${hr._id}` }));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">Không tìm thấy nhân sự nào.</div>
            )}
          </div>
        </ListContainer>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl border-2 transition-all font-semibold ${
                currentPage === i + 1
                  ? "bg-gray-800 text-white border-gray-800 shadow-lg"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};