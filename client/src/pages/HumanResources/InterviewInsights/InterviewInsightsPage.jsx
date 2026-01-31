import {
  ListWrapper,
  HeadingBar,
  ListContainer,
  InterviewInsightsList
} from "../../../components/common/Dashboard/ListDesigns.jsx";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/common/loading.jsx";
import dayjs from "dayjs";

import {
  HandleGetInterviewInsights,
  HandleDeleteInterviewInsight
} from "../../../redux/Thunks/InterviewInsightsThunk.js";


export const InterviewInsightsPage = () => {
  const dispatch = useDispatch();
  const InterviewState = useSelector(
    (state) => state.InterviewInsightsReducer
  );

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: ""
  });

  const table_headings = [
    "Ứng viên",
    "Người phỏng vấn",
    "Ngày phỏng vấn",
    "Trạng thái",
    "Hành động"
  ];

  /* FILTER */
  const filteredData = (InterviewState.data || []).filter((item) => {
    const getDateOnly = (date) =>
      new Date(date).toISOString().split("T")[0];

    const interviewDate = getDateOnly(item.interviewdate);

    if (filters.dateFrom) {
      const from = getDateOnly(filters.dateFrom);
      if (interviewDate < from) return false;
    }

    if (filters.dateTo) {
      const to = getDateOnly(filters.dateTo);
      if (interviewDate > to) return false;
    }

    return true;
  });

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    dispatch(
      HandleGetInterviewInsights({ apiroute: "GETALL" })
    );
  }, []);

  useEffect(() => {
    if (InterviewState.fetchData) {
      dispatch(
        HandleGetInterviewInsights({ apiroute: "GETALL" })
      );
      setCurrentPage(1);
    }
  }, [InterviewState.fetchData]);

  if (InterviewState.isLoading) return <Loading />;

  return (
    <div className="w-full mx-auto my-5 flex flex-col gap-5 h-[94%]">
      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Đánh giá & nhận xét phỏng vấn
      </h1>

      {/* FILTER */}
     <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-600">
            Từ ngày
            </label>
            <input
            type="date"
            className="border rounded-lg px-3 py-2 w-full"
            value={filters.dateFrom}
            onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
            }
            />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-600">
            Đến ngày
            </label>
            <input
            type="date"
            className="border rounded-lg px-3 py-2 w-full"
            value={filters.dateTo}
            onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
            }
            />
        </div>

        <button
            onClick={() => setFilters({ dateFrom: "", dateTo: "" })}
            className="px-4 py-2 rounded-lg border-2 border-gray-400 text-gray-500 w-full sm:w-auto"
        >
            Reset
        </button>
    </div>

      {/* TABLE */}
      <ListWrapper>
        <HeadingBar
          table_layout="grid-cols-5"
          table_headings={table_headings}
        />
      </ListWrapper>

      <ListContainer>
        <InterviewInsightsList
          data={currentItems}
          onDelete={(id) =>
            dispatch(
              HandleDeleteInterviewInsight({
                apiroute: `DELETE.${id}`
              })
            )
          }
        />
      </ListContainer>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-lg border-2 ${
                currentPage === i + 1
                  ? "bg-gray-500 text-white"
                  : "text-gray-500"
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
