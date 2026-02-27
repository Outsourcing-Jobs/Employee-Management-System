import { ListContainer, ListItems, ListWrapper } from "../../../components/common/Dashboard/ListDesigns.jsx";
import { HeadingBar } from "../../../components/common/Dashboard/ListDesigns.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js";
import { Loading } from "../../../components/common/loading.jsx";
import { AddEmployeesDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx";
import { Download } from "lucide-react";
import { HandleGetReport } from "../../../redux/Thunks/ReportThunk.js";

export const HREmployeesPage = () => {
  const dispatch = useDispatch();
  const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer);
  const table_headings = [
    "Họ và tên ",
    "Email",
    "Phòng ban",
    "Số điện thoại",
    "Hành động ",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentEmployees =
    HREmployeesState.data?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil(
    (HREmployeesState.data?.length || 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    if (HREmployeesState.fetchData) {
      dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
      setCurrentPage(1);
    }
  }, [HREmployeesState.fetchData]);

  useEffect(() => {
    dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
  }, []);

  if (HREmployeesState.isLoading) {
    return <Loading />;
  }

  const handleExportListEmployee = () => {
        dispatch(
        HandleGetReport({
            apiroute: "EXPORT_ALL_EMPLOYEES",
            // params: { month, year },
            responseType: "blob", // vì thường export là file
        })
        );
  };

  return (
    <div className="employee-page-content w-full mx-auto my-5 flex flex-col gap-5 h-[94%]">
      <div className="flex items-center justify-between employees-heading md:pe-5 ">
        <h1 className="min-[250px]:text-xl md:text-3xl font-bold">
          Nhân viên{" "}
        </h1>
        <div className="employee-crate-button ">
          <AddEmployeesDialogBox />
        </div>
        <button 
          onClick={handleExportListEmployee}
          className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all bg-green-600 rounded-xl hover:bg-green-700">
          <Download size={18} /> Xuất báo cáo
        </button>
      </div>
      <div className="flex flex-col gap-4 employees-data md:pe-5">
        <ListWrapper>
          <HeadingBar
            table_layout={"grid-cols-5"}
            table_headings={table_headings}
          />
        </ListWrapper>
        <ListContainer>
          <ListItems TargetedState={{ data: currentEmployees }} />
        </ListContainer>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
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
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all duration-200 border-2 
                            ${
                              isActive
                                ? "bg-gray-500 border-gray-500 text-white shadow-md scale-110"
                                : "border-gray-500 text-gray-500 hover:bg-gray-100"
                            }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Nút Sau */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
