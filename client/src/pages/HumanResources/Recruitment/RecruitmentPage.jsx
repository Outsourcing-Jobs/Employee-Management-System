import { ListWrapper, HeadingBar,  ListContainer, RecruitmentList } from "../../../components/common/Dashboard/ListDesigns.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/common/loading.jsx";
// import { CreateRecruitmentDialogBox } from "../../../components/common/Dashboard/dialogboxes";
import { HandleDeleteRecruitment, HandleGetRecruitments, HandlePatchRecruitment, HandlePostRecruitment } from "../../../redux/Thunks/HRRecruitmentPageThunk.js";

export const RecruitmentPage = () => {
  const dispatch = useDispatch();
  const RecruitmentState = useSelector(
    (state) => state.HRRecruitmentPageReducer
  );
  const [editingRecruitment, setEditingRecruitment] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    jobtitle: "",
    department: "",
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
        apiroute: "CREATE",
        data: formData
      })
    );
    setOpenCreate(false);
  };

  const handleUpdate = () => {
    dispatch(
      HandlePatchRecruitment({
        apiroute: "UPDATE",
        data: editingRecruitment
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
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Phòng Phát triển Phần mềm">Phòng Phát triển Phần mềm</option>
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
                      ${
                        isActive
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
    </div>
  );
};
